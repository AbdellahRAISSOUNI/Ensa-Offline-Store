import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';
import {
  ANIMATION_PRESETS,
  ANIMATION_CONFIG,
  STAGGER_CONFIGS,
  createTimeline,
  createOptimizedAnimation,
  createStaggerAnimation,
  animationManager,
  isReducedMotion,
  isMobile,
  isLowEndDevice,
} from '../lib/gsap-animations';

// useGSAP Hook - Main animation hook
export const useGSAP = (
  animationFn: (ctx: gsap.Context) => void,
  dependencies: any[] = []
) => {
  const ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const animationId = useRef<string>(`animation-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!ref.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      timelineRef.current = createTimeline();
      animationFn(timelineRef.current);
    }, ref);

    // Register animation for cleanup
    if (timelineRef.current) {
      animationManager.register(animationId.current, timelineRef.current);
    }

    return () => {
      ctx.revert();
      animationManager.unregister(animationId.current);
    };
  }, dependencies);

  const play = useCallback(() => {
    timelineRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    timelineRef.current?.pause();
  }, []);

  const reverse = useCallback(() => {
    timelineRef.current?.reverse();
  }, []);

  const restart = useCallback(() => {
    timelineRef.current?.restart();
  }, []);

  const kill = useCallback(() => {
    timelineRef.current?.kill();
  }, []);

  return {
    ref,
    timeline: timelineRef.current,
    play,
    pause,
    reverse,
    restart,
    kill,
  };
};

// useScrollTrigger Hook - Scroll-based animations
export const useScrollTrigger = (
  trigger: gsap.TweenTarget,
  animation: gsap.TweenVars,
  options: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
    markers?: boolean;
    once?: boolean;
    onEnter?: () => void;
    onLeave?: () => void;
    onEnterBack?: () => void;
    onLeaveBack?: () => void;
  } = {}
) => {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const animationId = useRef<string>(`scroll-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isReducedMotion()) return;

    const config = isMobile() 
      ? ANIMATION_CONFIG.performance.mobile
      : ANIMATION_CONFIG.performance.desktop;

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger,
      start: options.start || 'top 80%',
      end: options.end || 'bottom 20%',
      scrub: options.scrub || false,
      pin: options.pin || false,
      markers: options.markers || false,
      once: options.once || false,
      onEnter: options.onEnter,
      onLeave: options.onLeave,
      onEnterBack: options.onEnterBack,
      onLeaveBack: options.onLeaveBack,
      animation: gsap.to(trigger, {
        ...animation,
        duration: animation.duration || config.duration,
      }),
    });

    animationManager.registerScrollTrigger(scrollTriggerRef.current);

    return () => {
      scrollTriggerRef.current?.kill();
      animationManager.unregister(animationId.current);
    };
  }, [trigger, animation, options]);

  const refresh = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  const update = useCallback(() => {
    scrollTriggerRef.current?.refresh();
  }, []);

  return {
    scrollTrigger: scrollTriggerRef.current,
    refresh,
    update,
  };
};

// usePageTransition Hook - Route change animations
export const usePageTransition = () => {
  const router = useRouter();
  const isTransitioning = useRef(false);
  const transitionId = useRef<string>(`transition-${Math.random().toString(36).substr(2, 9)}`);

  const transitionTo = useCallback(
    (url: string, options: {
      duration?: number;
      easing?: string;
      direction?: 'left' | 'right' | 'up' | 'down';
      type?: 'slide' | 'fade' | 'scale' | 'brutal';
    } = {}) => {
      if (isTransitioning.current || isReducedMotion()) {
        router.push(url);
        return;
      }

      isTransitioning.current = true;

      const config = isMobile() 
        ? ANIMATION_CONFIG.performance.mobile
        : ANIMATION_CONFIG.performance.desktop;

      const duration = options.duration || config.duration;
      const easing = options.easing || ANIMATION_CONFIG.easings.smooth;
      const direction = options.direction || 'right';
      const type = options.type || 'slide';

      // Create exit animation based on type
      let exitAnimation: gsap.TweenVars;

      switch (type) {
        case 'fade':
          exitAnimation = { opacity: 0, duration, ease: easing };
          break;
        case 'scale':
          exitAnimation = { 
            scale: 0.8, 
            opacity: 0, 
            duration, 
            ease: ANIMATION_CONFIG.easings.bounce 
          };
          break;
        case 'brutal':
          exitAnimation = { 
            x: direction === 'left' ? '-100%' : '100%',
            rotation: direction === 'left' ? -5 : 5,
            duration, 
            ease: ANIMATION_CONFIG.easings.brutal 
          };
          break;
        default: // slide
          exitAnimation = { 
            x: direction === 'left' ? '-100%' : '100%',
            duration, 
            ease: easing 
          };
      }

      // Animate out current page
      const timeline = createTimeline();
      
      timeline.to('body', exitAnimation)
        .call(() => {
          router.push(url);
        })
        .set('body', { 
          x: direction === 'left' ? '100%' : '-100%',
          opacity: 0,
          scale: type === 'scale' ? 0.8 : 1,
          rotation: type === 'brutal' ? (direction === 'left' ? 5 : -5) : 0,
        })
        .to('body', {
          x: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration,
          ease: easing,
        })
        .call(() => {
          isTransitioning.current = false;
        });

      animationManager.register(transitionId.current, timeline);
    },
    [router]
  );

  const fadeTo = useCallback(
    (url: string, duration?: number) => {
      transitionTo(url, { type: 'fade', duration });
    },
    [transitionTo]
  );

  const slideTo = useCallback(
    (url: string, direction?: 'left' | 'right' | 'up' | 'down', duration?: number) => {
      transitionTo(url, { type: 'slide', direction, duration });
    },
    [transitionTo]
  );

  const scaleTo = useCallback(
    (url: string, duration?: number) => {
      transitionTo(url, { type: 'scale', duration });
    },
    [transitionTo]
  );

  const brutalTo = useCallback(
    (url: string, direction?: 'left' | 'right', duration?: number) => {
      transitionTo(url, { type: 'brutal', direction, duration });
    },
    [transitionTo]
  );

  return {
    transitionTo,
    fadeTo,
    slideTo,
    scaleTo,
    brutalTo,
    isTransitioning: isTransitioning.current,
  };
};

