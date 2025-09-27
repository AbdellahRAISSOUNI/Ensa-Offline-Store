import { gsap } from 'gsap';

// Animation Configuration
export const ANIMATION_CONFIG = {
  performance: {
    desktop: {
      duration: 0.6,
      stagger: 0.1,
      fps: 60,
    },
    mobile: {
      duration: 0.4,
      stagger: 0.05,
      fps: 30,
    },
  },
  easings: {
    smooth: 'power2.out',
    bounce: 'back.out(1.7)',
    brutal: 'power3.inOut',
    elastic: 'elastic.out(1, 0.3)',
  },
};

// Animation Presets
export const ANIMATION_PRESETS = {
  fadeIn: {
    opacity: 0,
    duration: 0.6,
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  fadeInUp: {
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  fadeInDown: {
    opacity: 0,
    y: -30,
    duration: 0.6,
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  fadeInLeft: {
    opacity: 0,
    x: -30,
    duration: 0.6,
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  fadeInRight: {
    opacity: 0,
    x: 30,
    duration: 0.6,
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  scaleIn: {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    ease: ANIMATION_CONFIG.easings.bounce,
  },
  slideInUp: {
    y: 100,
    opacity: 0,
    duration: 0.6,
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  slideInDown: {
    y: -100,
    opacity: 0,
    duration: 0.6,
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  slideInLeft: {
    x: -100,
    opacity: 0,
    duration: 0.6,
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  slideInRight: {
    x: 100,
    opacity: 0,
    duration: 0.6,
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  brutalIn: {
    x: 50,
    y: 50,
    rotation: 5,
    opacity: 0,
    duration: 0.8,
    ease: ANIMATION_CONFIG.easings.brutal,
  },
  elasticIn: {
    scale: 0.3,
    opacity: 0,
    duration: 1,
    ease: ANIMATION_CONFIG.easings.elastic,
  },
};

// Stagger Configurations
export const STAGGER_CONFIGS = {
  default: {
    amount: 0.1,
    from: 'start',
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  fast: {
    amount: 0.05,
    from: 'start',
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  slow: {
    amount: 0.2,
    from: 'start',
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  center: {
    amount: 0.1,
    from: 'center',
    ease: ANIMATION_CONFIG.easings.smooth,
  },
  end: {
    amount: 0.1,
    from: 'end',
    ease: ANIMATION_CONFIG.easings.smooth,
  },
};

// Utility Functions
export const createTimeline = (options?: gsap.TimelineVars): gsap.core.Timeline => {
  return gsap.timeline(options);
};

export const createOptimizedAnimation = (
  target: gsap.TweenTarget,
  vars: gsap.TweenVars
): gsap.core.Tween => {
  const config = isMobile() 
    ? ANIMATION_CONFIG.performance.mobile
    : ANIMATION_CONFIG.performance.desktop;

  return gsap.to(target, {
    ...vars,
    duration: vars.duration || config.duration,
  });
};

export const createStaggerAnimation = (
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars,
  staggerConfig: typeof STAGGER_CONFIGS.default = STAGGER_CONFIGS.default
): gsap.core.Tween => {
  return gsap.to(targets, {
    ...vars,
    stagger: staggerConfig,
  });
};

// Device Detection
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for low-end device indicators
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return true;
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    // Check for integrated graphics or low-end GPUs
    return renderer.includes('Intel') || 
           renderer.includes('Integrated') || 
           renderer.includes('Mali') ||
           renderer.includes('Adreno 3');
  }
  
  return false;
};

export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Animation Manager
class AnimationManager {
  private animations: Map<string, gsap.core.Timeline> = new Map();
  private scrollTriggers: Set<gsap.ScrollTrigger> = new Set();

  register(id: string, animation: gsap.core.Timeline): void {
    this.animations.set(id, animation);
  }

  unregister(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.kill();
      this.animations.delete(id);
    }
  }

  registerScrollTrigger(trigger: gsap.ScrollTrigger): void {
    this.scrollTriggers.add(trigger);
  }

  unregisterScrollTrigger(trigger: gsap.ScrollTrigger): void {
    trigger.kill();
    this.scrollTriggers.delete(trigger);
  }

  killAll(): void {
    // Kill all timelines
    this.animations.forEach((animation) => animation.kill());
    this.animations.clear();

    // Kill all scroll triggers
    this.scrollTriggers.forEach((trigger) => trigger.kill());
    this.scrollTriggers.clear();
  }

  refresh(): void {
    gsap.ScrollTrigger.refresh();
  }

  getAnimationCount(): number {
    return this.animations.size + this.scrollTriggers.size;
  }
}

export const animationManager = new AnimationManager();

// Performance monitoring
export const getPerformanceMetrics = () => {
  if (typeof window === 'undefined') return null;

  const metrics = {
    frameRate: 60,
    memoryUsage: 0,
    animationCount: animationManager.getAnimationCount(),
  };

  // Monitor frame rate
  let frameCount = 0;
  let lastTime = performance.now();

  const measureFrameRate = () => {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      metrics.frameRate = frameCount;
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(measureFrameRate);
  };

  measureFrameRate();

  // Monitor memory usage (if available)
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
  }

  return metrics;
};

// Cleanup function for page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    animationManager.killAll();
  });
}