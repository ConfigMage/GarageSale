"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

type CountdownTimerProps = {
  saleDate: string;
};

type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
};

function getRemainingTime(saleDate: string): RemainingTime {
  const target = new Date(saleDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isLive: false,
  };
}

export function CountdownTimer({ saleDate }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<RemainingTime>(() =>
    getRemainingTime(saleDate),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(getRemainingTime(saleDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [saleDate]);

  if (remaining.isLive) {
    return (
      <div className="flex items-center gap-3 rounded-lg border-2 border-broadcast-red bg-white px-4 py-3 text-broadcast-ink shadow-promo">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-broadcast-red text-white">
          <Clock aria-hidden="true" size={20} />
        </span>
        <p className="font-extrabold uppercase tracking-wide">The sale is live!</p>
      </div>
    );
  }

  const parts = [
    ["Days", remaining.days],
    ["Hours", remaining.hours],
    ["Minutes", remaining.minutes],
    ["Seconds", remaining.seconds],
  ] as const;

  return (
    <section
      aria-label="Countdown to sale"
      className="rounded-lg border-2 border-broadcast-blue bg-white p-4 shadow-promo"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-broadcast-blue">
        <Clock aria-hidden="true" size={18} />
        The countdown desk reports
      </div>
      <div className="grid grid-cols-4 gap-2">
        {parts.map(([label, value]) => (
          <div
            key={label}
            className="rounded-md bg-broadcast-ink px-2 py-3 text-center text-white"
          >
            <div className="text-xl font-black sm:text-2xl">
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-[0.62rem] font-bold uppercase tracking-wide text-broadcast-gold sm:text-xs">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
