"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { CalendarDays, Clock, MapPin } from "lucide-react";

const OCTOBER_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function DetailIcon({ children }: { children: ReactNode }) {
  return (
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon">
      {children}
    </span>
  );
}

function OctoberCalendar() {
  const firstWeekday = 4;
  const cells: Array<number | null> = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: 31 }, (_, i) => i + 1),
  ];

  return (
    <div className="mt-5 w-full max-w-[340px] overflow-visible rounded-2xl bg-[#fff8f0]/90 px-3 py-4 shadow-[0_8px_30px_rgba(17,17,17,0.18)] ring-1 ring-black/20 backdrop-blur-sm">
      <div className="grid grid-cols-7 gap-y-2 text-center font-sans text-[10px] font-bold uppercase tracking-wide text-maroon">
        {OCTOBER_WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-y-1.5 overflow-visible text-center font-sans text-[15px] font-semibold text-maroon">
        {cells.map((day, i) => (
          <span
            key={`${day ?? "e"}-${i}`}
            className="relative flex h-10 items-center justify-center overflow-visible"
          >
            {day === 17 ? (
              <span
                data-heart
                className="relative z-10 flex h-11 w-11 items-center justify-center overflow-visible"
              >
                <svg
                  viewBox="0 0 32 32"
                  className="absolute h-12 w-12 overflow-visible"
                  aria-hidden
                >
                  <path
                    d="M16 27.6 14.07 25.84C8.53 21.12 4 17.2 4 12.33 4 8.36 6.56 6 10.67 6c2.32 0 4.28 1.08 5.33 2.76C17.05 7.08 19.24 6 21.33 6 25.44 6 28 8.36 28 12.33c0 4.87-4.53 8.79-10.07 13.51Z"
                    fill="#e8e2d6"
                    stroke="#111111"
                    strokeWidth="1.15"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="relative z-10 font-sans text-[13px] font-bold leading-none text-maroon">
                  17
                </span>
              </span>
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
  const section4Ref = useRef<HTMLElement>(null);
  const section4CopyRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLElement>(null);
  const section5CopyRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(false);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => {
      video.pause();
      document.documentElement.classList.remove("lock-scroll");
      document.body.classList.remove("lock-scroll");
      setCanScroll(true);
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
    const blockScroll = (event: Event) => {
      if (!document.body.classList.contains("lock-scroll")) return;
      event.preventDefault();
    };

    const blockKeys = (event: KeyboardEvent) => {
      if (!document.body.classList.contains("lock-scroll")) return;
      const keys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
        "Spacebar",
      ];
      if (keys.includes(event.key)) event.preventDefault();
    };

    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("keydown", blockKeys);
    return () => {
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", blockKeys);
    };
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
        window.setTimeout(() => {
          section.querySelector("[data-heart]")?.classList.add("heart-highlight");
        }, 450);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = section4Ref.current;
    const copy = section4CopyRef.current;
    const left = leftSideRef.current;
    const right = rightSideRef.current;
    if (!section || !copy || !left || !right) return;

    const lines = copy.querySelectorAll("[data-copy]");
    const topDrape = section.querySelector("[data-forth-top]");
    const ornament = section.querySelector("[data-forth-ornament]");
    gsap.set(left, { xPercent: -40 });
    gsap.set(right, { xPercent: 40 });
    gsap.set(topDrape, { yPercent: -20, opacity: 0 });
    gsap.set(copy, { opacity: 0 });
    gsap.set(lines, { opacity: 0, y: 18 });
    gsap.set(ornament, { opacity: 0, y: -16, scale: 0.72 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(topDrape, {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        });
        gsap.to(left, {
          xPercent: 0,
          duration: 1.3,
          ease: "power3.out",
        });
        gsap.to(right, {
          xPercent: 0,
          duration: 1.3,
          ease: "power3.out",
        });
        gsap.to(copy, {
          opacity: 1,
          duration: 0.9,
          delay: 0.15,
          ease: "power2.out",
        });
        gsap.to(lines, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          delay: 0.28,
          ease: "power2.out",
        });
        gsap.to(ornament, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          delay: 0.35,
          ease: "back.out(1.6)",
        });
        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = section5Ref.current;
    const copy = section5CopyRef.current;
    if (!section || !copy) return;

    const lines = copy.querySelectorAll("[data-copy]");
    gsap.set(lines, { opacity: 0, y: 20 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(lines, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.18,
          ease: "power2.out",
        });
        observer.disconnect();
      },
      { threshold: 0.3 },
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
    <div className={canScroll ? undefined : "h-screen overflow-hidden"}>
      <div className="relative mx-auto h-screen w-full max-w-md overflow-hidden border-b border-black bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src="/new%20first%20video.mp4"
          playsInline
          preload="auto"
        >
          Your browser does not support the video tag.
        </video>

        <div
          ref={inviteRef}
          className="pointer-events-none absolute inset-x-0 top-[29%] z-[5] flex translate-y-6 flex-col items-center opacity-0"
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
          <span className="font-primary text-2xl text-black">Scroll down</span>
          <span className="animate-bounce text-2xl leading-none text-black">
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
            src="/fill-new.webp"
            alt=""
            className="absolute inset-0 z-0 h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 top-0 z-10">
            <img
              ref={topRef}
              src="/envolpe-top-new.webp"
              alt=""
              className="relative z-20 block w-full will-change-transform"
            />
            <img
              ref={bottomRef}
              src="/envolope-bottom-new.webp"
              alt=""
              className="relative z-10 -mt-[24%] block w-full will-change-transform"
            />
          </div>

          <p
            ref={hintRef}
            className="pointer-events-none absolute inset-x-0 top-[72%] z-40 text-center text-3xl text-black"
          >
            Tap to open
          </p>
        </div>
      </div>
      <section
        id="section-2"
        ref={section2Ref}
        className="relative mx-auto h-screen w-full max-w-md overflow-hidden border-b border-black"
      >
        <img
          src="/scene-two-new-bg.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          ref={section2CopyRef}
          className="absolute inset-x-[16%] top-40 z-20 flex flex-col items-center text-center"
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
        className="relative mx-auto h-screen w-full max-w-md overflow-hidden border-b border-black"
      >
        <img
          src="/scene-three-new-bg.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          ref={section3CopyRef}
          className="absolute inset-x-[10%] top-[25%] z-20 flex flex-col items-center text-center"
        >
          <h1
            data-copy
            className="font-primary text-5xl leading-none text-maroon drop-shadow-[0_2px_8px_rgba(255,248,240,0.9)]"
          >
            Save the Date
          </h1>
          <p
            data-copy
            className="mt-2 font-sans text-sm font-semibold tracking-[0.28em] text-maroon uppercase drop-shadow-[0_1px_6px_rgba(255,248,240,0.9)]"
          >
            October 2026
          </p>
          <div data-copy>
            <OctoberCalendar />
          </div>
        </div>
      </section>
      <section
        id="section-4"
        ref={section4Ref}
        className="relative mx-auto h-screen w-full max-w-md overflow-hidden border-b border-black"
      >
        <img
          src="/scene-four-new-bg.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          ref={section4CopyRef}
          className="absolute inset-0 z-30 flex items-center justify-center px-[18%]"
        >
          <div className="relative w-full overflow-visible">
            <div className="">
              <h2
                data-copy
                className="text-center font-primary text-[42px] leading-none text-maroon"
              >
                In Sha Allah
              </h2>
              <div className="mx-auto mt-5 flex w-full flex-col gap-3">
                <div data-copy className="flex items-center gap-2.5 text-left">
                  <DetailIcon>
                    <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
                  </DetailIcon>
                  <p className="font-sans text-[13px] font-semibold leading-snug text-maroon">
                    Saturday, 17 October 2026
                  </p>
                </div>
                <div data-copy className="flex items-center gap-2.5 text-left">
                  <DetailIcon>
                    <Clock className="h-4 w-4" strokeWidth={1.75} />
                  </DetailIcon>
                  <p className="font-sans text-[13px] font-semibold leading-snug text-maroon">
                    8:00 pm
                  </p>
                </div>
                <div data-copy className="flex items-center gap-2.5 text-left">
                  <DetailIcon>
                    <MapPin className="h-4 w-4" strokeWidth={1.75} />
                  </DetailIcon>
                  <p className="font-sans text-[13px] font-semibold leading-snug text-maroon">
                    Empire Banquet
                    Latifabad Unit 7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="section-5"
        ref={section5Ref}
        className="relative mx-auto h-screen w-full max-w-md overflow-hidden"
      >
        <img
          src="/fifth final.jpg"
          alt=""
          className="absolute inset-0 h-full w-full"
        />
        <div
          ref={section5CopyRef}
          className="absolute inset-x-0 top-20 z-10 flex flex-col items-center px-6"
        >
          <img
            data-copy
            src="/last-scene.webp"
            alt="Barakallahu lakuma"
            className="w-full max-w-[340px] object-contain"
          />
          <p
            data-copy
            className="mt-3 max-w-[320px] text-center font-sans text-[12px] font-medium leading-relaxed text-maroon"
          >
            May Allah bless you and shower His blessings upon you and join you
            together in goodness
          </p>
        </div>
      </section>
    </div>
  );
}
