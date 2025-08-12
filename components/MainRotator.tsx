import React from "react";
import Button from "./ui/Button";

export default function MainRotator() {
  return (
    <section style={{ flex: 1, position: "relative", background: "#000" }}>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", fontSize: "1.5rem"
      }}>
        Main Rotator Placeholder
      </div>
      <div style={{
        position: "absolute", bottom: "1rem", left: "1rem",
        display: "flex", gap: "0.5rem"
      }}>
        <Button>Support</Button>
        <Button>Play Video</Button>
      </div>
    </section>
  );
}
