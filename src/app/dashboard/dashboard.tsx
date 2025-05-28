"use client";
import { useState } from "react";

export default function Dashboard({ inHouse }: { inHouse: boolean }) {
  const [open, setOpen] = useState(!inHouse);

  // Dummy handlers for demonstration
  const handleCreateHouse = () => {
    alert("House created! (implement logic)");
    setOpen(false);
  };

  const handleJoinHouse = () => {
    alert("Joined house! (implement logic)");
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#111",
            color: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            minWidth: "340px",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}>
            <h2 style={{ marginBottom: "1rem" }}>Welcome!</h2>
            <p style={{ marginBottom: "2rem" }}>
              You need to join or create a house to continue.
            </p>
            <button
              style={{
                margin: "0.5rem",
                padding: "0.5rem 1.5rem",
                borderRadius: "6px",
                border: "none",
                background: "#fff",
                color: "#111",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background 0.2s, color 0.2s"
              }}
              onClick={handleCreateHouse}
            >
              Create House
            </button>
            <button
              style={{
                margin: "0.5rem",
                padding: "0.5rem 1.5rem",
                borderRadius: "6px",
                border: "1px solid #fff",
                background: "#111",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background 0.2s, color 0.2s"
              }}
              onClick={handleJoinHouse}
            >
              Join House
            </button>
          </div>
        </div>
      )}
      <div>
        <h1 style={{ color: "#fff" }}>Dashboard</h1>
        {/* Your dashboard content goes here */}
      </div>
    </>
  );
}