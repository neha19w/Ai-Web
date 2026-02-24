// frontend/src/api.ts

export type Role = "user" | "assistant" | "system";

export interface Message {
  role: Role;
  content: string;
}

export interface ChatStreamParams {
  messages: Message[];
  onToken?: (token: string) => void;
  onDone?: () => void;
  onError?: (error: string) => void;
}

const BASE_URL = "http://localhost:8080/api";

/**
 * Streams tokens from backend SSE endpoint: POST /api/chat
 * Backend should respond with lines like:
 * data: {"token":"..."}\n\n
 * data: {"done":true}\n\n
 */
export function chatStream({ messages, onToken, onDone, onError }: ChatStreamParams) {
  fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  })
    .then((res) => {
      if (!res.ok) throw new Error("Chat request failed");

      const body = res.body;
      if (!body) throw new Error("No response body");

      const reader = body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      const read = (): void => {
        reader
          .read()
          .then(({ value, done }) => {
            if (done) {
              onDone?.();
              return;
            }

            buffer += decoder.decode(value, { stream: true });

            // SSE events are separated by blank line (\n\n)
            const events = buffer.split("\n\n");
            buffer = events.pop() || "";

            for (const evt of events) {
              const line = evt
                .split("\n")
                .map((l) => l.trim())
                .find((l) => l.startsWith("data:"));

              if (!line) continue;

              const payload = line.slice("data:".length).trim();

              try {
                const json = JSON.parse(payload) as
                  | { token?: string; done?: boolean; error?: string }
                  | Record<string, unknown>;

                if (typeof json === "object" && json) {
                  if ("token" in json && typeof (json as any).token === "string") {
                    onToken?.((json as any).token);
                  }
                  if ("error" in json && typeof (json as any).error === "string") {
                    onError?.((json as any).error);
                  }
                  if ("done" in json && (json as any).done === true) {
                    onDone?.();
                  }
                }
              } catch {
                // Ignore malformed partial chunks
              }
            }

            read();
          })
          .catch((e) => onError?.(String(e)));
      };

      read();
    })
    .catch((e) => onError?.(String(e)));
}