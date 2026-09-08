"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function EnvelopeExperience() {
  const envelopeRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const openedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => {
      video.pause();
    };

    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, []);

  function openEnvelope() {
    if (openedRef.current) return;
    openedRef.current = true;

    const envelope = envelopeRef.current;
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

    tl.to(hint, { opacity: 0, duration: 0.2, ease: "power1.out" }, 0);

    tl.to(
      top,
      {
        rotateX: -118,
        yPercent: -130,
        duration: 1.35,
        ease: "power3.inOut",
        transformOrigin: "50% 100%",
      },
      0,
    );

    tl.to(
      bottom,
      {
        yPercent: 120,
        duration: 1.75,
        ease: "power2.in",
      },
      0.18,
    );

    tl.to(envelope, { backgroundColor: "rgba(152, 32, 21, 0)", duration: 0.8 }, 0.45);
  }

  return (
    <div className="relative mx-auto h-dvh w-full max-w-md overflow-hidden bg-maroon">
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
        ref={envelopeRef}
        className="absolute inset-0 z-10 bg-maroon"
        style={{ perspective: "1200px" }}
      >
        <button
          type="button"
          aria-label="Open invitation"
          className="absolute inset-0 z-30 cursor-pointer border-0 bg-transparent"
          onClick={openEnvelope}
        />

        <div className="absolute inset-x-0 top-0">
          <div
            ref={topRef}
            className="relative z-20 w-full will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Image
              src="/envolpe-top.png"
              alt="Envelope flap"
              width={941}
              height={1093}
              sizes="(max-width: 448px) 100vw, 448px"
              className="h-auto w-full"
              priority
              unoptimized
            />
          </div>

          <div
            ref={bottomRef}
            className="relative z-10 -mt-[34%] w-full will-change-transform"
          >
            <Image
              src="/envolpe-bottom.png"
              alt="Envelope"
              width={941}
              height={396}
              sizes="(max-width: 448px) 100vw, 448px"
              className="h-auto w-full"
              priority
              unoptimized
            />
          </div>
        </div>

        <p
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 top-[58%] z-40 text-center text-3xl text-white"
        >
          Tap to open
        </p>
      </div>
    </div>
  );
}
