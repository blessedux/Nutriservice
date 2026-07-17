/**
 * Records a smooth top-to-bottom homepage scroll for Remotion mockups.
 * Requires the Nutriservice Next.js app running (default http://localhost:3001).
 *
 * Usage:
 *   npm run record:scroll
 */
import {chromium} from 'playwright';
import {mkdir, rename, rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/screenshots');
const TMP_DIR = path.join(__dirname, '../.record-tmp');
const BASE_URL = process.env.RECORD_URL ?? 'http://localhost:3003';
const SCROLL_MS = Number(process.env.SCROLL_MS ?? 6500);
const SITE_MARKER = 'Nutriservice';

async function assertNutriserviceSite(page) {
  const title = await page.title();
  const bodyText = await page.locator('body').innerText();
  if (!title.includes(SITE_MARKER) && !bodyText.includes(SITE_MARKER)) {
    throw new Error(
      `${BASE_URL} does not look like Nutriservice (missing "${SITE_MARKER}" in title/body). ` +
        'Start the Nutriservice dev server: npm run dev -- -p 3003',
    );
  }
  console.log(`Confirmed Nutriservice site at ${BASE_URL} (title: ${title})`);
}

const SESSION_KEYS = {
  entered: 'nutriservice:entered',
  sound: 'nutriservice:sound-enabled',
};

async function smoothScroll(page, durationMs) {
  await page.evaluate(async (duration) => {
    window.scrollTo(0, 0);
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const start = performance.now();

    await new Promise((resolve) => {
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased =
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo(0, maxScroll * eased);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }, durationMs);
}

async function recordScroll({width, height, outfile, deviceScaleFactor = 1}) {
  await mkdir(TMP_DIR, {recursive: true});

  const browser = await chromium.launch({headless: true});
  const context = await browser.newContext({
    viewport: {width, height},
    deviceScaleFactor,
    recordVideo: {
      dir: TMP_DIR,
      size: {width, height},
    },
    reducedMotion: 'reduce',
  });

  await context.addInitScript(
    ({entered, sound}) => {
      sessionStorage.setItem(entered, 'true');
      sessionStorage.setItem(sound, 'false');
    },
    {entered: SESSION_KEYS.entered, sound: SESSION_KEYS.sound},
  );

  const page = await context.newPage();
  await page.goto(BASE_URL, {waitUntil: 'domcontentloaded', timeout: 120_000});
  await assertNutriserviceSite(page);
  await page.waitForLoadState('networkidle', {timeout: 120_000}).catch(() => {});
  // Let hero / layout settle after preloader bypass.
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  const video = page.video();
  if (!video) throw new Error('Playwright video capture unavailable');

  await smoothScroll(page, SCROLL_MS);
  await page.waitForTimeout(500);

  await page.close();
  await context.close();
  await browser.close();

  const rawPath = await video.path();
  const dest = path.join(OUT_DIR, outfile);
  await rename(rawPath, dest);
  console.log(`Wrote ${dest}`);
}

async function main() {
  await mkdir(OUT_DIR, {recursive: true});
  await rm(TMP_DIR, {recursive: true, force: true});

  console.log(`Recording from ${BASE_URL} (${SCROLL_MS}ms scroll)`);

  await recordScroll({
    width: 1440,
    height: 900,
    outfile: 'homepage-scroll.webm',
    deviceScaleFactor: 2,
  });

  await recordScroll({
    width: 390,
    height: 844,
    outfile: 'homepage-scroll-mobile.webm',
    deviceScaleFactor: 3,
  });

  await rm(TMP_DIR, {recursive: true, force: true});
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
