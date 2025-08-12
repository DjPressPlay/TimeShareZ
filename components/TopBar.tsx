import React from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";

export default function TopBar() {
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.5rem 1rem", background: "#101820"
    }}>
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>TimeShareZ</div>
      <Input placeholder="Search projects..." />
      <Button>Post Project</Button>
    </header>
  );
}
