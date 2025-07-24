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
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

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

  const fontFamily = '"Segoe UI", "Helvetica Neue", Arial, "Liberation Sans", sans-serif';

  return (
    <>
      {/* Icône flottante */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed", bottom: 32, right: 32, zIndex: 1000,
            background: "#fff", border: "none", borderRadius: 32,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)", height: 56, padding: "0 22px",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            gap: 10, minWidth: 90
          }}
        >
          {/* Icône SVG style Zara */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
            <rect x="3" y="5" width="18" height="14" rx="3"/>
            <polyline points="8 15 12 11 16 15"/>
          </svg>
          <span style={{ fontFamily, fontWeight: 600, fontSize: 17, color: "#222", letterSpacing: 1 }}>CHAT</span>
        </button>
      )}

      {/* Fenêtre de chat */}
      {open && (
        <div style={{
          position: "fixed", bottom: 32, right: 32, zIndex: 2000,
          width: 370, maxWidth: "95vw", height: 540, background: "#fff",
          borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column",
          fontFamily, border: "1px solid #222"
        }}>
          <div style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111", color: "#fff", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <span style={{ fontWeight: 600, letterSpacing: 1, fontSize: 18 }}>Virtual Assistant</span>
            <button onClick={() => setShowCloseConfirm(true)} style={{ background: "none", border: "none", fontSize: 24, color: "#fff", cursor: "pointer" }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 20, background: "#fff", display: "flex", flexDirection: "column", gap: 18 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex", flexDirection: msg.from === "user" ? "row-reverse" : "row", alignItems: "flex-end"
              }}>
                <div style={{
                  background: msg.from === "user" ? "#222" : "#f5f5f5",
                  color: msg.from === "user" ? "#fff" : "#222",
                  borderRadius: 8, border: msg.from === "user" ? "1px solid #222" : "1px solid #ddd",
                  padding: "10px 16px", maxWidth: 260, fontSize: 15, boxShadow: msg.from === "user" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  fontFamily, textAlign: "left"
                }}>
                  {msg.text}
                  <div style={{ fontSize: 11, color: msg.from === "user" ? "#bbb" : "#888", marginTop: 6, textAlign: "right" }}>
                    {msg.time || (new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div style={{ background: "#f5f5f5", color: "#222", borderRadius: 8, border: "1px solid #ddd", padding: "10px 16px", maxWidth: 260, fontSize: 15, fontFamily }}>
                  ...
                </div>
              </div>
            )}
            {error && (
              <div style={{ color: "#d32f2f", margin: "8px 0", fontFamily }}>Erreur : {error}</div>
            )}
          </div>
          <div style={{ padding: 16, borderTop: "1px solid #eee", background: "#fff", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Votre message..."
              style={{ flex: 1, border: "1px solid #222", borderRadius: 8, padding: 10, fontSize: 15, fontFamily, background: "#fff", color: "#222" }}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading} style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 600, fontFamily, letterSpacing: 1, opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : "Envoyer"}
            </button>
          </div>
          {/* Modal de confirmation fermeture */}
          {showCloseConfirm && (
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255,255,255,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000
            }}>
              <div style={{ background: "#fff", border: "1px solid #222", borderRadius: 8, padding: 32, minWidth: 260, boxShadow: "0 2px 16px rgba(0,0,0,0.18)", fontFamily }}>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12, letterSpacing: 1, color: "#222" }}>WOULD YOU LIKE TO CLOSE THE CHAT?</div>
                <div style={{ color: "#222", fontSize: 15, marginBottom: 28 }}>If you close the chat, you will lose this conversation.</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setShowCloseConfirm(false)} style={{ flex: 1, border: "1px solid #222", background: "#fff", color: "#222", borderRadius: 4, padding: "10px 0", fontWeight: 600, fontFamily, fontSize: 15, letterSpacing: 1, cursor: "pointer" }}>CANCEL</button>
                  <button onClick={() => { setShowCloseConfirm(false); setOpen(false); setMessages([{ from: "bot", text: "Bonjour ! Comment puis-je vous aider ?" }]); }} style={{ flex: 1, border: "none", background: "#111", color: "#fff", borderRadius: 4, padding: "10px 0", fontWeight: 600, fontFamily, fontSize: 15, letterSpacing: 1, cursor: "pointer" }}>CLOSE</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
