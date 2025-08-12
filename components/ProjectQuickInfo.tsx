import React from "react";
import Button from "./ui/Button";

export default function ProjectQuickInfo() {
  return (
    <section style={{
      background: "#141c24", padding: "1rem",
      display: "flex", justifyContent: "space-between", alignItems: "center"
    }}>
      <div>Reward: Example Reward Text</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div>Backers: 0</div>
        <div>$R: 0</div>
        <div>Last buy: -</div>
        <Button>Share</Button>
      </div>
    </section>
  );
}
