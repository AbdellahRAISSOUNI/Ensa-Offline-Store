import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollTrigger } from '../hooks/useGSAP';

// Parallax configuration types
export interface ParallaxElement {
  target: gsap.TweenTarget;
  speed: number;
  direction: 'vertical' | 'horizontal' | 'diagonal';
  offset?: number;
  easing?: string;
}

export interface ParallaxConfig {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  onUpdate?: (progress: number) => void;
  onEnter?: () => void;
  onLeave?: () => void;
}

// Parallax speed presets
export const PARALLAX_SPEEDS = {
  subtle: 0.2,
  slow: 0.5,
  normal: 1,
  fast: 1.5,
  extreme: 2,
  ultra: 3,
};

// Parallax directions
export const PARALLAX_DIRECTIONS = {
  vertical: { x: 0, y: 1 },
  horizontal: { x: 1, y: 0 },
  diagonal: { x: 1, y: 1 },
  diagonalReverse: { x: -1, y: 1 },
};

// Premium parallax effects
export class ParallaxManager {
  private static instance: ParallaxManager;
  private activeParallax: Map<string, ScrollTrigger> = new Map();
  private parallaxElements: ParallaxElement[] = [];
  private isEnabled: boolean = true;

  private constructor() {
    this.setupPerformanceOptimizations();
  }

  static getInstance(): ParallaxManager {
    if (!ParallaxManager.instance) {
      ParallaxManager.instance = new ParallaxManager();
    }
    return ParallaxManager.instance;
  }

  private setupPerformanceOptimizations() {
    // Disable parallax on low-end devices
    if (typeof window !== 'undefined') {
      const isLowEnd = navigator.hardwareConcurrency <= 2 || (navigator as any).deviceMemory <= 2;
      if (isLowEnd) {
        this.isEnabled = false;
      }
    }
  }

  // Create basic parallax effect
  createParallax(
    target: gsap.TweenTarget,
    speed: number = PARALLAX_SPEEDS.normal,
    direction: 'vertical' | 'horizontal' | 'diagonal' = 'vertical',
    config: ParallaxConfig = {}
  ): ScrollTrigger {
    if (!this.isEnabled) {
      return ScrollTrigger.create({ trigger: target, animation: gsap.set(target, {}) });
    }

    const directionVector = PARALLAX_DIRECTIONS[direction];
    const multiplier = speed * 100;

    const animation = gsap.to(target, {
      x: directionVector.x * multiplier,
      y: directionVector.y * multiplier,
      ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: config.start || 'top bottom',
        end: config.end || 'bottom top',
        scrub: config.scrub !== undefined ? config.scrub : 1,
        pin: config.pin || false,
        markers: config.markers || false,
        onUpdate: config.onUpdate,
        onEnter: config.onEnter,
        onLeave: config.onLeave,
      },
    });

    const scrollTrigger = animation.scrollTrigger;
    if (scrollTrigger) {
      this.activeParallax.set(`parallax-${Date.now()}`, scrollTrigger);
    }

