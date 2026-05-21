# QA Auto-Heal — GitHub Copilot Extension

A GitHub Copilot Extension that packages the **QA Link Jenkins Trigger + Result Analyzer + Auto-Healing Agent** so any engineer with access to a Playwright + TypeScript QA pipeline can invoke it from GitHub Copilot Chat as `@qa-auto-heal`.

The extension exposes the agent's full operating manual — workflow, classification rules, allowed auto-fixes, safety rails, output contract — as the system prompt for a Copilot-powered chat agent. Engineers ask things like:

```
@qa-auto-heal analyze build #95
@qa-auto-heal what's the auto-heal rule for "row not visible after Add"?
@qa-auto-heal classify this failure: <paste console snippet>
@qa-auto-heal trigger adminPageTests
```

…and Copilot answers using the embedded agent spec. The same prompt that drives the standalone agent in [../qa-link-jenkins-result-analyzer-auto-healing.agent.md](../qa-link-jenkins-result-analyzer-auto-healing.agent.md) drives this extension — share one URL, every engineer gets the same playbook.

---

## What this is (and isn't)

**Is:** an agent-type Copilot Extension. A small Node service that receives chat turns from GitHub, prepends the agent spec as a system message, proxies the conversation to the Copilot LLM (using the caller's GitHub token), and streams the answer back as SSE.

**Isn't (yet):** a fully autonomous executor. The reference implementation does not call Jenkins, push branches, or send emails on its own — it advises. Engineers run the side-effects (or wire in skills; see [docs/EXTENDING.md](docs/EXTENDING.md)). This keeps the shareable plugin scope-limited and safe to install across teams without each team granting it Jenkins/SMTP credentials.

If you want the full closed-loop autonomy (build trigger → push PR → email), the agent spec in `agent-spec/` is identical to what the standalone Claude Code agent runs — install that locally with the credentials in `.env` and let it execute.

---

## Quick start (for users)

Once the extension is hosted and registered as a GitHub App, an engineer installs it on their org/repo and types `@qa-auto-heal` in Copilot Chat (VS Code or github.com). No local setup required.

For first-time setup of the extension itself (hosting + GitHub App registration), see **[docs/INSTALL.md](docs/INSTALL.md)**.

For prompt patterns and sample sessions, see **[docs/USAGE.md](docs/USAGE.md)**.

For how to add skills (trigger Jenkins, open PRs, etc.), see **[docs/EXTENDING.md](docs/EXTENDING.md)**.

---

## Local development

```powershell
cd ghcp-plugin-qa-auto-heal
npm install
copy .env.example .env       # fill in values
npm run dev                  # starts on http://localhost:3000
```

Then expose `localhost:3000` via a tunnel (`gh codespace ports forward`, `cloudflared`, `ngrok`, etc.) and point your dev GitHub App's "Callback URL" at the public tunnel URL. See `docs/INSTALL.md`.

To smoke-test the agent prompt without standing up the GitHub App, run:

```powershell
npm run repl
```

This loads the system prompt and sends a single user message to the Copilot LLM using a PAT from `.env` (`GITHUB_PAT` with `copilot` scope), printing the response. Useful for iterating on the agent spec.

---

## Repository layout

```
ghcp-plugin-qa-auto-heal/
├── README.md                                # this file
├── package.json
├── .env.example
├── .gitignore
├── Dockerfile                               # for hosted deployment
├── fly.toml                                 # sample Fly.io config (any host works)
├── github-app-manifest.json                 # one-click GitHub App registration
├── src/
│   ├── server.js                            # HTTP entrypoint (Express + Copilot SDK)
│   ├── agent-prompt.js                      # loads the agent spec as system prompt
│   ├── verify.js                            # signature verification helper
│   └── repl.js                              # CLI smoke-test
├── agent-spec/
│   └── qa-link-jenkins-auto-heal.md         # the agent operating manual (copy)
└── docs/
    ├── INSTALL.md                           # GitHub App registration + hosting
    ├── USAGE.md                             # prompt patterns for engineers
    └── EXTENDING.md                         # adding Jenkins/GitHub skills
```

---

## How the system prompt is composed

[src/agent-prompt.js](src/agent-prompt.js) reads `agent-spec/qa-link-jenkins-auto-heal.md` at startup, strips the YAML frontmatter, and emits the agent's narrative body + a short preamble that pins its persona ("you are the QA Link Jenkins Trigger + Result Analyzer + Auto-Healing Agent") and reminds it that in this surface it advises rather than executes. The file is the single source of truth — edit it, redeploy, every Copilot Chat user gets the new playbook.

To share updated knowledge with teammates without redeploying, you can also instruct engineers to paste the latest `agent-spec/qa-link-jenkins-auto-heal.md` contents into Copilot Chat themselves, but the extension path is more discoverable.

---

## Sharing with other engineers

Three options, in increasing setup cost:

1. **Copy the folder.** Engineers `git clone` this repo's `ghcp-plugin-qa-auto-heal/` directory and run it locally. Lowest barrier — they get the agent spec, the SDK wiring, and the deploy template all at once. Good for a single team.
2. **Host one shared deployment.** Stand up the extension once (Fly.io / Render / Cloud Run, see [docs/INSTALL.md](docs/INSTALL.md)), register one GitHub App on your org, and ask teammates to install it on their repos. Best for an org.
3. **Publish as a marketplace listing.** Once the extension is stable and you've registered it as a GitHub App with "Public" visibility, anyone with Copilot can install it via the GitHub Marketplace. Best for cross-org sharing. See GitHub's [Publishing a Copilot Extension](https://docs.github.com/en/copilot/building-copilot-extensions) docs for the listing flow.

---

## Limitations & honest disclaimers

- The reference handler **uses Copilot's LLM through the caller's GitHub token** (the `X-GitHub-Token` header GitHub injects on every Copilot-Extension request). Your hosting cost is HTTP + memory only; LLM cost is borne by the caller's Copilot subscription.
- Signature verification ([src/verify.js](src/verify.js)) uses `@copilot-extensions/preview-sdk`. The SDK is still labelled "preview" by GitHub — review their changelog before shipping to production.
- The extension does **not** persist conversation history server-side. Copilot replays the full message thread on every turn; your handler is stateless.
- This template targets the Copilot Extensions GA surface (Agents). If you want a *Skill-set extension* instead (structured tools Copilot picks from), the SDK supports that too — see EXTENDING.md.

---

## Provenance

- Agent spec source-of-truth: [../qa-link-jenkins-result-analyzer-auto-healing.agent.md](../qa-link-jenkins-result-analyzer-auto-healing.agent.md) in the parent repo.
- Mirrored into this plugin at [agent-spec/qa-link-jenkins-auto-heal.md](agent-spec/qa-link-jenkins-auto-heal.md). Re-mirror after every meaningful spec change (`npm run sync-spec` updates it from `../`).
