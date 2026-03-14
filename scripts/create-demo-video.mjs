import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";

import { chromium } from "playwright";

const execFile = promisify(execFileCallback);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const baseUrl = process.env.DEMO_BASE_URL ?? "https://native-financial-planning.vercel.app";
const email = process.env.DEMO_EMAIL;
const password = process.env.DEMO_PASSWORD;

if (!email || !password) {
  throw new Error("Set DEMO_EMAIL and DEMO_PASSWORD before running this script.");
}

const chromePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const outputRoot = path.join(projectRoot, "artifacts", "demo-video");
const timestamp = new Date().toISOString().replaceAll(":", "-");
const runDir = path.join(outputRoot, timestamp);
const videoDir = path.join(runDir, "playwright-video");
const audioDir = path.join(runDir, "audio");
const finalVideoPath = path.join(runDir, "native-financial-planning-demo.mp4");
const rawVideoPath = path.join(runDir, "raw-playwright-video.webm");
const transcriptPath = path.join(runDir, "narration-script.txt");

const appRoutes = [
  {
    path: "/workspace",
    title: "Workspace",
    minDurationMs: 32000,
    narration:
      "We are now inside the light theme workspace area. This page shows the organizational foundation, which is where a finance team keeps company context, access structure, and the operating environment that the rest of the platform depends on.",
  },
  {
    path: "/dashboard",
    title: "Dashboard",
    minDurationMs: 34000,
    narration:
      "The dashboard is the executive command center. It compresses the planning cycle into a fast read of metrics, risk signals, operational status, and the priorities that leadership needs to understand before making decisions.",
  },
  {
    path: "/analytics",
    title: "Analytics",
    minDurationMs: 34000,
    narration:
      "Analytics goes deeper into performance health. This is where the team can inspect KPI movement, compare plan versus actual behavior, and surface the drivers behind variance instead of relying on disconnected spreadsheets.",
  },
  {
    path: "/workbooks",
    title: "Workbooks",
    minDurationMs: 36000,
    narration:
      "Workbooks represent the spreadsheet-native core of the product. Teams keep the familiar grid mindset, but now the models live inside a governed application with shared visibility, structured ownership, and version awareness.",
  },
  {
    path: "/budgets",
    title: "Budgets",
    minDurationMs: 34000,
    narration:
      "The budgets section is where planning cycles become coordinated work. Instead of emailing files around, owners, reviewers, and finance leads can move through a defined process with accountability and clearer handoffs.",
  },
  {
    path: "/forecasts",
    title: "Forecasts",
    minDurationMs: 34000,
    narration:
      "Forecasts focuses on rolling outlooks and scenario readiness. This is the layer that helps teams react to changing assumptions, refresh expectations, and keep the future view connected to the source model.",
  },
  {
    path: "/reports",
    title: "Reports",
    minDurationMs: 34000,
    narration:
      "Reports turns the planning system into output that leaders can consume. Board pack style reporting, exports, and presentation-ready views can all be produced from the same governed data instead of separate manual decks.",
  },
  {
    path: "/modeling",
    title: "Modeling",
    minDurationMs: 34000,
    narration:
      "Modeling is the scenario and structure studio. Finance can examine assumptions, reshape planning logic, and test alternate operating paths while staying anchored to a consistent application framework.",
  },
  {
    path: "/currencies",
    title: "Currencies",
    minDurationMs: 30000,
    narration:
      "Currencies handles base currency setup and foreign exchange context. For distributed finance organizations, this is essential because planning credibility depends on having a clean and explainable currency model.",
  },
  {
    path: "/templates",
    title: "Templates",
    minDurationMs: 30000,
    narration:
      "Templates make repeatability practical. Teams can standardize planning blueprints, preserve structure that works, and launch new cycles faster without rebuilding models from scratch every time.",
  },
  {
    path: "/workflows",
    title: "Workflows",
    minDurationMs: 34000,
    narration:
      "Workflows is where approvals and routing become explicit. It ties together contributors, reviewers, and final decision makers so the operating rhythm of the planning cycle is visible instead of buried in chat threads and email.",
  },
  {
    path: "/integrations",
    title: "Integrations",
    minDurationMs: 32000,
    narration:
      "Integrations connects the platform to external data sources. This matters because a planning system becomes far more valuable when actuals, operational signals, and upstream systems flow into the same finance workspace.",
  },
  {
    path: "/notifications",
    title: "Notifications",
    minDurationMs: 28000,
    narration:
      "The inbox brings action items together in one place. It helps planners and reviewers quickly identify what changed, what needs attention, and where the next approval or follow-up should happen.",
  },
];

