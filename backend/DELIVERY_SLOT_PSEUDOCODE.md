# Task 2 — Delivery Slot Allocation (Detailed Pseudocode)

This is a design document, not runnable code. It describes the backend logic for a
customer-facing app where users book delivery slots of limited capacity.

## 1. Overview

The system must, for every incoming booking request:

1. Allocate delivery slots dynamically based on current availability.
2. Prevent overbooking by tracking the number of booked slots per slot.
3. Suggest alternative slots when the customer's preferred slot is unavailable.
4. Treat each slot as a **shared resource** — many customers can request the same
   slot at the same moment, so availability checks and capacity updates must be
   safe under concurrency.

## 2. Data model

```
Slot:
  id            # unique identifier
  date          # calendar date the slot belongs to
  startTime     # e.g. 14:00
  endTime       # e.g. 16:00
  capacity      # max bookings this slot can hold
  bookedCount   # current number of confirmed bookings (starts at 0)

Booking:
  id            # unique identifier
  slotId        # the slot this booking was placed against
  customerId
  orderId
  status        # CONFIRMED | CANCELLED
  createdAt
```

`bookedCount` is the field every concurrent request contends on — it is called
out here because section 5 builds the overbooking fix directly around it.

## 3. Booking request flow (happy path)

```
function bookDeliverySlot(orderId, customerId, preferredSlotId):

    slot = findSlotById(preferredSlotId)

    if slot does not exist:
        return bookingFailure(reason = "SLOT_NOT_FOUND",
                               alternatives = suggestAlternativeSlots(orderId))

    bookingResult = tryReserveSlot(slot.id)          # see section 5 — atomic step

    if bookingResult.success:
        booking = createBooking(orderId, customerId, slot.id, status = "CONFIRMED")
        return bookingSuccess(booking, slot)
    else:
        # slot was full (either already full, or became full concurrently)
        alternatives = suggestAlternativeSlots(orderId, near = slot)
        return bookingFailure(reason = "SLOT_FULL",
                               alternatives = alternatives)
```

This mirrors the app flow in the spec: customer selects a clickable (available)
slot, the backend confirms or rejects it, and the app shows immediate feedback
either way — never a silent hang while the reservation is decided.

## 4. Alternative-slot suggestion

```
function suggestAlternativeSlots(orderId, near = null, maxResults = 3):

    candidateDate = near.date if near is not null else today()

    candidates = findSlots(date = candidateDate)
                   .filter(s => s.bookedCount < s.capacity)

    if near is not null:
        sort candidates by absolute time distance from near.startTime

    if candidates is empty and near is not null:
        # nothing left today — widen the search to the next few days
        candidates = findSlots(dateRange = [candidateDate + 1, candidateDate + 3])
                       .filter(s => s.bookedCount < s.capacity)
                       .sortBy(date, startTime)

    return firstN(candidates, maxResults)     # empty list is a valid, non-error result
```

The app renders fully-booked slots as disabled and available ones as clickable;
this function is what supplies the ranked "try one of these instead" list when
the customer's first pick isn't clickable.

## 5. Preventing overbooking — the concurrency-safe reservation

**The race condition:** two customers open the app and both see the last open
spot in a slot (`bookedCount = capacity - 1`). Both requests are processed at
nearly the same instant:

```
Request A reads slot: bookedCount = 9, capacity = 10   -> 9 < 10, OK to book
Request B reads slot: bookedCount = 9, capacity = 10   -> 9 < 10, OK to book
Request A writes: bookedCount = 10
Request B writes: bookedCount = 10   (but B's booking is not reflected!)
```

If both requests do a **separate read, then a separate write**, the check and
the update are not atomic, and both bookings succeed — the slot is overbooked
by one. Any "read count, compare, then write" pattern has this flaw whenever
two requests interleave between the read and the write.

**The fix:** the availability check and the increment must happen as a single
atomic operation against the shared resource, not as two steps:

```
function tryReserveSlot(slotId):

    result = ATOMIC_CONDITIONAL_UPDATE(
        collection = Slots,
        filter      = { id = slotId, bookedCount < capacity },   # condition checked
        update      = { bookedCount = bookedCount + 1 },          # and applied
                                                                    # in one step
    )

    if result.matchedCount == 1:
        return { success = true }
    else:
        # either the slot doesn't exist, or bookedCount was already == capacity
        # at the instant this update ran — the caller falls back to
        # suggestAlternativeSlots()
        return { success = false }
```

Walking through the same race with this fix:

```
Request A: ATOMIC_CONDITIONAL_UPDATE(bookedCount < 10) -> matches, bookedCount becomes 10
Request B: ATOMIC_CONDITIONAL_UPDATE(bookedCount < 10) -> bookedCount is now 10,
                                                            filter no longer matches,
                                                            matchedCount = 0
```

Request A succeeds; Request B's atomic update simply matches zero documents and
`tryReserveSlot` reports failure, so `bookDeliverySlot` falls through to
`suggestAlternativeSlots` for B — no overbooking, no error, just an honest
"that one's gone, here's what else is open" response.

This maps directly onto real infrastructure:
- **MongoDB**: `findOneAndUpdate({ _id: slotId, bookedCount: { $lt: capacity } }, { $inc: { bookedCount: 1 } })` — the filter and the increment are one atomic document operation.
- **Relational DB**: `UPDATE slots SET booked_count = booked_count + 1 WHERE id = :slotId AND booked_count < capacity`, checking the affected-row count — the `WHERE` condition and the write happen inside the same statement/lock.
- **Redis-backed counters**: an atomic `INCR` followed by a compare, undone with a `DECR` if it overshot capacity — or a Lua script that checks-and-increments in one round trip.

The common thread: never read the count in one step and write it in a later,
separate step when the resource is shared.

## 6. Edge cases

```
- No slots available at all for the requested day:
    suggestAlternativeSlots() widens to the next few days; if still empty,
    it returns an empty list and the caller shows "no slots available soon"
    rather than treating it as an error.

- Invalid / nonexistent slotId:
    Handled as its own branch in bookDeliverySlot (SLOT_NOT_FOUND), distinct
    from SLOT_FULL, so the app can message "that slot no longer exists" rather
    than "that slot is full".

- Concurrent requests racing for the last remaining spot:
    Handled by the atomic conditional update in section 5 — the loser of the
    race gets a clean SLOT_FULL result and alternatives, not a crash or a
    silent overbook.

- Slot capacity is zero or negative:
    Rejected at slot-creation time, not booking time — a slot should never be
    creatable with capacity <= 0; defensively, tryReserveSlot's filter
    (bookedCount < capacity) also naturally never matches such a slot.

- Cancellations:
    A cancelled booking must decrement bookedCount (e.g. an atomic
    bookedCount = bookedCount - 1, floored at 0) so the freed spot becomes
    bookable again — mentioned here for completeness though not required by
    the spec's booking-request flow.
```

## 7. Requirement coverage

| Spec requirement                                   | Where it's addressed |
|------------------------------------------------------|-----------------------|
| Allocate slots dynamically based on availability      | Section 3 (`bookDeliverySlot`) |
| Prevent overbooking by tracking booked slots           | Section 5 (`tryReserveSlot`, atomic conditional update) |
| Suggest alternative slots if preferred is unavailable   | Section 4 (`suggestAlternativeSlots`), invoked from section 3 |
| Treat delivery slots as a shared resource               | Section 5 (race walkthrough + atomic fix), reinforced in section 6's concurrency edge case |
