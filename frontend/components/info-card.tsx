import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  className?: string;
}

export function InfoCard({ label, value, icon: Icon, className }: InfoCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
    >
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary/15">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span className="text-lg font-semibold leading-tight text-card-foreground">
            {value}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
