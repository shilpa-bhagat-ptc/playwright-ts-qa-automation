// global-setup.ts
import { chromium, FullConfig } from "@playwright/test";
import dns from "dns/promises";
import net from "net";
import path from "path";
import { formatXml } from "../../tools/formatJUnitReport";

const LOGIN_URL =
  "http://lqatms-test4.ptcnet.ptc.com:8080/QALink/jsp/home/login.jsp?page_url=/jsp/home/index.jsp?";
const TARGET_HOST = "lqatms-test4.ptcnet.ptc.com";
const TARGET_PORT = 8080;
const MAX_RETRIES = 3;
const GOTO_TIMEOUT_MS = 60_000;
const RETRY_DELAY_MS = 5_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Resolves the hostname to verify DNS is reachable from this machine. */
async function checkDns(host: string): Promise<void> {
  try {
    const addresses = await dns.lookup(host);
    console.log(`DNS OK: ${host} → ${addresses.address}`);
  } catch (err) {
    throw new Error(
      `DNS resolution failed for "${host}". The Jenkins machine cannot resolve this hostname. ` +
        `Check that the Jenkins agent has access to the internal DNS server. Underlying: ${(err as Error).message}`,
    );
  }
}

/** Opens a raw TCP socket to verify port reachability before launching a browser. */
async function checkTcpPort(host: string, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const timeout = 10_000;

    socket.setTimeout(timeout);

    socket.connect(port, host, () => {
      console.log(`TCP OK: ${host}:${port} is reachable.`);
      socket.destroy();
      resolve();
    });

    socket.on("timeout", () => {
      socket.destroy();
      reject(
        new Error(
          `TCP connection to ${host}:${port} timed out after ${timeout / 1000}s. ` +
            `A firewall or network policy on the Jenkins agent is likely blocking outbound port ${port}.`,
        ),
      );
    });

    socket.on("error", (err) => {
      socket.destroy();
      reject(
        new Error(
          `TCP connection to ${host}:${port} failed: ${err.message}. ` +
            `Verify that the Jenkins agent has network access to this host and port.`,
        ),
      );
    });
  });
}

async function globalSetup(config: FullConfig) {
  console.log("Global setup...");

  // --- Pre-flight checks: diagnose connectivity before launching a browser ---
  await checkDns(TARGET_HOST);
  await checkTcpPort(TARGET_HOST, TARGET_PORT);

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
