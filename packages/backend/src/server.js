import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// @ts-ignore
import chatRouter from "./routes/chat.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/api", chatRouter);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));