const scenes = [
  {
    key: "landing-navbar",
    title: "Landing page intro, navbar, and theme",
    minDurationMs: 42000,
    narration:
      "We are starting from the Native Financial Planning landing page. Right away the page presents a strong finance-first visual identity, a polished hero section, and a top navigation bar that quickly explains how the site is organized. In the navbar you can see direct jumps to the definition, platform, and workflow sections, along with pricing, login, and the primary start planning call to action. The theme switcher is also built directly into the header, which is useful because it lets visitors see the product's visual quality across light and dark presentations without leaving the page.",
    action: async (page) => {
      await gotoPath(page, "/");
      await hold(1500);
      await hoverText(page, "Definition");
      await hold(800);
      await hoverText(page, "Platform");
      await hold(800);
      await hoverText(page, "Workflow");
      await hold(800);
      await setTheme(page, "dark");
      await hold(1800);
      await setTheme(page, "light");
      await hold(1600);
    },
  },
  {
    key: "landing-hero",
    title: "Landing hero and value props",
    minDurationMs: 38000,
    narration:
      "The hero area explains the product position clearly. Native F P and A is framed as a spreadsheet-native operating system, so the message is not about replacing finance habits with a foreign workflow. Instead it keeps the familiarity of the grid while adding structured collaboration, approvals, and leadership visibility. The supporting cards reinforce the three main strengths: spreadsheet-native control, audit-ready collaboration, and a planning system that behaves like software rather than a loose file share.",
    action: async (page) => {
      await gotoPath(page, "/");
      await hold(1200);
      await smoothScrollBy(page, 760, 16000);
      await hold(1200);
      await smoothScrollBy(page, -180, 2200);
    },
  },
  {
    key: "landing-sections",
    title: "Landing definition, platform, and workflow sections",
    minDurationMs: 44000,
    narration:
      "As we continue down the landing page, the section flow shows how the story is structured. The definition area clarifies the business problem being solved, the platform area visualizes the product surface in more detail, and the workflow section explains how modeling, review, and publishing come together inside one process. This is a strong landing experience because it is not only attractive, it is sequenced like a real product narrative for finance operators, reviewers, and executives.",
    action: async (page) => {
      await gotoPath(page, "/");
      await hold(1000);
      await smoothScrollToSelector(page, "#definition", 9000);
      await hold(1300);
      await smoothScrollToSelector(page, "#platform", 9000);
      await hold(1300);
      await smoothScrollToSelector(page, "#workflow", 10000);
      await hold(1600);
    },
  },
  {
    key: "terms",
    title: "Terms page",
    minDurationMs: 32000,
    narration:
      "From the public site we can also review the legal pages. The terms page is not a thin placeholder. It is laid out as a structured document with clearly separated sections around service scope, user obligations, intellectual property, payments, privacy references, and liability boundaries. That gives the product a more complete and trustworthy public surface.",
    action: async (page) => {
      await gotoPath(page, "/terms");
      await hold(1000);
      await slowTourScrollablePage(page, 20000);
    },
  },
  {
    key: "contact",
    title: "Contact page",
    minDurationMs: 34000,
    narration:
      "The contact page is also fully designed rather than treated as an afterthought. It combines a contact form, multiple communication channels, and a compact frequently asked questions area. That mix helps the page serve sales, support, and general discovery at the same time, while maintaining the same visual language as the rest of the site.",
    action: async (page) => {
      await gotoPath(page, "/contact");
      await hold(1000);
      await slowTourScrollablePage(page, 22000);
    },
  },
  {
    key: "privacy",
    title: "Privacy page",
    minDurationMs: 32000,
    narration:
      "The privacy page follows the same level of care. It covers data collection, usage, retention, security, cookies, and contact details in a clean card-based presentation. Together with the terms and contact pages, it rounds out the public experience and makes the brand feel more production ready.",
    action: async (page) => {
      await gotoPath(page, "/privacy");
      await hold(1000);
      await slowTourScrollablePage(page, 20000);
    },
  },
  {
    key: "signup-dark",
    title: "Signup page in dark theme",
    minDurationMs: 28000,
    narration:
      "Next, here is the signup page shown in dark theme, exactly as requested. The dark presentation carries the same premium visual treatment with the atmospheric background, the workspace access framing, and the guided form for name, organization, email, password, and terms acceptance. This page is only being shown for theme presentation and overall experience, not for submitting a new account.",
    action: async (page) => {
      await gotoPath(page, "/signup");
      await hold(1200);
      await setTheme(page, "dark");
      await hold(1600);
      await slowTourScrollablePage(page, 15000);
    },
  },
  {
    key: "login-light",
    title: "Login and switch to light theme",
    minDurationMs: 38000,
    narration:
      "From signup we move to login, switch the interface back to light theme, and then enter the provided credentials. This makes the transition clear: dark theme is demonstrated on signup, while the authenticated product tour that follows is intentionally kept in light theme so each workspace page remains bright and easy to read in the video.",
    action: async (page) => {
      await gotoPath(page, "/login");
      await hold(1200);
      await setTheme(page, "light");
      await hold(1200);
      await page.getByLabel("Work email").fill(email);
      await hold(700);
      await page.getByLabel("Password").fill(password);
      await hold(700);
      await page.getByRole("button", { name: /sign in/i }).click();
      await page.waitForURL("**/dashboard", { timeout: 30000 });
      await page.waitForLoadState("networkidle");
      await hold(2200);
    },
  },
  ...appRoutes.map((route) => ({
    key: route.path.replaceAll("/", "") || "root",
    title: route.title,
    minDurationMs: route.minDurationMs,
    narration: route.narration,
    action: async (page) => {
      await gotoPath(page, route.path);
      await ensureLightTheme(page);
      await hold(1200);
      await slowTourScrollablePage(page, Math.max(route.minDurationMs - 8000, 16000));
    },
  })),
];

