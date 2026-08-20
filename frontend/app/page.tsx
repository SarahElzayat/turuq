import { User, Cake, Mail, Phone, GraduationCap } from "lucide-react";
import { InfoCard } from "@/components/info-card";

const profile = [
  { label: "Name", value: "Sarah Elzayat", icon: User },
  { label: "Age", value: "26", icon: Cake },
  { label: "Email Address", value: "sarahelzayat@outlook.com", icon: Mail },
  { label: "Phone Number", value: "+20 115 619 9904", icon: Phone },
  {
    label: "University & Graduation Year",
    value: "Cairo University, Faculty of Engineering, Class of 2024",
    icon: GraduationCap,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Frontend technical assessment, Warehouse Moderator App.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profile.map((item) => (
          <InfoCard key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
