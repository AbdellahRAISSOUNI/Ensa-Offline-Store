import { gsap } from 'gsap';
import { ANIMATION_PRESETS, ANIMATION_CONFIG, createTimeline, createOptimizedAnimation } from '../lib/gsap-animations';

// Premium animation presets for different use cases
export const PREMIUM_ANIMATIONS = {
  // Hero section animations
  hero: {
    titleReveal: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { opacity: 0, y: 100, rotation: -2 })
        .to(target, {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 1.2,
          ease: 'power3.out',
        })
        .to(target, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.inOut',
        }, '-=0.2')
        .to(target, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.inOut',
        });
      
      return tl;
    },

    subtitleReveal: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { opacity: 0, x: -50, skewX: -5 })
        .to(target, {
          opacity: 1,
          x: 0,
          skewX: 0,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.5');
      
      return tl;
    },

    ctaReveal: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { opacity: 0, scale: 0.8, rotation: 5 })
        .to(target, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }, '-=0.3');
      
      return tl;
    },

    backgroundReveal: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { opacity: 0, scale: 1.1 })
        .to(target, {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: 'power2.out',
        });
      
      return tl;
    },
  },

  // Product card animations
  productCard: {
    cardEnter: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { opacity: 0, y: 60, rotation: -2 })
        .to(target, {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      
      return tl;
    },

    cardHover: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        y: -10,
        scale: 1.02,
        rotation: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
        .to(target, {
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          duration: 0.3,
          ease: 'power2.out',
        }, 0);
      
      return tl;
    },

    cardHoverOut: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        y: 0,
        scale: 1,
        rotation: 0,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.out',
      });
      
      return tl;
    },

    imageReveal: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { opacity: 0, scale: 1.2 })
        .to(target, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.2');
      
      return tl;
    },
  },

  // Navigation animations
  navigation: {
    menuSlideIn: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { x: '-100%', opacity: 0 })
        .to(target, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        });
      
      return tl;
    },

    menuSlideOut: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        x: '-100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
      });
      
      return tl;
    },

    linkHover: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        y: -2,
        color: '#8BC34A',
        duration: 0.2,
        ease: 'power2.out',
      });
      
      return tl;
    },

    linkHoverOut: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        y: 0,
        color: '#000000',
        duration: 0.2,
        ease: 'power2.out',
      });
      
      return tl;
    },
  },

  // Form animations
  form: {
    fieldFocus: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        scale: 1.02,
        boxShadow: '0 0 0 3px rgba(139, 195, 74, 0.3)',
        duration: 0.2,
        ease: 'power2.out',
      });
      
      return tl;
    },

    fieldBlur: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        scale: 1,
        boxShadow: '0 0 0 0px rgba(139, 195, 74, 0)',
        duration: 0.2,
        ease: 'power2.out',
      });
      
      return tl;
    },

    buttonPress: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power2.out',
      })
        .to(target, {
          scale: 1,
          duration: 0.1,
          ease: 'power2.out',
        });
      
      return tl;
    },

    validationError: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        x: -10,
        duration: 0.1,
        ease: 'power2.out',
      })
        .to(target, {
          x: 10,
          duration: 0.1,
          ease: 'power2.out',
        })
        .to(target, {
          x: -5,
          duration: 0.1,
          ease: 'power2.out',
        })
        .to(target, {
          x: 0,
          duration: 0.1,
          ease: 'power2.out',
        });
      
      return tl;
    },

    successCheck: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { scale: 0, rotation: -180 })
        .to(target, {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
        });
      
      return tl;
    },
  },

  // Loading animations
  loading: {
    spinner: (target: gsap.TweenTarget) => {
      const tl = createTimeline({ repeat: -1 });
      
      tl.to(target, {
        rotation: 360,
        duration: 1,
        ease: 'none',
      });
      
      return tl;
    },

    pulse: (target: gsap.TweenTarget) => {
      const tl = createTimeline({ repeat: -1, yoyo: true });
      
      tl.to(target, {
        scale: 1.1,
        opacity: 0.7,
        duration: 0.8,
        ease: 'power2.inOut',
      });
      
      return tl;
    },

    wave: (target: gsap.TweenTarget) => {
      const tl = createTimeline({ repeat: -1 });
      
      tl.to(target, {
        y: -20,
        duration: 0.6,
        ease: 'power2.inOut',
      })
        .to(target, {
          y: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        });
      
      return tl;
    },

    dots: (targets: gsap.TweenTarget[]) => {
      const tl = createTimeline({ repeat: -1 });
      
      targets.forEach((target, index) => {
        tl.to(target, {
          scale: 1.5,
          duration: 0.3,
          ease: 'power2.out',
        }, index * 0.1)
          .to(target, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          }, index * 0.1 + 0.3);
      });
      
      return tl;
    },
  },

  // Page transition animations
  pageTransition: {
    slideInRight: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { x: '100%' })
        .to(target, {
          x: 0,
          duration: 0.6,
          ease: 'power3.out',
        });
      
      return tl;
    },

    slideOutLeft: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        x: '-100%',
        duration: 0.4,
        ease: 'power3.in',
      });
      
      return tl;
    },

    fadeIn: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { opacity: 0 })
        .to(target, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        });
      
      return tl;
    },

    fadeOut: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      });
      
      return tl;
    },

    scaleIn: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { scale: 0, opacity: 0 })
        .to(target, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
        });
      
      return tl;
    },

    scaleOut: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'back.in(1.7)',
      });
      
      return tl;
    },
  },

  // Brutalist animations (ENSA OFFLINE theme)
  brutalist: {
    brutalSlideIn: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { x: '-100%', rotation: -10, skewX: -15 })
        .to(target, {
          x: 0,
          rotation: 0,
          skewX: 0,
          duration: 1,
          ease: 'power4.out',
        });
      
      return tl;
    },

    brutalScaleIn: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { scale: 0, rotation: 45, opacity: 0 })
        .to(target, {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power4.out',
        });
      
      return tl;
    },

    brutalSkewIn: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.set(target, { x: '-100%', skewX: -20, opacity: 0 })
        .to(target, {
          x: 0,
          skewX: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        });
      
      return tl;
    },

    brutalHover: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        scale: 1.05,
        rotation: 2,
        skewX: 2,
        duration: 0.3,
        ease: 'power2.out',
      });
      
      return tl;
    },

    brutalHoverOut: (target: gsap.TweenTarget) => {
      const tl = createTimeline();
      
      tl.to(target, {
        scale: 1,
        rotation: 0,
        skewX: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
      
      return tl;
    },
  },

  // Text animations
  text: {
    typewriter: (target: gsap.TweenTarget, text: string) => {
      const tl = createTimeline();
      
      tl.set(target, { text: '' })
        .to(target, {
          text: text,
          duration: text.length * 0.05,
          ease: 'none',
        });
      
      return tl;
    },

    splitTextReveal: (targets: gsap.TweenTarget[]) => {
      const tl = createTimeline();
      
      tl.set(targets, { opacity: 0, y: 20 })
        .to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
        });
      
      return tl;
    },

    textGlitch: (target: gsap.TweenTarget) => {
      const tl = createTimeline({ repeat: 3 });
      
      tl.to(target, {
        x: -2,
        duration: 0.05,
        ease: 'none',
      })
        .to(target, {
          x: 2,
          duration: 0.05,
          ease: 'none',
        })
        .to(target, {
          x: 0,
          duration: 0.05,
          ease: 'none',
        });
      
      return tl;
    },
  },

  // Scroll-triggered animations
  scroll: {
    parallaxSlow: (target: gsap.TweenTarget) => {
      return gsap.to(target, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: target,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    },

    parallaxFast: (target: gsap.TweenTarget) => {
      return gsap.to(target, {
        y: -200,
        ease: 'none',
        scrollTrigger: {
          trigger: target,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    },

    revealOnScroll: (target: gsap.TweenTarget) => {
      return gsap.fromTo(target, 
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: target,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
  },
};

// Utility function to create custom animations
export const createCustomAnimation = (
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'skew' | 'brutal',
  direction?: 'up' | 'down' | 'left' | 'right',
  options?: gsap.TweenVars
) => {
  const baseOptions = {
    duration: ANIMATION_CONFIG.durations.normal,
    ease: ANIMATION_CONFIG.easings.smooth,
    ...options,
  };

  switch (type) {
    case 'fade':
      return {
        opacity: 0,
        ...baseOptions,
      };

    case 'slide':
      const slideProps = direction === 'up' ? { y: 60 } :
                        direction === 'down' ? { y: -60 } :
                        direction === 'left' ? { x: 60 } :
                        { x: -60 };
      return {
        ...slideProps,
        opacity: 0,
        ...baseOptions,
      };

    case 'scale':
      return {
        scale: 0,
        opacity: 0,
        ...baseOptions,
      };

    case 'rotate':
      return {
        rotation: direction === 'left' ? -180 : 180,
        opacity: 0,
        ...baseOptions,
      };

    case 'skew':
      return {
        skewX: direction === 'left' ? -15 : 15,
        opacity: 0,
        ...baseOptions,
      };

    case 'brutal':
      return {
        x: direction === 'left' ? -100 : 100,
        rotation: direction === 'left' ? -10 : 10,
        skewX: direction === 'left' ? -15 : 15,
        opacity: 0,
        duration: ANIMATION_CONFIG.durations.slow,
        ease: ANIMATION_CONFIG.easings.brutal,
        ...options,
      };

    default:
      return baseOptions;
  }
};

// Animation sequence builder
export const createAnimationSequence = (
  animations: Array<{
    target: gsap.TweenTarget;
    animation: gsap.TweenVars;
    delay?: number;
  }>
) => {
  const tl = createTimeline();

  animations.forEach(({ target, animation, delay = 0 }) => {
    tl.to(target, animation, delay);
  });

  return tl;
};
