# Extending — adding side-effects (Jenkins, PRs, email)

The reference handler is advice-only. If you want `@qa-auto-heal` to actually trigger builds, open PRs, or send emails, you have two paths.

---

## Path 1 — Agent with embedded actions (simplest)

Keep the Agent shape but call your APIs *inside* the chat handler when the user's message looks actionable.

In [../src/server.js](../src/server.js), before forwarding to the LLM, parse the latest user message for a simple verb pattern:

```js
const latest = payload.messages.at(-1)?.content ?? "";
const triggerMatch = latest.match(/^\s*\/trigger\s+(\w+)/i);
if (triggerMatch) {
  const project = triggerMatch[1];
  const result = await triggerJenkins(project);   // your function
  res.write(createTextEvent(`Triggered build: ${result.url}\n\n`));
  // optionally still call the LLM to draft a follow-up plan…
  res.write(createDoneEvent());
  return res.end();
}
```

Pros: zero new GitHub config; works on day one.
Cons: brittle parsing; the user has to learn your `/trigger` micro-syntax.

Credentials live in env vars on your host (`JENKINS_USER`, `JENKINS_TOKEN`, `GITHUB_TOKEN`, `SMTP_*` — names already listed in `.env.example`). **Do not** ask Copilot Chat to pass them through — they belong on the server.

### Things to wire

The agent spec lists every external operation. Map them to functions:

| Spec step | Function to add | Inputs |
|---|---|---|
| Workflow §1 TRIGGER | `triggerJenkins(testProject)` | uses `JENKINS_USER` / `JENKINS_TOKEN` |
| Workflow §2 WAIT | `pollUntilTerminal(buildUrl)` | same creds |
| Workflow §4 FETCH | `fetchConsoleText(buildUrl)` | same creds |
| Workflow §8 PUSH | `openAutoHealPR(repo, branch, diff)` | `GITHUB_TOKEN` |
| Workflow §11 EMAIL | `sendReport(subject, bodyMd)` | `SMTP_*` |
| Workflow §12 HECTOR | *read-only* — verify only, never POST | `HECTOR_API_KEY` |

The standalone Claude Code agent in `../qa-link-jenkins-result-analyzer-auto-healing.agent.md` already runs these steps end-to-end; lift its shell snippets into JavaScript functions if you want feature parity.

---

## Path 2 — Skill-set extension (structured tools)

Convert the App from `Agent` to `Skill-Set`. Each operation becomes a named skill with a JSON schema; Copilot's LLM picks which skill to call based on the user prompt, without your micro-syntax.

This is more setup but gives Copilot full leverage of natural-language invocation. The SDK has helpers for it (`createSkill`, etc.); follow GitHub's "Building Copilot Extensions → Skill-Sets" docs.

The minimal skill list you'd register, mirroring the agent spec:

```json
[
  { "name": "trigger_build", "description": "Trigger playwright-ts-qa-automation with a TEST_PROJECT", ... },
  { "name": "get_build_status", "description": "Read Jenkins build state by number", ... },
  { "name": "classify_failures", "description": "Run the agent's classification rules on a console log", ... },
  { "name": "draft_auto_heal_pr", "description": "Generate a branch + commit + PR for an AUTOMATION_ISSUE fix", ... },
  { "name": "send_report_email", "description": "Send the 9-section email to the on-call list", ... }
]
```

Keep the auto-heal allowed-patterns (locator update, wait-strategy upgrade, missing POM method, broken import) explicit in the `draft_auto_heal_pr` schema so Copilot can't ask it to do something the agent spec forbids.

---

## Safety rails to preserve

Whichever path you pick, copy these from the agent spec verbatim into your action layer:

1. **Only POST to `playwright-ts-qa-automation/buildWithParameters`.** Never to any other Jenkins job, especially never `Post-Hector-Results_QALink`.
2. **Push with an explicit refspec.** `git push origin "HEAD:refs/heads/<branch>"` — never `-u`, especially from a worktree. The agent spec has the full incident write-up.
3. **`tsc --noEmit` before commit.** Always. The repo has a known pre-existing TS2551 in `src/pages/queryPage.ts:95` — only block on new errors.
4. **Confidence < 0.7 → no auto-fix.** Report only. The classifier returns a score; gate the action on it.
5. **>3 files touched → downgrade to report-only.** Single-locator fixes are the sweet spot.
6. **Never modify `.auth/storageState.json`, `playwright.config.ts`, or shared `commonProperties` values.**
7. **No destructive git.** No force-push, no `reset --hard`, no `branch -D`.

These are not negotiable — they're the reason engineers trust the agent to run unattended.

---

## Testing actions without a live Jenkins

The most painful loop is integration with a real Jenkins instance. Stub it:

```js
// src/jenkins.js
const STUB = process.env.JENKINS_STUB === "1";
export async function triggerJenkins(project) {
  if (STUB) return { number: 999, url: "https://example/job/999/" };
  // real impl
}
```

Then `JENKINS_STUB=1 npm run dev` and ask Copilot Chat to "trigger adminPageTests" — you'll see the agent call the stub and continue downstream, without burning a real CI minute.
