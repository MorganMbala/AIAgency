import React, { useState } from "react";

const API_URL = "http://localhost:8500/api/chat";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Bonjour ! Comment puis-je vous aider ?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setMessages([...messages, { from: "user", text: input }]);
    setLoading(true);
    setError(null);
    const userMessage = input;
    setInput("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage })
      });
      if (!res.ok) throw new Error("Erreur réseau");
      const data = await res.json();
      setMessages(msgs => [...msgs, { from: "bot", text: data.response || "(Pas de réponse)" }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { from: "bot", text: "Erreur lors de la connexion au chatbot." }]);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Icône flottante */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed", bottom: 32, right: 32, zIndex: 1000,
            background: "#fff", border: "none", borderRadius: "50%",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)", width: 64, height: 64,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1380/1380338.png" alt="Chat" style={{ width: 32, height: 32 }} />
        </button>
      )}

      {/* Fenêtre de chat */}
      {open && (
        <div style={{
          position: "fixed", bottom: 32, right: 32, zIndex: 2000,
          width: 350, maxWidth: "90vw", height: 500, background: "#fff",
          borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column"
        }}>
          <div style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "bold" }}>Chatbot</span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 12, background: "#f7f7f7" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex", flexDirection: msg.from === "user" ? "row-reverse" : "row", alignItems: "flex-end", marginBottom: 8
              }}>
                <img
                  src={msg.from === "user"
                    ? "https://www.skema.edu/sites/default/files/styles/wide/public/testimonies/images/ataky_steve.jpg?itok=AetYtGMU"
                    : "https://i.ibb.co/cN0nmSj/Screenshot-2023-05-28-at-02-37-21.png"}
                  alt={msg.from}
                  style={{ width: 36, height: 36, borderRadius: "50%", margin: "0 8px" }}
                />
                <div style={{
                  background: msg.from === "user" ? "#2b313e" : "#475063",
                  color: "#fff", borderRadius: 12, padding: "8px 14px", maxWidth: 220
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <img src="https://i.ibb.co/cN0nmSj/Screenshot-2023-05-28-at-02-37-21.png" alt="bot" style={{ width: 36, height: 36, borderRadius: "50%", margin: "0 8px" }} />
                <div style={{ background: "#475063", color: "#fff", borderRadius: 12, padding: "8px 14px", maxWidth: 220 }}>
                  ...
                </div>
              </div>
            )}
            {error && (
              <div style={{ color: "#d32f2f", margin: "8px 0" }}>Erreur : {error}</div>
            )}
          </div>
          <div style={{ padding: 12, borderTop: "1px solid #eee", display: "flex" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Votre message..."
              style={{ flex: 1, border: "1px solid #ccc", borderRadius: 8, padding: 8, marginRight: 8 }}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading} style={{ background: "#2b313e", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : "Envoyer"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
