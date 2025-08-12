import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return (
    <input {...props} style={{
      padding: "0.4rem 0.6rem", borderRadius: "4px",
      border: "1px solid #333", background: "#0b0f14", color: "#fff"
    }} />
  );
}