async function main() {
  await fs.mkdir(videoDir, { recursive: true });
  await fs.mkdir(audioDir, { recursive: true });

  const scenePlan = await buildNarrationAssets();
  await fs.writeFile(
    transcriptPath,
    scenePlan
      .map(
        (scene, index) =>
          `${String(index + 1).padStart(2, "0")}. ${scene.title}\n${scene.narration}\n`,
      )
      .join("\n"),
    "utf8",
  );

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    slowMo: 120,
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    screen: { width: 1600, height: 900 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1600, height: 900 },
    },
  });

  const page = await context.newPage();
  const recordedVideo = page.video();

  try {
    for (const scene of scenePlan) {
      console.log(`Recording scene: ${scene.title}`);
      const startedAt = Date.now();
      await scene.action(page);
      const elapsedMs = Date.now() - startedAt;
      const remainingMs = Math.max(scene.targetDurationMs - elapsedMs, 0);
      if (remainingMs > 0) {
        await hold(remainingMs);
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }

  if (!recordedVideo) {
    throw new Error("Playwright did not produce a video object.");
  }

  await persistRecordedVideo(recordedVideo);
  const finalNarrationPath = await alignNarrationToVideo(scenePlan);
  await muxVideoAndAudio(rawVideoPath, finalNarrationPath, finalVideoPath);

  const videoDuration = await getDurationSeconds(finalVideoPath);
  console.log(JSON.stringify({ runDir, finalVideoPath, videoDuration }, null, 2));
}

async function buildNarrationAssets() {
  const plan = [];

  for (let index = 0; index < scenes.length; index += 1) {
    const scene = scenes[index];
    const sceneStem = `${String(index + 1).padStart(2, "0")}-${scene.key}`;
    const rawSpeechPath = path.join(audioDir, `${sceneStem}.aiff`);
    const paddedSpeechPath = path.join(audioDir, `${sceneStem}-padded.wav`);

    await run("say", ["-v", "Samantha", "-r", "168", "-o", rawSpeechPath, scene.narration]);
    const speechDurationMs = Math.ceil((await getDurationSeconds(rawSpeechPath)) * 1000);
    const targetDurationMs = Math.max(scene.minDurationMs, speechDurationMs + 1200);
    const targetDurationSeconds = millisecondsToSeconds(targetDurationMs);

    await run("ffmpeg", [
      "-y",
      "-i",
      rawSpeechPath,
      "-af",
      `apad,atrim=0:${targetDurationSeconds}`,
      "-ar",
      "22050",
      "-ac",
      "1",
      "-c:a",
      "pcm_s16le",
      paddedSpeechPath,
    ]);

    plan.push({
      ...scene,
      speechDurationMs,
      targetDurationMs,
      paddedSpeechPath,
    });
  }

  return plan;
}

async function alignNarrationToVideo(scenePlan) {
  const concatListPath = path.join(audioDir, "concat-list.txt");
  const combinedNarrationPath = path.join(audioDir, "narration-combined.wav");
  const alignedNarrationPath = path.join(audioDir, "narration-aligned.wav");
  const rawVideoDuration = await getDurationSeconds(rawVideoPath);

  await fs.writeFile(
    concatListPath,
    scenePlan
      .map((scene) => `file '${escapeForConcatFile(scene.paddedSpeechPath)}'`)
      .join("\n"),
    "utf8",
  );

  await run("ffmpeg", [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatListPath,
    "-c",
    "copy",
    combinedNarrationPath,
  ]);

  await run("ffmpeg", [
    "-y",
    "-i",
    combinedNarrationPath,
    "-af",
    `apad,atrim=0:${rawVideoDuration.toFixed(3)}`,
    "-ar",
    "22050",
    "-ac",
    "1",
    "-c:a",
    "pcm_s16le",
    alignedNarrationPath,
  ]);

  return alignedNarrationPath;
}

async function muxVideoAndAudio(videoInputPath, audioInputPath, outputPath) {
  await run("ffmpeg", [
    "-y",
    "-i",
    videoInputPath,
    "-i",
    audioInputPath,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-shortest",
    outputPath,
  ]);
}

async function persistRecordedVideo(recordedVideo) {
  if (!recordedVideo) {
    throw new Error("Playwright did not produce a video object.");
  }

  try {
    await recordedVideo.saveAs(rawVideoPath);
    return;
  } catch {
    const locatedVideoPath = await findRecordedVideoInDirectory();
    await fs.copyFile(locatedVideoPath, rawVideoPath);
  }
}

async function gotoPath(page, routePath) {
  await page.goto(new URL(routePath, baseUrl).toString(), {
    waitUntil: "load",
    timeout: 45000,
  });
  await page.waitForLoadState("domcontentloaded");
  try {
    await page.waitForLoadState("networkidle", { timeout: 15000 });
  } catch {
    // Some pages keep background requests alive. The walkthrough can continue.
  }
}

async function setTheme(page, themeName) {
  const target = page.getByRole("tab", {
    name: new RegExp(`^${themeName}$`, "i"),
  });

  if ((await target.count()) === 0) {
    return;
  }

  const active = target.first();
  const selected = await active.getAttribute("aria-selected");
  if (selected === "true") {
    return;
  }

  await active.click();
}

async function ensureLightTheme(page) {
  await setTheme(page, "light");
}

async function hoverText(page, text) {
  const target = page.getByText(text, { exact: true }).first();
  if ((await target.count()) > 0) {
    await target.hover();
  }
}

async function smoothScrollBy(page, distance, durationMs) {
  await page.evaluate(
    async ({ distancePx, duration }) => {
      const startY = window.scrollY;
      const maxY = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      const endY = Math.max(0, Math.min(startY + distancePx, maxY));
      const delta = endY - startY;

      await new Promise((resolve) => {
        let startTime = 0;
        const easeInOut = (value) =>
          value < 0.5
            ? 2 * value * value
            : 1 - Math.pow(-2 * value + 2, 2) / 2;

        const frame = (timestamp) => {
          if (!startTime) {
            startTime = timestamp;
          }

          const progress = Math.min((timestamp - startTime) / duration, 1);
          window.scrollTo(0, startY + delta * easeInOut(progress));

          if (progress < 1) {
            window.requestAnimationFrame(frame);
            return;
          }

          resolve();
        };

        window.requestAnimationFrame(frame);
      });
    },
    { distancePx: distance, duration: durationMs },
  );
}

async function smoothScrollToSelector(page, selector, durationMs) {
  const targetY = await page.locator(selector).first().evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return rect.top + window.scrollY;
  }).catch(() => null);

  if (targetY === null) {
    return;
  }

  const currentY = await page.evaluate(() => window.scrollY);
  await smoothScrollBy(page, targetY - currentY - 80, durationMs);
}

