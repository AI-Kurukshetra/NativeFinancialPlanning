"use client";

import { motion, useReducedMotion } from "framer-motion";

const FLOATING_ORBS = [
  {
    className:
      "left-[-6rem] top-[12%] h-64 w-64 bg-[radial-gradient(circle,rgba(14,165,233,0.22),rgba(14,165,233,0))] dark:bg-[radial-gradient(circle,rgba(56,189,248,0.18),rgba(56,189,248,0))]",
    duration: 18,
    x: [0, 56, -24, 0],
    y: [0, -24, 28, 0],
  },
  {
    className:
      "right-[-7rem] top-[8%] h-80 w-80 bg-[radial-gradient(circle,rgba(16,185,129,0.18),rgba(16,185,129,0))] dark:bg-[radial-gradient(circle,rgba(52,211,153,0.14),rgba(52,211,153,0))]",
    duration: 22,
    x: [0, -62, 18, 0],
    y: [0, 36, -24, 0],
  },
  {
    className:
      "bottom-[-8rem] left-[18%] h-96 w-96 bg-[radial-gradient(circle,rgba(245,158,11,0.2),rgba(245,158,11,0))] dark:bg-[radial-gradient(circle,rgba(251,191,36,0.12),rgba(251,191,36,0))]",
    duration: 26,
    x: [0, 28, -44, 0],
    y: [0, -42, 18, 0],
  },
];

const SWEEP_LINES = [
  {
    className:
      "top-[16%] h-px w-[34rem] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent dark:via-sky-300/28",
    duration: 12,
    x: ["-16%", "18%", "-10%"],
  },
  {
    className:
      "bottom-[22%] h-px w-[30rem] bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent dark:via-emerald-300/24",
    duration: 14,
    x: ["18%", "-14%", "12%"],
  },
];

const GRAPH_PATHS = [
  {
    className:
      "left-[6%] top-[18%] h-56 w-[26rem] text-sky-500/50 dark:text-sky-300/38",
    duration: 10,
    delay: 0.2,
    path: "M 10 158 C 48 132, 78 136, 108 118 S 164 84, 196 94 S 248 56, 286 62 S 352 26, 406 34",
    area: "M 10 158 C 48 132, 78 136, 108 118 S 164 84, 196 94 S 248 56, 286 62 S 352 26, 406 34 L 406 190 L 10 190 Z",
  },
  {
    className:
      "right-[4%] bottom-[16%] h-52 w-[24rem] text-emerald-500/44 dark:text-emerald-300/32",
    duration: 12,
    delay: 0.8,
    path: "M 10 150 C 44 120, 86 128, 118 112 S 176 74, 214 88 S 272 46, 314 54 S 356 24, 390 32",
    area: "M 10 150 C 44 120, 86 128, 118 112 S 176 74, 214 88 S 272 46, 314 54 S 356 24, 390 32 L 390 188 L 10 188 Z",
  },
];

const BAR_GROUPS = [
  {
    className:
      "left-[10%] bottom-[12%] h-44 w-56 text-amber-500/42 dark:text-amber-300/26",
    bars: [42, 74, 58, 92, 68, 108],
    duration: 8.4,
  },
  {
    className:
      "right-[11%] top-[22%] h-40 w-52 text-violet-500/34 dark:text-violet-300/24",
    bars: [36, 62, 48, 78, 58],
    duration: 9.8,
  },
];

const METRIC_CHIPS = [
  {
    className:
      "left-[14%] top-[14%] border-sky-400/16 bg-white/42 text-slate-700 dark:border-sky-300/12 dark:bg-white/[0.05] dark:text-slate-200",
    label: "Sync",
    value: "24",
    duration: 9,
  },
  {
    className:
      "right-[14%] bottom-[14%] border-emerald-400/16 bg-white/42 text-slate-700 dark:border-emerald-300/12 dark:bg-white/[0.05] dark:text-slate-200",
    label: "Risk",
    value: "03",
    duration: 11,
  },
];

