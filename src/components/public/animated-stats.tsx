"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STATS = [
  { value: 5000, suffix: "+", label: "Students Enrolled" },
  { value: 200, suffix: "+", label: "Faculty Members" },
  { value: 50, suffix: "+", label: "Years of Excellence" },
  { value: 98, suffix: "%", label: "Graduate Employment" },
] as const;

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start: number | null = null;
    let raf = 0;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return count;
}

function StatItem({
  value,
  suffix,
  label,
  index,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  index: number;
  active: boolean;
}) {
  const count = useCountUp(value, active);

  return (
    <div
      className={cn(
        "text-center transition-opacity duration-700 ease-out",
        active ? "opacity-100" : "opacity-0"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-2xl font-bold tabular-nums text-blue-700 sm:text-3xl">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </div>
  );
}

export function AnimatedStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-b bg-white py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              index={index}
              active={active}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
