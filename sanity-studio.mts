import { chromium } from "playwright";
import dotenv from "dotenv";
import { Cursor } from "./lib/Cursor.ts";
import { scrollToBottom } from "./lib/scroll.ts";

dotenv.config();

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

  await context.addCookies([
    {
      name: "sanitySession",
      value: process.env.SANITY_SESSION as string,
      path: "/",
      domain: ".1u50zzgg.api.sanity.io",
      httpOnly: true,
      secure: true,
      sameSite: "None",
    },
  ]);
  await page.goto("https://ssg-nextjs-cms-sanity.sanity.studio/structure");

  const cursor = new Cursor(page);
  await cursor.inject();

  await page.waitForTimeout(5000);

  await cursor.moveToElement("a:has-text('Metadata')");

  await page.waitForTimeout(3000);

  await cursor.moveToElement("a:has-text('Home page')");
  await page.waitForTimeout(3000);

  await cursor.moveToElement("a:has-text('Posts')");
  await page.waitForTimeout(3000);

  await cursor.moveToElement("a:has-text('The Art of Reading')");
  await page.waitForTimeout(3000);

  await cursor.moveToElement("h2:has-text('The Art of Reading')", {
    click: false,
  });
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    const bodyField = document.querySelector(
      'div[data-comments-field-id="mainImage"]'
    );
    if (bodyField) {
      bodyField?.scrollIntoView({ behavior: "smooth" });
    }
  });
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    const bodyField = document.querySelector(
      'div[data-comments-field-id="body"]'
    );
    if (bodyField) {
      bodyField?.scrollIntoView({ behavior: "smooth" });
    }
  });
  await page.waitForTimeout(3000);

  await cursor.moveToElement("a:has-text('Authors')");
  await page.waitForTimeout(3000);

  await cursor.moveToElement("a:has-text('Arnaud Renaud')");
  await page.waitForTimeout(3000);

  await context.close();
  process.exit(0);
})();
