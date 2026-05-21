import express from "express";
import {
  verifyAndParseRequest,
  prompt,
  createAckEvent,
  createTextEvent,
  createDoneEvent,
  createErrorsEvent,
} from "@copilot-extensions/preview-sdk";
import { SYSTEM_PROMPT } from "./agent-prompt.js";

const app = express();
app.use(express.text({ type: "*/*", limit: "5mb" }));

app.get("/", (_req, res) => {
  res.type("text/plain").send(
    "qa-auto-heal Copilot Extension is running. POST chat turns here.\n" +
      "See https://github.com/<your-org>/playwright-ts-qa-automation/tree/main/ghcp-plugin-qa-auto-heal"
  );
});

app.post("/", async (req, res) => {
  const githubToken = req.get("X-GitHub-Token");
  const signature = req.get("Github-Public-Key-Signature");
  const keyId = req.get("Github-Public-Key-Identifier");

  if (!githubToken) {
    return res.status(401).type("text/plain").send("missing X-GitHub-Token");
  }

  let payload;
  try {
    const verified = await verifyAndParseRequest(req.body, signature, keyId, {
      token: githubToken,
    });
    if (!verified.isValidRequest) {
      return res.status(401).type("text/plain").send("invalid signature");
    }
    payload = verified.payload;
  } catch (err) {
    console.error("verify failed:", err);
    return res.status(401).type("text/plain").send("verification error");
  }

  res.set("content-type", "text/event-stream");
  res.set("cache-control", "no-cache");
  res.write(createAckEvent());

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(payload.messages ?? []),
  ];

  try {
    const { stream } = await prompt.stream({
      messages,
      token: githubToken,
      model: "gpt-4o",
    });

    for await (const chunk of stream) {
      const text = chunk?.choices?.[0]?.delta?.content;
      if (text) res.write(createTextEvent(text));
    }

    res.write(createDoneEvent());
    res.end();
  } catch (err) {
    console.error("prompt stream failed:", err);
    res.write(
      createErrorsEvent([
        {
          type: "agent",
          code: "stream_failed",
          message: err?.message ?? "unknown error",
          identifier: "qa-auto-heal",
        },
      ])
    );
    res.write(createDoneEvent());
    res.end();
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`qa-auto-heal extension listening on :${port}`);
});
