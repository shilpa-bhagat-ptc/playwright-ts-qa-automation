import { prompt } from "@copilot-extensions/preview-sdk";
import { createInterface } from "node:readline/promises";
import { SYSTEM_PROMPT } from "./agent-prompt.js";

const token = process.env.GITHUB_PAT;
if (!token) {
  console.error(
    "GITHUB_PAT is not set. Export a PAT with Copilot access, e.g.:\n" +
      "  $env:GITHUB_PAT = (gh auth token)"
  );
  process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const history = [{ role: "system", content: SYSTEM_PROMPT }];

console.log("qa-auto-heal REPL — Ctrl+C to exit");

while (true) {
  const userText = (await rl.question("you> ")).trim();
  if (!userText) continue;
  history.push({ role: "user", content: userText });

  const { stream } = await prompt.stream({
    messages: history,
    token,
    model: "gpt-4o",
  });

  process.stdout.write("agent> ");
  let assistantText = "";
  for await (const chunk of stream) {
    const text = chunk?.choices?.[0]?.delta?.content;
    if (text) {
      process.stdout.write(text);
      assistantText += text;
    }
  }
  process.stdout.write("\n\n");
  history.push({ role: "assistant", content: assistantText });
}
