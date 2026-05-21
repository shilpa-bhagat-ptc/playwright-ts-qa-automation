# Usage — prompt patterns for `@qa-auto-heal`

After the extension is installed on your repo (see [INSTALL.md](INSTALL.md)), open Copilot Chat in VS Code or github.com and start a message with `@qa-auto-heal`.

The agent is loaded with the full operating manual at [../agent-spec/qa-link-jenkins-auto-heal.md](../agent-spec/qa-link-jenkins-auto-heal.md) — it knows the workflow, classification rules, allowed auto-fixes, and the 9-section output contract.

---

## Patterns that work

### Classify a single failure

```
@qa-auto-heal classify this:

  ✘  1 tests\specs\adminPage\adminTests.spec.ts:1294:24 › TC_ADM_026
  TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  Locator: //table[@class~='list_table']//tr[.//*[contains(.,"QA_AppType_1716197238")]]
```

Expected: short answer with bucket, confidence, evidence, and the suggested fix. Often pulls in the "report only" path when ambiguous (see TC_ADM_026 in the spec's worked examples).

### Walk through the full 9-section output

```
@qa-auto-heal here's the per-suite results block and 3 failure stacks from build #94:
<paste>

Produce the full 9-section report.
```

Expected: sections 1–9 emitted in order, with auto-fix diff in section 4 when confidence ≥ 0.7.

### Conceptual questions

```
@qa-auto-heal what's the difference between "page body should contain didn't choose" and "page body should mention <word>"?
```

Expected: a 3-4 sentence answer citing `classification_rules.PRODUCT_BUG` vs `classification_rules.AUTOMATION_ISSUE`.

### Draft an email body

```
@qa-auto-heal draft the section 11 email for build #95: 3 RESOLVED (TC_ADM_009/010/011 from a locator typo), 2 STILL_FAILING (TC_ADM_026, TC_ADM_030), 0 NEW_REGRESSION.
```

Expected: subject + markdown body matching the email-body shape in the spec.

### Suggest a locator heal

```
@qa-auto-heal The locator //a[normalize-space()='Configurationssss'] times out. DOM text is "Configurations". What's the minimal fix?
```

Expected: a one-line diff for `src/locators/adminPage.locators.ts`, plus a reminder to run `npx tsc --noEmit`.

### Safety rail lookup

```
@qa-auto-heal I'm in a git worktree and want to push my auto-heal branch. What's the safe command?
```

Expected: the explicit refspec form (`git push origin "HEAD:refs/heads/<branch>"`) and the rationale.

---

## Patterns that won't work (and why)

- **"Trigger a build for me"** — the reference handler doesn't have Jenkins credentials. It will explain the trigger sequence but cannot POST to Jenkins. Wire skills in to enable this (see [EXTENDING.md](EXTENDING.md)).
- **"Open a PR with this diff"** — same reason. The agent advises; it doesn't push.
- **"Read build #95's console for me"** — no fetch tooling in the reference handler. Paste the relevant log section into your prompt instead, or extend with a skill.

---

## Tips

- **Paste verbatim.** The agent's classification rules are message-pattern-based (e.g., `page body should contain "didn't choose"` → PRODUCT_BUG). Paraphrasing the error loses the signal.
- **Mention the TC ID.** The spec has worked examples for the common admin failures — naming the TC ID anchors the response.
- **Ask for the spec section.** "Per which rule?" is a valid follow-up; the agent will cite from `classification_rules.<bucket>`.
- **One conversation per build.** Copilot Chat keeps the message history, so you can iterate: classify → ask for the fix → ask for the email — without re-pasting the build context.
