import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import React from "react";
import ConnectButton from "./ConnectButton";

export default function StudentCardWithConnectBtn({ student }) {
  return (
    <div>
      {student.length === 0 ? (
        <p className="text-secondary text-center">No students found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.map((u) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-card rounded-2xl shadow-md flex items-center justify-between gap-4"
            >
              <UserCircle className="w-16 h-16 text-accent" />
              <div className="flex-1">
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-secondary">
                  {u.batch || u.year || "Unknown"}
                </p>
              </div>
              <ConnectButton />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
