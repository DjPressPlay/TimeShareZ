import React from "react";

export default function FundedFeed() {
  return (
    <section style={{
      background: "#101820", padding: "1rem", overflowX: "auto", whiteSpace: "nowrap"
    }}>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} style={{
          display: "inline-block", background: "#1f2a36", padding: "0.5rem",
          marginRight: "1rem", borderRadius: "6px"
        }}>
          Project {n} — Funded
        </div>
      ))}
    </section>
  );
}
