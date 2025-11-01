import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Set default animation settings
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8
});

export { gsap, ScrollTrigger };