async function slowTourScrollablePage(page, durationMs) {
  const scrollableHeight = await page.evaluate(
    () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 0),
  );

  if (scrollableHeight < 80) {
    await hold(durationMs);
    return;
  }

  const downOne = Math.round(scrollableHeight * 0.42);
  const downTwo = Math.round(scrollableHeight * 0.42);
  const upDistance = Math.round(scrollableHeight * 0.22);

  await smoothScrollBy(page, downOne, Math.round(durationMs * 0.42));
  await hold(900);
  await smoothScrollBy(page, downTwo, Math.round(durationMs * 0.24));
  await hold(900);
  await smoothScrollBy(page, -upDistance, Math.round(durationMs * 0.14));
  await hold(700);
  await smoothScrollBy(page, Math.round(scrollableHeight * 0.1), Math.round(durationMs * 0.08));
}

async function getDurationSeconds(filePath) {
  const { stdout } = await run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ]);

  const duration = Number.parseFloat(stdout.trim());
  if (!Number.isFinite(duration)) {
    throw new Error(`Could not read duration for ${filePath}`);
  }

  return duration;
}

async function hold(durationMs) {
  await new Promise((resolve) => setTimeout(resolve, durationMs));
}

async function run(command, args) {
  return execFile(command, args, {
    cwd: projectRoot,
    maxBuffer: 1024 * 1024 * 20,
  });
}

async function findRecordedVideoInDirectory() {
  const directoryEntries = await fs.readdir(videoDir, { withFileTypes: true });
  const videoFile = directoryEntries.find(
    (entry) => entry.isFile() && entry.name.endsWith(".webm"),
  );

  if (!videoFile) {
    throw new Error(`No recorded Playwright video found in ${videoDir}`);
  }

  return path.join(videoDir, videoFile.name);
}

function millisecondsToSeconds(value) {
  return (value / 1000).toFixed(3);
}

function escapeForConcatFile(filePath) {
  return filePath.replaceAll("'", "'\\''");
}

await main();
