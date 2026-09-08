"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function EnvelopeExperience() {
  const envelopeRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLImageElement>(null);
  const topRef = useRef<HTMLImageElement>(null);
  const bottomRef = useRef<HTMLImageElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inviteRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => {
      video.pause();
      if (inviteRef.current) {
        gsap.to(inviteRef.current, {
          opacity: 1,
          duration: 1.6,
          ease: "power1.out",
        });
      }
    };

    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
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

  return (
    <div className="relative mx-auto h-dvh w-full max-w-md overflow-hidden bg-black">
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
        className="pointer-events-none absolute inset-x-[12%] top-[14%] z-[5] text-center opacity-0"
      >
        <p className="font-sans text-[10px] font-medium tracking-[0.18em] text-maroon uppercase">
          Mr &amp; Mrs. Mansoor Ul Hassan
        </p>
        <p className="mt-2 font-sans text-[9px] font-normal tracking-[0.12em] text-black/70 uppercase">
          Request the honour of your presence at the
        </p>
        <h2 className="mt-1 font-primary text-[2.15rem] leading-none text-maroon">
          Nikkah Ceremony
        </h2>
        <p className="mt-1 font-sans text-[9px] tracking-[0.14em] text-black/70 uppercase">
          of their beloved son
        </p>
        <h1 className="mt-1 font-primary text-[2.35rem] leading-none text-maroon">
          Aryan Ul Hassan
        </h1>
        <p className="mt-1 font-sans text-[9px] tracking-[0.2em] text-black/60 uppercase">
          With
        </p>
        <h1 className="font-primary text-[2.35rem] leading-none text-maroon">
          Laiba Baig
        </h1>
        <p className="mt-1 font-sans text-[9px] tracking-[0.1em] text-black/70 uppercase">
          Daughter of Mr. &amp; Mrs. Azhar Baig
        </p>
        <div className="mx-auto mt-3 h-px w-16 bg-maroon/40" />
        <p className="mt-3 font-sans text-[10px] font-medium tracking-[0.12em] text-maroon uppercase">
          InshaAllah Saturday, 17 October 2026
        </p>
        <p className="mt-1 font-sans text-[11px] tracking-[0.16em] text-black/80">
          8:00pm
        </p>
        <p className="mt-2 font-sans text-[9px] leading-relaxed tracking-[0.08em] text-black/70 uppercase">
          Empire Banquet
          <br />
          Latifabad Unit 7, Latifabad
        </p>
      </div>

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
            className="relative z-10 -mt-[42%] block w-full will-change-transform"
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
  );
}
