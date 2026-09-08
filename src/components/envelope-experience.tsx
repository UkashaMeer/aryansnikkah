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
        className="pointer-events-none absolute inset-x-0 top-[25%] z-[5] flex flex-col items-center opacity-0"
      >
        <img
          src="/flower.webp"
          alt=""
          className="h-[38vw] max-h-44 w-[30vw] max-w-44 rounded-full object-contain animate-[spin_22s_linear_infinite]"
        />
        <p className="mt-18 font-sans text-[14px] leading-none text-maroon text-center uppercase leading-relaxed">
          Mr & Mrs. Mansoor Ul Hassan
        </p>
        <h1 className="mt-2 font-primary text-5xl leading-none text-maroon">
          Aryan &amp; Laiba
        </h1>
        <p className="mt-2 font-sans text-[14px] leading-none text-maroon text-center uppercase leading-relaxed">
          Request the honour of your presence        <br /> at the

          Nikkah Ceremony
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
            className="relative z-10 -mt-[28%] block w-full will-change-transform"
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