    return scrollTrigger!;
  }

  // Create multi-layer parallax effect
  createMultiLayerParallax(
    layers: Array<{
      target: gsap.TweenTarget;
      speed: number;
      direction?: 'vertical' | 'horizontal' | 'diagonal';
      offset?: number;
    }>,
    config: ParallaxConfig = {}
  ): ScrollTrigger[] {
    if (!this.isEnabled) {
      return layers.map(layer => 
        ScrollTrigger.create({ trigger: layer.target, animation: gsap.set(layer.target, {}) })
      );
    }

    const triggers: ScrollTrigger[] = [];

    layers.forEach((layer, index) => {
      const directionVector = PARALLAX_DIRECTIONS[layer.direction || 'vertical'];
      const multiplier = layer.speed * 100;
      const offset = layer.offset || 0;

      const animation = gsap.to(layer.target, {
        x: directionVector.x * multiplier + offset,
        y: directionVector.y * multiplier + offset,
        ease: 'none',
        scrollTrigger: {
          trigger: layer.target,
          start: config.start || 'top bottom',
          end: config.end || 'bottom top',
          scrub: config.scrub !== undefined ? config.scrub : 1,
          pin: config.pin || false,
          markers: config.markers || false,
          onUpdate: config.onUpdate,
          onEnter: config.onEnter,
          onLeave: config.onLeave,
        },
      });

      const scrollTrigger = animation.scrollTrigger;
      if (scrollTrigger) {
        triggers.push(scrollTrigger);
        this.activeParallax.set(`multilayer-${index}-${Date.now()}`, scrollTrigger);
      }
    });

    return triggers;
  }

  // Create reveal parallax effect
  createRevealParallax(
    target: gsap.TweenTarget,
    revealDirection: 'up' | 'down' | 'left' | 'right' = 'up',
    config: ParallaxConfig = {}
  ): ScrollTrigger {
    if (!this.isEnabled) {
      return ScrollTrigger.create({ trigger: target, animation: gsap.set(target, {}) });
    }

    const revealProps = {
      up: { y: 100, opacity: 0 },
      down: { y: -100, opacity: 0 },
      left: { x: 100, opacity: 0 },
      right: { x: -100, opacity: 0 },
    };

    const animation = gsap.fromTo(target, 
      revealProps[revealDirection],
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: target,
          start: config.start || 'top 80%',
          end: config.end || 'bottom 20%',
          scrub: config.scrub !== undefined ? config.scrub : false,
          pin: config.pin || false,
          markers: config.markers || false,
          onUpdate: config.onUpdate,
          onEnter: config.onEnter,
          onLeave: config.onLeave,
        },
      }
    );

    const scrollTrigger = animation.scrollTrigger;
    if (scrollTrigger) {
      this.activeParallax.set(`reveal-${Date.now()}`, scrollTrigger);
    }

    return scrollTrigger!;
  }

  // Create scale parallax effect
  createScaleParallax(
    target: gsap.TweenTarget,
    scaleRange: [number, number] = [0.8, 1.2],
    config: ParallaxConfig = {}
  ): ScrollTrigger {
    if (!this.isEnabled) {
      return ScrollTrigger.create({ trigger: target, animation: gsap.set(target, {}) });
    }

    const animation = gsap.fromTo(target,
      { scale: scaleRange[0] },
      {
        scale: scaleRange[1],
        ease: 'none',
        scrollTrigger: {
          trigger: target,
          start: config.start || 'top bottom',
          end: config.end || 'bottom top',
          scrub: config.scrub !== undefined ? config.scrub : 1,
          pin: config.pin || false,
          markers: config.markers || false,
          onUpdate: config.onUpdate,
          onEnter: config.onEnter,
          onLeave: config.onLeave,
        },
      }
    );

    const scrollTrigger = animation.scrollTrigger;
    if (scrollTrigger) {
      this.activeParallax.set(`scale-${Date.now()}`, scrollTrigger);
    }

    return scrollTrigger!;
  }

  // Create rotation parallax effect
  createRotationParallax(
    target: gsap.TweenTarget,
    rotationRange: [number, number] = [-10, 10],
    config: ParallaxConfig = {}
  ): ScrollTrigger {
    if (!this.isEnabled) {
      return ScrollTrigger.create({ trigger: target, animation: gsap.set(target, {}) });
    }

    const animation = gsap.fromTo(target,
      { rotation: rotationRange[0] },
      {
        rotation: rotationRange[1],
        ease: 'none',
        scrollTrigger: {
          trigger: target,
          start: config.start || 'top bottom',
          end: config.end || 'bottom top',
          scrub: config.scrub !== undefined ? config.scrub : 1,
          pin: config.pin || false,
          markers: config.markers || false,
          onUpdate: config.onUpdate,
          onEnter: config.onEnter,
          onLeave: config.onLeave,
        },
      }
    );

    const scrollTrigger = animation.scrollTrigger;
    if (scrollTrigger) {
      this.activeParallax.set(`rotation-${Date.now()}`, scrollTrigger);
    }

    return scrollTrigger!;
  }

  // Create skew parallax effect
  createSkewParallax(
    target: gsap.TweenTarget,
    skewRange: [number, number] = [-5, 5],
    config: ParallaxConfig = {}
  ): ScrollTrigger {
    if (!this.isEnabled) {
      return ScrollTrigger.create({ trigger: target, animation: gsap.set(target, {}) });
    }

    const animation = gsap.fromTo(target,
      { skewX: skewRange[0] },
      {
        skewX: skewRange[1],
        ease: 'none',
        scrollTrigger: {
          trigger: target,
          start: config.start || 'top bottom',
          end: config.end || 'bottom top',
          scrub: config.scrub !== undefined ? config.scrub : 1,
          pin: config.pin || false,
          markers: config.markers || false,
          onUpdate: config.onUpdate,
          onEnter: config.onEnter,
          onLeave: config.onLeave,
        },
      }
    );

    const scrollTrigger = animation.scrollTrigger;
    if (scrollTrigger) {
      this.activeParallax.set(`skew-${Date.now()}`, scrollTrigger);
    }

    return scrollTrigger!;
  }

  // Create brutalist parallax effect (for ENSA OFFLINE theme)
  createBrutalistParallax(
    target: gsap.TweenTarget,
    intensity: 'subtle' | 'normal' | 'extreme' = 'normal',
    config: ParallaxConfig = {}
  ): ScrollTrigger {
    if (!this.isEnabled) {
      return ScrollTrigger.create({ trigger: target, animation: gsap.set(target, {}) });
    }

    const intensityMultipliers = {
      subtle: { x: 50, y: 30, rotation: 2, skew: 1 },
      normal: { x: 100, y: 60, rotation: 5, skew: 3 },
      extreme: { x: 200, y: 120, rotation: 10, skew: 6 },
    };

    const multiplier = intensityMultipliers[intensity];

    const animation = gsap.to(target, {
      x: multiplier.x,
      y: multiplier.y,
      rotation: multiplier.rotation,
      skewX: multiplier.skew,
      ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: config.start || 'top bottom',
        end: config.end || 'bottom top',
        scrub: config.scrub !== undefined ? config.scrub : 1,
        pin: config.pin || false,
        markers: config.markers || false,
        onUpdate: config.onUpdate,
        onEnter: config.onEnter,
        onLeave: config.onLeave,
      },
    });

    const scrollTrigger = animation.scrollTrigger;
    if (scrollTrigger) {
      this.activeParallax.set(`brutalist-${Date.now()}`, scrollTrigger);
    }

    return scrollTrigger!;
  }

  // Create text parallax effect
  createTextParallax(
    target: gsap.TweenTarget,
    textSpeed: number = PARALLAX_SPEEDS.normal,
    config: ParallaxConfig = {}
  ): ScrollTrigger {
    if (!this.isEnabled) {
      return ScrollTrigger.create({ trigger: target, animation: gsap.set(target, {}) });
    }

    const animation = gsap.to(target, {
      y: textSpeed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: config.start || 'top bottom',
        end: config.end || 'bottom top',
        scrub: config.scrub !== undefined ? config.scrub : 1,
        pin: config.pin || false,
        markers: config.markers || false,
        onUpdate: config.onUpdate,
        onEnter: config.onEnter,
        onLeave: config.onLeave,
      },
    });

    const scrollTrigger = animation.scrollTrigger;
    if (scrollTrigger) {
      this.activeParallax.set(`text-${Date.now()}`, scrollTrigger);
    }

    return scrollTrigger!;
  }

  // Create image parallax effect
  createImageParallax(
    target: gsap.TweenTarget,
    imageSpeed: number = PARALLAX_SPEEDS.slow,
    config: ParallaxConfig = {}
  ): ScrollTrigger {
    if (!this.isEnabled) {
      return ScrollTrigger.create({ trigger: target, animation: gsap.set(target, {}) });
    }

    const animation = gsap.to(target, {
      y: imageSpeed * 100,
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: config.start || 'top bottom',
        end: config.end || 'bottom top',
        scrub: config.scrub !== undefined ? config.scrub : 1,
        pin: config.pin || false,
        markers: config.markers || false,
        onUpdate: config.onUpdate,
        onEnter: config.onEnter,
        onLeave: config.onLeave,
      },
    });

    const scrollTrigger = animation.scrollTrigger;
    if (scrollTrigger) {
      this.activeParallax.set(`image-${Date.now()}`, scrollTrigger);
    }

    return scrollTrigger!;
  }

  // Cleanup all parallax effects
  cleanup() {
    this.activeParallax.forEach(trigger => trigger.kill());
    this.activeParallax.clear();
  }

  // Refresh all parallax effects
  refresh() {
    ScrollTrigger.refresh();
  }

  // Enable/disable parallax
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.cleanup();
    }
  }

  // Get active parallax count
  getActiveCount(): number {
    return this.activeParallax.size;
  }
}

