import { useGSAP } from "@gsap/react";
import { animateWithGsap } from "../utils/animation";
import { explore1Img, explore2Img, exploreVideo } from "../utils";
import { useRef } from "react";

export default function Features() {
  const exploreVideoRef = useRef(null);
  useGSAP(() => {
    animateWithGsap("#exploreVideo");

    animateWithGsap("#feature-title", {
      opacity: 1,
      y: 0,
    });

    animateWithGsap(
      ".g_group",
      {
        scale: 1,
        opacity: 1,
        ease: "power1",
      },
      { scrub: 5.5 }
    );

    animateWithGsap(".g_text", {
      opacity: 1,
      y: 0,
      ease: "power1",
      duration: 1,
      stagger: 0.2,
    });
  }, []);

  return (
    <section className="h-full common-padding bg-zinc relative overflow-hidden">
      <div className="screen-max-width ">
        <div className="mb-12 w-full">
          <h1 id="feature-title" className="section-heading">
            Explore the full story
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="mt-32 mb-24 pl-24">
            <h2 className="text-white text-5xl lg:text-7xl font-semi-bold">
              IPhone.
            </h2>
            <h2 className="text-white text-5xl lg:text-7xl font-semi-bold">
              Forged in titanium
            </h2>
          </div>
          <div className="flex-center flex-col sm:px-10">
            <div className="relative h-[50nh] w-full flex items-center">
              <video
                playsInline
                id="exploreVideo"
                className="w-full h-full object-cover object-center"
                preload="none"
                muted
                autoPlay
                ref={exploreVideoRef}
              >
                <source src={exploreVideo} type="video/mp4" />
              </video>
            </div>
            <div className="flex flex-col w-full relative">
              <div className="feature-video-container">
                <div className="overflow-hidden flex-1 h-[50vh]">
                  <img
                    src={explore1Img}
                    alt="titanium"
                    className="feature-video g_group"
                  />
                </div>
                <div className="overflow-hidden flex-1 h-[50vh]">
                  <img
                    src={explore2Img}
                    alt="titanium 2"
                    className="feature-video g_group"
                  />
                </div>
              </div>
              <div className="feature-text-container">
                <div className="flex-1 flex-center">
                  <p className="feature-text g_text text-white">
                    The Titanium body is{" "}
                    <span className="text-white font-bold">
                      forged in a single piece, using a process that combines
                      100% recycled titanium
                    </span>
                    with a proprietary alloy.
                    <br />
                    <br />
                    The Titanium body is forged in a single piece,
                    <span className="text-white font-bold">
                      using a process that combines 100% recycled titanium with
                      a proprietary alloy
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
