"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-animate='fade-up']", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      <p
        data-animate="fade-up"
        className="mb-4 text-sm uppercase tracking-[0.3em] text-foreground/60"
      >
        You are cordially invited
      </p>
      <h1
        data-animate="fade-up"
        className="font-primary text-5xl font-light leading-tight tracking-wide sm:text-7xl"
      >
        Shadi Invitation
      </h1>
      <p
        data-animate="fade-up"
        className="mt-6 max-w-md text-base leading-relaxed text-foreground/70"
      >
        A beautiful celebration awaits. Built with Next.js, Tailwind CSS, and
        GSAP animations.
      </p>
    </div>
  );
}
