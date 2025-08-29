import type { Page } from "playwright";

export interface CursorOptions {
  click: boolean;
  delayBeforeClickMs?: number;
}

export class Cursor {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  inject = async (initialPositionSelector?: string): Promise<void> => {
    // TODO: Add a way to inject cursor on element targeted by selector
    await this.page.addStyleTag({
      content: `
      * {
        box-sizing: border-box;
      }

      .fake-cursor {
        width: 30px;
        height: 30px;
        background-color: black;
        border: 3px solid gray;
        opacity: 0.5;
        border-radius: 50%;
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        transition: top 0.5s linear, left 0.5s linear;
      }

      .fake-cursor.clicked {
        background-color: orange;
      }
    `,
    });

    // Create and inject the fake cursor element
    await this.page.evaluate(async (initialPositionSelector) => {
      const cursor = document.createElement("div");
      cursor.className = "fake-cursor";

      const initialPosition = initialPositionSelector
        ? await this.getElementPosition(initialPositionSelector)
        : { x: 100, y: 100 };

      cursor.style.left = `${initialPosition.x - 15}px`;
      cursor.style.top = `${initialPosition.y - 15}px`;

      document.body.appendChild(cursor);
    }, initialPositionSelector);
  };

  private getElementPosition = async (selector: string) => {
    return await this.page.$eval(selector, (el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });
  };

  moveToElement = async (
    selector: string,
    options: CursorOptions = { click: true, delayBeforeClickMs: 750 }
  ): Promise<void> => {
    const box = await this.getElementPosition(selector);

    await this.page.evaluate(({ x, y }) => {
      const cursor = document.querySelector(".fake-cursor") as HTMLElement;
      if (cursor) {
        cursor.style.left = `${x - 15}px`;
        cursor.style.top = `${y - 15}px`;
      }
    }, box);

    if (options?.click) {
      if (options.delayBeforeClickMs && options.delayBeforeClickMs > 0) {
        await this.page.waitForTimeout(options.delayBeforeClickMs);
      }
      await this.page.evaluate(() => {
        const cursor = document.querySelector(".fake-cursor") as HTMLElement;
        if (cursor) {
          cursor.classList.add("clicked");
          setTimeout(() => {
            cursor.classList.remove("clicked");
          }, 250);
        }
      });
      await this.page.click(selector);
    }
  };
}
