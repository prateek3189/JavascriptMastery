import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "../utils";
import { useState, useEffect } from "react";

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(
    window.innerWidth > 768 ? heroVideo : smallHeroVideo
  );

  const handleVideoSrc = () => {
    setVideoSrc(window.innerWidth > 768 ? heroVideo : smallHeroVideo);
  };

  useEffect(() => {
    window.addEventListener("resize", handleVideoSrc);
    return () => {
      window.removeEventListener("resize", handleVideoSrc);
    };
  }, []);

  useGSAP(() => {
    gsap.to(".hero-title", {
      opacity: 1,
      delay: 2,
    });

    gsap.to("#cta", {
      opacity: 1,
      y: -50,
      delay: 2,
    });
  }, []);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p className="hero-title">iPhone 15 Pro</p>
        <div className="md:w-10/12 w-9/12">
          <video
            autoPlay
            muted
            playsInline="true"
            key={videoSrc}
            className="pointer-events-none"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>
      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20"
      >
        <a href="#highlights" className="btn">
          Buy
        </a>
        <p className="font-normal text-xl">From $199/mo. or $999</p>
      </div>
    </section>
  );
};

export default Hero;