export function AuthAtmosphere() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(240,249,255,0.86),rgba(236,253,245,0.74))] dark:bg-[radial-gradient(circle_at_top,rgba(8,15,29,0.98),rgba(7,23,31,0.94),rgba(5,10,16,0.98))]" />
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px)] [background-size:72px_72px] opacity-80 dark:[background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] dark:opacity-40" />

      <motion.div
        className="absolute inset-[12%] rounded-[3rem] border border-white/40 bg-white/28 shadow-[0_0_0_1px_rgba(255,255,255,0.3)] backdrop-blur-[2px] dark:border-white/8 dark:bg-white/[0.03] dark:shadow-none"
        animate={
          prefersReducedMotion
            ? undefined
            : { rotate: [0, 1.2, -0.8, 0], scale: [1, 1.01, 0.995, 1] }
        }
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      {GRAPH_PATHS.map((graph) => (
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, 14, -10, 0],
                  y: [0, -10, 8, 0],
                  opacity: [0.68, 1, 0.74, 0.68],
                }
          }
          className={`absolute ${graph.className}`}
          key={graph.path}
          transition={{
            duration: graph.duration,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            delay: graph.delay,
          }}
        >
          <svg
            className="h-full w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 420 190"
          >
            <path d={graph.area} fill="currentColor" opacity="0.14" />
            <motion.path
              animate={
                prefersReducedMotion
                  ? undefined
                  : { pathLength: [0.74, 1, 0.88, 1] }
              }
              d={graph.path}
              fill="none"
              stroke="currentColor"
              strokeDasharray="6 8"
              strokeLinecap="round"
              strokeWidth="3"
              transition={{
                duration: graph.duration,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                delay: graph.delay,
              }}
            />
            {[
              [108, 118],
              [196, 94],
              [286, 62],
              [406, 34],
            ].map(([cx, cy], index) => (
              <motion.circle
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { r: [4, 5.5, 4], opacity: [0.55, 1, 0.55] }
                }
                cx={cx}
                cy={cy}
                fill="currentColor"
                key={`${graph.path}-${cx}-${cy}`}
                transition={{
                  duration: 2.6,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                  delay: graph.delay + index * 0.22,
                }}
              />
            ))}
          </svg>
        </motion.div>
      ))}

      {BAR_GROUPS.map((group) => (
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, 10, -8, 0],
                  y: [0, -8, 10, 0],
                  opacity: [0.52, 0.88, 0.6, 0.52],
                }
          }
          className={`absolute ${group.className}`}
          key={group.className}
          transition={{
            duration: group.duration,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <div className="flex h-full items-end gap-2 rounded-[2rem] border border-white/18 bg-white/18 px-5 py-4 backdrop-blur-md dark:border-white/8 dark:bg-white/[0.03]">
            {group.bars.map((height, index) => (
              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        scaleY: [0.88, 1, 0.92, 1],
                        opacity: [0.5, 0.9, 0.6, 0.5],
                      }
                }
                className="w-full origin-bottom rounded-t-[1rem] bg-gradient-to-t from-current via-current/70 to-white/70 dark:to-white/30"
                key={`${group.className}-${height}-${index}`}
                style={{ height }}
                transition={{
                  duration: 3.6,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.16,
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {FLOATING_ORBS.map((orb) => (
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : { x: orb.x, y: orb.y, scale: [1, 1.08, 0.96, 1] }
          }
          className={`absolute rounded-full blur-3xl ${orb.className}`}
          key={orb.className}
          transition={{
            duration: orb.duration,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ))}

      {SWEEP_LINES.map((line) => (
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : { x: line.x, opacity: [0.4, 0.9, 0.4] }
          }
          className={`absolute left-0 blur-[0.5px] ${line.className}`}
          key={line.className}
          transition={{
            duration: line.duration,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ))}

      {METRIC_CHIPS.map((chip) => (
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -8, 0], opacity: [0.58, 0.94, 0.58] }
          }
          className={`absolute rounded-[1.25rem] border px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl ${chip.className}`}
          key={chip.label}
          transition={{
            duration: chip.duration,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <p className="text-[10px] tracking-[0.22em] uppercase opacity-70">
            {chip.label}
          </p>
          <p className="mt-1 text-lg font-semibold">{chip.value}</p>
        </motion.div>
      ))}

      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                backgroundPosition: ["0% 0%", "100% 20%", "20% 100%", "0% 0%"],
              }
        }
        className="absolute inset-0 opacity-70 mix-blend-screen dark:mix-blend-lighten"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 24%, rgba(255,255,255,0.48), transparent 16%), radial-gradient(circle at 72% 18%, rgba(125,211,252,0.3), transparent 22%), radial-gradient(circle at 54% 78%, rgba(110,231,183,0.26), transparent 20%)",
          backgroundSize: "160% 160%",
        }}
        transition={{
          duration: 24,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  );
}