// useStaggerAnimation Hook - Staggered animations
export const useStaggerAnimation = (
  targets: gsap.TweenTarget,
  animation: gsap.TweenVars,
  staggerOptions: {
    amount?: number;
    from?: string;
    ease?: string;
    delay?: number;
  } = {}
) => {
  const animationId = useRef<string>(`stagger-${Math.random().toString(36).substr(2, 9)}`);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const play = useCallback(() => {
    if (isReducedMotion()) return;

    const config = isMobile() 
      ? ANIMATION_CONFIG.performance.mobile
      : ANIMATION_CONFIG.performance.desktop;

    timelineRef.current = createTimeline();
    
    timelineRef.current.to(targets, {
      ...animation,
      stagger: {
        amount: staggerOptions.amount || config.stagger,
        from: staggerOptions.from || 'start',
        ease: staggerOptions.ease || ANIMATION_CONFIG.easings.smooth,
      },
      delay: staggerOptions.delay || 0,
    });

    animationManager.register(animationId.current, timelineRef.current);
  }, [targets, animation, staggerOptions]);

  const kill = useCallback(() => {
    timelineRef.current?.kill();
    animationManager.unregister(animationId.current);
  }, []);

  useEffect(() => {
    return () => {
      kill();
    };
  }, [kill]);

  return {
    play,
    kill,
    timeline: timelineRef.current,
  };
};

// useParallax Hook - Parallax scrolling effects
export const useParallax = (
  elements: Array<{
    target: gsap.TweenTarget;
    speed: number;
    direction?: 'vertical' | 'horizontal';
  }>,
  options: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {}
) => {
  const parallaxId = useRef<string>(`parallax-${Math.random().toString(36).substr(2, 9)}`);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (isReducedMotion() || isLowEndDevice()) return;

    const triggers: ScrollTrigger[] = [];

    elements.forEach((element) => {
      const trigger = ScrollTrigger.create({
        trigger: element.target,
        start: options.start || 'top bottom',
        end: options.end || 'bottom top',
        scrub: options.scrub || 1,
        animation: gsap.to(element.target, {
          y: element.direction === 'horizontal' ? 0 : element.speed * 100,
          x: element.direction === 'horizontal' ? element.speed * 100 : 0,
          ease: 'none',
        }),
      });

      triggers.push(trigger);
      animationManager.registerScrollTrigger(trigger);
    });

    scrollTriggersRef.current = triggers;

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      animationManager.unregister(parallaxId.current);
    };
  }, [elements, options]);

  const refresh = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  return {
    refresh,
    triggers: scrollTriggersRef.current,
  };
};

// useAnimationPreset Hook - Predefined animation presets
export const useAnimationPreset = (presetName: keyof typeof ANIMATION_PRESETS) => {
  const preset = useMemo(() => ANIMATION_PRESETS[presetName], [presetName]);
  
  const animate = useCallback(
    (target: gsap.TweenTarget, options: gsap.TweenVars = {}) => {
      if (isReducedMotion()) {
        gsap.set(target, { opacity: 1 });
        return;
      }

      return createOptimizedAnimation(target, {
        ...preset,
        ...options,
      });
    },
    [preset]
  );

  const animateFrom = useCallback(
    (target: gsap.TweenTarget, options: gsap.TweenVars = {}) => {
      if (isReducedMotion()) {
        gsap.set(target, { opacity: 1 });
        return;
      }

      return gsap.from(target, {
        ...preset,
        ...options,
      });
    },
    [preset]
  );

  return {
    preset,
    animate,
    animateFrom,
  };
};

// Performance monitoring hook
export const useAnimationPerformance = () => {
  const performanceData = useRef({
    frameRate: 60,
    droppedFrames: 0,
    animationCount: 0,
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        performanceData.current.frameRate = frameCount;
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return performanceData.current;
};
