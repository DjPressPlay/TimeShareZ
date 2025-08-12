import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };

export default function Button({ children, ...props }: Props) {
  return (
    <button {...props} style={{
      background: "linear-gradient(90deg,#00f0ff,#00ff88)",
      border: "none", padding: "0.5rem 1rem", borderRadius: "6px",
      color: "#000", fontWeight: "bold", cursor: "pointer"
    }}>
      {children}
    </button>
  );
}
