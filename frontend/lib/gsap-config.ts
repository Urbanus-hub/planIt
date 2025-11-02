import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Set default animation settings - faster for better UX
gsap.defaults({
  ease: "power2.out",
  duration: 0.4,
});

export { gsap, ScrollTrigger };
