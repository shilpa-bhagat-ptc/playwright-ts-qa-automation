// global-setup.ts
import { chromium, FullConfig } from "@playwright/test";
import path from "path";
import { formatXml } from "../../tools/formatJUnitReport";

const QALINK_BASE =
  process.env.TEST_QALINK_BASE || "https://lqatms-test5.ptcnet.ptc.com/QALink";
const LOGIN_URL = `${QALINK_BASE}/jsp/home/login.jsp?page_url=/jsp/home/index.jsp?`;

const MAX_RETRIES = 3;
const GOTO_TIMEOUT_MS = 60_000;
const RETRY_DELAY_MS = 5_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function globalSetup(config: FullConfig) {
  console.log("Global setup...");

  const browser = await chromium.launch({ headless: true });

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      console.log(
        `Attempt ${attempt}/${MAX_RETRIES}: navigating to login page...`,
      );
      await page.goto(LOGIN_URL, { timeout: GOTO_TIMEOUT_MS });
      await page.waitForSelector('input[name="login_id"]');

      await page.fill('input[name="login_id"]', "sbhagat");
      await page.fill('input[name="password"]', "123");
      await page.click('input[type="submit"][value="Log In"]');
      await page.waitForLoadState("networkidle");
      console.log(`Logged in. Current URL: ${page.url()}`);

      const storagePath = path.resolve(
        process.cwd(),
        ".auth/storageState.json",
      );
      await page.context().storageState({ path: storagePath });
      console.log(`Storage state saved to: ${storagePath}`);
      await browser.close();
      console.log("Session stored successfully.");
      await formatXml();
      console.log("XML formatted successfully.");
      console.log("Global setup completed.");
      return;
    } catch (err) {
      lastError = err;
      console.error(
        `Attempt ${attempt}/${MAX_RETRIES} failed: ${(err as Error).message}`,
      );
      await context.close();

      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  await browser.close();
  throw new Error(
    `Global setup failed after ${MAX_RETRIES} attempts. Last error: ${(lastError as Error).message}`,
  );
}

export default globalSetup;
