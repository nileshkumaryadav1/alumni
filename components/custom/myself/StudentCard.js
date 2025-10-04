import ConnectButton from "@/components/network/ConnectButton";
import { User } from "lucide-react";

export default function StudentCard({ student }) {
  return (
    <div>
      <div className="bg-card p-5 rounded-2xl shadow-md border border-border hover:shadow-xl transition">
        <User className="w-10 h-10 text-accent mb-2 mx-auto" />
        <h3 className="font-semibold text-lg">{student.name}</h3>
        <p className="text-sm text-muted-foreground mb-1">
          Batch {student.batch}
        </p>
        <p className="text-sm text-accent font-medium">{student.jobTitle}</p>
        <p className="text-xs text-secondary mb-2">{student.company}</p>
        <ConnectButton />
      </div>
    </div>
  );
}
