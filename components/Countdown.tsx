"use client";

import React from "react";

function split(ms: number) {
  const total = Math.max(0, ms);
  const d = Math.floor(total / (1000 * 60 * 60 * 24));
  const h = Math.floor((total / (1000 * 60 * 60)) % 24);
  const m = Math.floor((total / (1000 * 60)) % 60);
  const s = Math.floor((total / 1000) % 60);
  return { d, h, m, s, expired: total === 0 };
}

export default function Countdown({ expDate }: { expDate: string }) {
  // null on first render so SSR/CSR markup is identical (placeholder)
  const [left, setLeft] = React.useState<number | null>(null);

  React.useEffect(() => {
    const target = new Date(expDate).getTime();
    if (Number.isNaN(target)) {
      setLeft(0);
      return;
    }

    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick(); // set immediately after mount
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expDate]);

  return (
    <div className="text-2xl mb-3" suppressHydrationWarning>
      {left === null ? (
        // SSR-stable placeholder
        <span className="bg-gradient-to-l from-blue-950 to-violet-700 text-transparent bg-clip-text font-bold">
          --d --h --m --s
        </span>
      ) : (
        (() => {
          const { d, h, m, s, expired } = split(left);
          return expired ? (
            <span className="text-red-600 font-bold">Deal expired</span>
          ) : (
            <span className="bg-gradient-to-l from-blue-950 to-violet-700 text-transparent bg-clip-text font-bold">
              {d}d {h}h {m}m {s}s left
            </span>
          );
        })()
      )}
    </div>
  );
}
