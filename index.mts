import { chromium, firefox } from "playwright";
import { Cursor } from "./lib/Cursor.ts";
import { scrollToBottom, scrollToTop } from "./lib/scroll.ts";

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ["--start-maximized"],
  });
  const context = await browser.newContext({
    deviceScaleFactor: undefined,
    viewport: null,
  });
  const page = await context.newPage();

  await page.goto("https://ssg-nextjs-cms-sanity.netlify.app/");
  const linkToHomePage = "a:has-text('A static, CMS-based blog example')";

  const cursor = new Cursor(page);
  await cursor.inject();

  await page.waitForTimeout(2000);

  await cursor.moveToElement("a:has-text('How To Get Better At Writing')");
  await page.waitForTimeout(3000);

  await scrollToBottom(page);
  await page.waitForTimeout(2000);

  await scrollToTop(page);
  await page.waitForTimeout(1000);

  await cursor.moveToElement("a:has-text('Contact')");
  await page.waitForTimeout(1000);

  await scrollToBottom(page);
  await page.waitForTimeout(1000);

  await scrollToTop(page);
  await page.waitForTimeout(1000);

  await cursor.moveToElement(linkToHomePage);

  await page.waitForTimeout(1000);

  await context.close();
  process.exit(0);
})();
