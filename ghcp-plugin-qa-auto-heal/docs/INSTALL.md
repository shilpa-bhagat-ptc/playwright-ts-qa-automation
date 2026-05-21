# Install — register the GitHub App and host the extension

This walks through registering `@qa-auto-heal` once for your org, hosting the small Node service, and pointing the GitHub App's webhook at it.

You'll do this once. After that, engineers install the App on their repos and use `@qa-auto-heal` in Copilot Chat without any per-engineer setup.

---

## 1. Host the extension

Pick any host that gives you a public HTTPS URL. The container is tiny (Node 20, ~80MB, ~50MB RAM).

### Option A — Fly.io (fastest)

```powershell
cd ghcp-plugin-qa-auto-heal
fly launch --no-deploy           # answers: app name=qa-auto-heal, region=any
fly deploy
```

Note the URL Fly assigns (e.g., `https://qa-auto-heal.fly.dev`).

### Option B — Cloud Run

```powershell
gcloud run deploy qa-auto-heal `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --port 3000
```

### Option C — Render / Railway / Heroku

Point the platform at this folder. They auto-detect `package.json`; ensure `npm start` is the run command.

### Option D — Local dev with a tunnel

```powershell
npm install
npm run dev                     # listens on :3000
cloudflared tunnel --url http://localhost:3000
```

Copy the `https://<random>.trycloudflare.com` URL — use it as the webhook below.

**Whichever you pick, save the public URL as `HOST_URL` for the next step.**

---

## 2. Register a GitHub App

1. Go to `https://github.com/settings/apps/new` (or `https://github.com/organizations/<your-org>/settings/apps/new` for an org-owned App).
2. Fill in:
   - **GitHub App name:** `qa-auto-heal` (must be globally unique — prefix with your org if needed).
   - **Homepage URL:** the link to this folder on github.com.
   - **Callback URL:** `<HOST_URL>/auth/callback` (the reference handler doesn't use it, but GitHub requires a value).
   - **Webhook → Active:** uncheck (the extension does not use webhook events).
   - **Permissions:** none required for the chat-only reference handler. If you add skills that call GitHub APIs, grant `Contents: Read`, `Pull Requests: Write`, etc., per skill needs.
3. Save the app. You'll land on the App's settings page.

### Enable Copilot integration

1. On the App settings page, scroll to **Copilot** in the left nav.
2. Set **App Type** = **Agent**.
3. Set **URL** = `<HOST_URL>/` (must match what the server actually serves).
4. Optionally add **Pre-Authorization URL** if you add OAuth scopes later.
5. Save.

### Note the credentials

Capture these from the App settings page — you'll need them for `.env`:
- App ID
- Client ID
- Private key (download the `.pem` file; store inline or as a file path)

Set them on your host:

```powershell
fly secrets set `
  GITHUB_APP_ID=12345 `
  GITHUB_APP_CLIENT_ID=Iv23... `
  GITHUB_APP_PRIVATE_KEY="$(Get-Content -Raw qa-auto-heal.private-key.pem)"
```

The reference handler does NOT actually need these (it relies on the caller's `X-GitHub-Token`), but engineers who extend the handler with skills usually do.

---

## 3. Install the App on a repo or org

1. From the App's settings page → **Install App** → pick your org/account.
2. Grant access to the repos engineers will use Copilot Chat in (or "All repositories").
3. Confirm install.

---

## 4. Use it

In VS Code or github.com, open Copilot Chat and type:

```
@qa-auto-heal what's the classification rule for "row not visible after Add"?
```

If the chip shows up and the agent answers, you're done.

See [USAGE.md](USAGE.md) for prompt patterns.

---

## Troubleshooting

- **"Extension is not responding"**: `curl <HOST_URL>/` should return the running banner. If not, the host is down or the URL is wrong on the GitHub App page.
- **"Invalid signature"**: the SDK fetches GitHub's signing public keys on each request. If your host blocks outbound HTTPS, allowlist `api.github.com`.
- **Empty / 401 responses**: the request didn't include `X-GitHub-Token` — almost always means GitHub doesn't think your App is a Copilot agent. Re-check the App's Copilot settings (App Type = Agent, URL filled).
- **"Stream failed"**: usually the user's Copilot subscription token doesn't have access to the model the handler requested. The reference handler uses `gpt-4o`; downgrade to `gpt-4o-mini` in [src/server.js](../src/server.js) if needed.
