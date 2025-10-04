import React from "react";
import toast from "react-hot-toast";

export default function ConnectButton({ otherUserId }) {
  const handleConnect = () => {
    toast.success(`clicked on connect with ${otherUserId} success!`);
  };

  return (
    <section>
      <button
        className="px-4 py-2 bg-accent text-white rounded-full hover:scale-105 transition"
        onClick={() => handleConnect()}
      >
        Connect
      </button>
    </section>
  );
}
