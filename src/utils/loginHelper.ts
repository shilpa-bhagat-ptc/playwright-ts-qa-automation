import { Page } from "@playwright/test";
import testData from "../data/users.json";

export async function login(page: Page) {
  await page.goto("http://lqatms-test3.ptcnet.ptc.com:8080/QALink/jsp/home/");

  await page.fill("#username", testData.validUser.username);
  await page.fill("#password", testData.validUser.password);
  await page.click("#loginButton");

  // await page.waitForURL("**/home"); // wait until navigation completes
}
