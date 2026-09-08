"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const OCTOBER_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function OctoberCalendar() {
  const firstWeekday = 4;
  const cells: Array<number | null> = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: 31 }, (_, i) => i + 1),
  ];

  return (
    <div className="mt-6 w-full max-w-[260px] text-maroon">
      <div className="grid grid-cols-7 gap-y-2 text-center font-sans text-[10px] font-semibold uppercase tracking-wide">
        {OCTOBER_WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-y-2 text-center font-sans text-sm">
        {cells.map((day, i) => (
          <span
            key={`${day ?? "e"}-${i}`}
            className="relative flex h-8 items-center justify-center"
          >
            {day === 17 ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="absolute h-8 w-8 text-maroon"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 20s-7-4.4-9.4-8.6C.6 8.4 2.4 5 6 5c1.9 0 3.3 1.2 4 2.5C10.7 6.2 12.1 5 14 5c3.6 0 5.4 3.4 3.4 6.4C19 15.6 12 20 12 20z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
                <span className="relative z-10 font-semibold">17</span>
              </>
            ) : (
              day ?? ""
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function EnvelopeExperience() {
  const envelopeRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLImageElement>(null);
  const topRef = useRef<HTMLImageElement>(null);
  const bottomRef = useRef<HTMLImageElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inviteRef = useRef<HTMLDivElement>(null);
  const scrollBtnRef = useRef<HTMLButtonElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const leftPillarRef = useRef<HTMLDivElement>(null);
  const rightPillarRef = useRef<HTMLDivElement>(null);
  const section2CopyRef = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLElement>(null);
  const section3CopyRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => {
      video.pause();
      document.documentElement.classList.remove("lock-scroll");
      document.body.classList.remove("lock-scroll");
      if (inviteRef.current) {
        gsap.to(inviteRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.6,
          ease: "power1.out",
        });
      }
      if (scrollBtnRef.current) {
        gsap.to(scrollBtnRef.current, {
          opacity: 1,
          duration: 1.6,
          ease: "power1.out",
        });
      }
    };

    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    const section = section2Ref.current;
    const left = leftPillarRef.current;
    const right = rightPillarRef.current;
    const copy = section2CopyRef.current;
    if (!section || !left || !right || !copy) return;

    const lines = copy.querySelectorAll("[data-copy]");
    gsap.set(left, { xPercent: -100 });
    gsap.set(right, { xPercent: 100 });
    gsap.set(lines, { opacity: 0, y: 28 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(left, { xPercent: 0, duration: 1.5, ease: "power3.out" });
        gsap.to(right, { xPercent: 0, duration: 1.5, ease: "power3.out" });
        gsap.to(lines, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.14,
          delay: 0.25,
          ease: "power2.out",
        });
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = section3Ref.current;
    const copy = section3CopyRef.current;
    if (!section || !copy) return;

    const lines = copy.querySelectorAll("[data-copy]");
    const flowers = section.querySelectorAll("[data-flower]");
    gsap.set(lines, { opacity: 0, y: 28 });
    gsap.set(flowers, { opacity: 0, y: -24 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(flowers, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "power2.out",
        });
        gsap.to(lines, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          delay: 0.2,
          ease: "power2.out",
        });
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function openEnvelope() {
    if (openedRef.current) return;
    openedRef.current = true;

    const envelope = envelopeRef.current;
    const fill = fillRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    const hint = hintRef.current;
    const video = videoRef.current;

    if (!envelope || !top || !bottom) return;

    void video?.play();

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        gsap.set(envelope, { autoAlpha: 0, pointerEvents: "none" });
      },
    });

    tl.to(fill, { opacity: 0, duration: 2, ease: "none" }, 0);
    tl.to(hint, { opacity: 0, duration: 0.3, ease: "power1.out" }, 0);

    tl.to(
      top,
      {
        yPercent: -120,
        duration: 3,
        ease: "power2.inOut",
      },
      0,
    );

    tl.to(
      bottom,
      {
        yPercent: 120,
        duration: 3,
        ease: "power2.inOut",
      },
      0,
    );
  }

  function scrollDown() {
    document.getElementById("section-2")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <>
      <div className="relative mx-auto h-screen w-full max-w-md overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src="/after-envople-video.mp4"
          playsInline
          preload="auto"
        >
          Your browser does not support the video tag.
        </video>

        <div
          ref={inviteRef}
          className="pointer-events-none absolute inset-x-0 top-[20%] z-[5] flex translate-y-6 flex-col items-center opacity-0"
        >
          <img
            src="/Bismillah.webp"
            alt=""
            className="ml-4 h-[38vw] max-h-44 max-w-40 rounded-full object-contain"
          />
        </div>

        <button
          ref={scrollBtnRef}
          type="button"
          aria-label="Scroll down"
          onClick={scrollDown}
          className="absolute bottom-5 left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-0.5 border-0 bg-transparent opacity-0"
        >
          <span className="font-primary text-2xl text-maroon">Scroll down</span>
          <span className="animate-bounce text-2xl leading-none text-maroon">
            ↓
          </span>
        </button>

        <div ref={envelopeRef} className="absolute inset-0 z-10">
          <button
            type="button"
            aria-label="Open invitation"
            className="absolute inset-0 z-30 cursor-pointer border-0 bg-transparent"
            onClick={openEnvelope}
          />

          <img
            ref={fillRef}
            src="/fill.webp"
            alt=""
            className="absolute inset-0 z-0 h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 top-0 z-10">
            <img
              ref={topRef}
              src="/envolpe-top.webp"
              alt=""
              className="relative z-20 block w-full will-change-transform"
            />
            <img
              ref={bottomRef}
              src="/envolpe-bottom.webp"
              alt=""
              className="relative z-10 -mt-[24%] block w-full will-change-transform"
            />
          </div>

          <p
            ref={hintRef}
            className="pointer-events-none absolute inset-x-0 top-[72%] z-40 text-center text-3xl text-white"
          >
            Tap to open
          </p>
        </div>
      </div>
      <section
        id="section-2"
        ref={section2Ref}
        className="relative mx-auto h-screen w-full max-w-md overflow-hidden"
      >
        <img
          src="/scene-two-bg.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          ref={leftPillarRef}
          className="absolute inset-y-0 left-0 z-10 h-full w-[18%] overflow-hidden"
        >
          <img
            src="/sidepillars.webp"
            alt=""
            className="h-full w-full object-cover object-right"
          />
        </div>
        <div
          ref={rightPillarRef}
          className="absolute inset-y-0 right-0 z-10 h-full w-[18%] overflow-hidden"
        >
          <img
            src="/sidepillars.webp"
            alt=""
            className="h-full w-full origin-center object-cover object-right scale-x-[-1]"
          />
        </div>
        <div
          ref={section2CopyRef}
          className="absolute inset-x-[16%] top-24 z-20 flex flex-col items-center text-center"
        >
          <p
            data-copy
            className="font-sans text-[12px] font-semibold uppercase leading-relaxed text-maroon"
          >
            Mr &amp; Mrs. Mansoor Ul Hassan Request
            <br />
            the honour of your presence at the
          </p>
          <h1
            data-copy
            className="mt-4 font-primary text-4xl font-medium leading-none text-maroon"
          >
            Nikkah Ceremony
          </h1>
          <p
            data-copy
            className="mt-2 font-sans text-[12px] font-semibold uppercase leading-relaxed text-maroon"
          >
            Of their beloved son
          </p>
          <h1
            data-copy
            className="mt-3 font-primary text-4xl font-medium leading-none text-maroon"
          >
            Aryan Ul Hassan
          </h1>
          <p
            data-copy
            className="mt-2 font-sans text-[14px] font-semibold uppercase leading-relaxed text-maroon"
          >
            With
          </p>
          <h1
            data-copy
            className="mt-3 font-primary text-4xl font-medium leading-none text-maroon"
          >
            Laiba Baig
          </h1>
          <p
            data-copy
            className="mt-2 font-sans text-[12px] font-semibold uppercase leading-relaxed text-maroon"
          >
            Daughter of
            Mr &amp; Mrs Azhar Baig
          </p>
        </div>
      </section>
      <section
        id="section-3"
        ref={section3Ref}
        className="relative mx-auto h-screen w-full max-w-md overflow-hidden"
      >
        <img
          src="/scene-two-bg.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          data-flower
          src="/flowers-2.webp"
          alt=""
          className="absolute top-0 left-0 z-10 w-[42%] max-w-[180px]"
        />
        <img
          data-flower
          src="/flowers-2.webp"
          alt=""
          className="absolute top-0 right-0 z-10 w-[42%] max-w-[180px] scale-x-[-1]"
        />
        <div
          ref={section3CopyRef}
          className="absolute inset-x-[10%] top-[22%] z-20 flex flex-col items-center text-center"
        >
          <h1
            data-copy
            className="font-primary text-5xl leading-none text-maroon"
          >
            Save the Date
          </h1>
          <p
            data-copy
            className="mt-2 font-sans text-sm font-semibold tracking-[0.28em] text-maroon uppercase"
          >
            October 2026
          </p>
          <div data-copy>
            <OctoberCalendar />
          </div>
        </div>
      </section>
    </>
  );
}
