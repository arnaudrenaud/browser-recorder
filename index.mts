import { chromium, firefox } from "playwright";
import { Cursor } from "./lib/Cursor.ts";
import { scrollToBottom, scrollToTop } from "./lib/scroll.ts";

const VIEWPORT_WIDTH = 1024;
const VIEWPORT_HEIGHT = 640;

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    recordVideo: {
      dir: "videos/",
      size: { width: VIEWPORT_WIDTH * 2, height: VIEWPORT_HEIGHT * 2 },
    },
  });
  const page = await context.newPage();

  await page.goto("http://localhost:3000");
  const linkToHomePage = "a:has-text('A static, CMS-based blog example')";

  const cursor = new Cursor(page);
  await cursor.inject();

  await page.waitForTimeout(3000);

  await cursor.moveToElement("a:has-text('How To Get Better At Writing')");
  await page.waitForTimeout(3000);

  await scrollToBottom(page);
  await page.waitForTimeout(2000);

  await scrollToTop(page);
  await page.waitForTimeout(1000);

  await cursor.moveToElement("a:has-text('Contact')");
  await page.waitForTimeout(4000);

  await cursor.moveToElement(linkToHomePage);

  await page.waitForTimeout(2000);

  await context.close();
  process.exit(0);
})();
