// frontend/src/App.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { chatStream, Message } from "./api";

const INITIAL_BOT_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! Ask me anything."
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Auto-scroll to bottom
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;

    // Build the new message list with a placeholder assistant message (for streaming)
    const updated: Message[] = [
      ...messages,
      { role: "user", content: text },
      { role: "assistant", content: "" }
    ];

    setMessages(updated);
    setInput("");
    setLoading(true);

    // For backend: send conversation WITHOUT the empty placeholder
    const payload: Message[] = updated.filter((m) => !(m.role === "assistant" && m.content === ""));

    chatStream({
      messages: payload,

      onToken: (token: string) => {
        setMessages((prev) => {
          // Stream into the last message (assistant placeholder)
          const copy = [...prev];
          const lastIndex = copy.length - 1;
          const last = copy[lastIndex];

          if (!last || last.role !== "assistant") {
            // fallback: if for some reason last isn't assistant, append
            return [...copy, { role: "assistant", content: token }];
          }

          copy[lastIndex] = { ...last, content: (last.content || "") + token };
          return copy;
        });
      },

      onDone: () => setLoading(false),

      onError: (e: string) => {
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `[Error] ${e}` }
        ]);
      }
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") send();
  };

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", fontFamily: "system-ui" }}>
      <h2>Simple AI Chatbot (React + Node + LLM)</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 12,
          minHeight: 420,
          maxHeight: 520,
          overflowY: "auto"
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{m.role === "user" ? "You" : "Bot"}:</b>{" "}
            <span style={{ whiteSpace: "pre-wrap" }}>
              {m.content || (loading && i === messages.length - 1 ? "..." : "")}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10 }}
          onKeyDown={onKeyDown}
        />
        <button onClick={send} disabled={!canSend} style={{ padding: "10px 16px" }}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}