// Custom hook for parallax effects
export const useParallax = () => {
  const parallaxManager = ParallaxManager.getInstance();

  return {
    createParallax: (
      target: gsap.TweenTarget,
      speed?: number,
      direction?: 'vertical' | 'horizontal' | 'diagonal',
      config?: ParallaxConfig
    ) => parallaxManager.createParallax(target, speed, direction, config),

    createMultiLayerParallax: (
      layers: Array<{
        target: gsap.TweenTarget;
        speed: number;
        direction?: 'vertical' | 'horizontal' | 'diagonal';
        offset?: number;
      }>,
      config?: ParallaxConfig
    ) => parallaxManager.createMultiLayerParallax(layers, config),

    createRevealParallax: (
      target: gsap.TweenTarget,
      revealDirection?: 'up' | 'down' | 'left' | 'right',
      config?: ParallaxConfig
    ) => parallaxManager.createRevealParallax(target, revealDirection, config),

    createScaleParallax: (
      target: gsap.TweenTarget,
      scaleRange?: [number, number],
      config?: ParallaxConfig
    ) => parallaxManager.createScaleParallax(target, scaleRange, config),

    createRotationParallax: (
      target: gsap.TweenTarget,
      rotationRange?: [number, number],
      config?: ParallaxConfig
    ) => parallaxManager.createRotationParallax(target, rotationRange, config),

    createSkewParallax: (
      target: gsap.TweenTarget,
      skewRange?: [number, number],
      config?: ParallaxConfig
    ) => parallaxManager.createSkewParallax(target, skewRange, config),

    createBrutalistParallax: (
      target: gsap.TweenTarget,
      intensity?: 'subtle' | 'normal' | 'extreme',
      config?: ParallaxConfig
    ) => parallaxManager.createBrutalistParallax(target, intensity, config),

    createTextParallax: (
      target: gsap.TweenTarget,
      textSpeed?: number,
      config?: ParallaxConfig
    ) => parallaxManager.createTextParallax(target, textSpeed, config),

    createImageParallax: (
      target: gsap.TweenTarget,
      imageSpeed?: number,
      config?: ParallaxConfig
    ) => parallaxManager.createImageParallax(target, imageSpeed, config),

    cleanup: () => parallaxManager.cleanup(),
    refresh: () => parallaxManager.refresh(),
    setEnabled: (enabled: boolean) => parallaxManager.setEnabled(enabled),
    getActiveCount: () => parallaxManager.getActiveCount(),
  };
};

// Utility functions for common parallax patterns
export const createHeroParallax = (
  background: gsap.TweenTarget,
  foreground: gsap.TweenTarget,
  text: gsap.TweenTarget
) => {
  const parallaxManager = ParallaxManager.getInstance();
  
  return {
    background: parallaxManager.createParallax(background, PARALLAX_SPEEDS.slow, 'vertical'),
    foreground: parallaxManager.createParallax(foreground, PARALLAX_SPEEDS.normal, 'vertical'),
    text: parallaxManager.createTextParallax(text, PARALLAX_SPEEDS.fast),
  };
};

export const createProductParallax = (
  image: gsap.TweenTarget,
  content: gsap.TweenTarget
) => {
  const parallaxManager = ParallaxManager.getInstance();
  
  return {
    image: parallaxManager.createImageParallax(image, PARALLAX_SPEEDS.slow),
    content: parallaxManager.createRevealParallax(content, 'up'),
  };
};

export const createBrutalistParallax = (
  elements: gsap.TweenTarget[],
  intensity: 'subtle' | 'normal' | 'extreme' = 'normal'
) => {
  const parallaxManager = ParallaxManager.getInstance();
  
  return elements.map(element => 
    parallaxManager.createBrutalistParallax(element, intensity)
  );
};
