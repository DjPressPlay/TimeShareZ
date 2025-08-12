import React from "react";

export default function HotFeed() {
  return (
    <section style={{ background: "#141c24", padding: "0.5rem" }}>
      <h4 style={{ margin: "0 0 0.5rem 0" }}>🔥 Top 5 Today</h4>
      <div style={{ display: "flex", gap: "1rem" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} style={{ background: "#1f2a36", padding: "0.5rem", borderRadius: "6px" }}>
            <div>Project {n}</div>
            <small>$R 0 | 0 backers</small>
          </div>
        ))}
      </div>
    </section>
  );
}
