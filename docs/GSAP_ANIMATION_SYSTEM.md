# Premium GSAP Animation System Documentation

## Overview

This comprehensive GSAP animation system provides premium, high-quality animations optimized for the ENSA OFFLINE brutalist merch website. The system includes performance monitoring, accessibility support, memory management, and mobile optimization.

## 🚀 Features

### Core Animation Library
- **Premium Animation Presets** - High-quality, smooth animations with brutalist themes
- **Performance Optimization** - Automatic device detection and optimization
- **Accessibility Support** - Reduced motion preferences and screen reader compatibility
- **Memory Management** - Automatic cleanup and memory monitoring
- **Mobile Optimization** - Touch-friendly animations with reduced complexity

### Custom Hooks
- **useGSAP** - Main animation hook for component animations
- **useScrollTrigger** - Scroll-based animations with performance optimization
- **usePageTransition** - Smooth route transitions with brutalist effects
- **useStaggerAnimation** - Staggered animations for lists and grids
- **useParallax** - Parallax scrolling effects with device optimization
- **useAnimationPreset** - Predefined animation presets

### Performance Features
- **Frame Rate Monitoring** - Real-time performance tracking
- **Device Capability Detection** - Automatic optimization based on device specs
- **Memory Usage Monitoring** - Prevents memory leaks and performance issues
- **Reduced Motion Support** - Respects user accessibility preferences
- **Mobile-First Design** - Optimized animations for touch devices

## 📁 File Structure

```
src/
├── lib/
│   ├── gsap-animations.ts      # Core animation library
│   ├── animation-presets.ts    # Premium animation presets
│   ├── performance-utils.ts    # Performance optimization utilities
│   └── parallax-system.ts     # Parallax scrolling system
├── hooks/
│   └── useGSAP.ts             # Custom animation hooks
└── components/
    └── AnimationShowcase.tsx   # Example implementation
```

## 🎨 Animation Presets

### Hero Section Animations
```typescript
import { PREMIUM_ANIMATIONS } from '@/lib/animation-presets';

// Title reveal with brutalist effect
PREMIUM_ANIMATIONS.hero.titleReveal(target);

// Subtitle reveal
PREMIUM_ANIMATIONS.hero.subtitleReveal(target);

// CTA button reveal
PREMIUM_ANIMATIONS.hero.ctaReveal(target);

// Background reveal
PREMIUM_ANIMATIONS.hero.backgroundReveal(target);
```

### Product Card Animations
```typescript
// Card entrance animation
PREMIUM_ANIMATIONS.productCard.cardEnter(target);

// Hover effects
PREMIUM_ANIMATIONS.productCard.cardHover(target);
PREMIUM_ANIMATIONS.productCard.cardHoverOut(target);

// Image reveal
PREMIUM_ANIMATIONS.productCard.imageReveal(target);
```

### Brutalist Animations (ENSA OFFLINE Theme)
```typescript
// Brutal slide in with rotation and skew
PREMIUM_ANIMATIONS.brutalist.brutalSlideIn(target);

// Brutal scale in with rotation
PREMIUM_ANIMATIONS.brutalist.brutalScaleIn(target);

// Brutal skew in effect
PREMIUM_ANIMATIONS.brutalist.brutalSkewIn(target);

// Hover effects
PREMIUM_ANIMATIONS.brutalist.brutalHover(target);
PREMIUM_ANIMATIONS.brutalist.brutalHoverOut(target);
```

### Text Animations
```typescript
// Typewriter effect
PREMIUM_ANIMATIONS.text.typewriter(target, "ENSA OFFLINE");

// Split text reveal
PREMIUM_ANIMATIONS.text.splitTextReveal(textElements);

// Text glitch effect
PREMIUM_ANIMATIONS.text.textGlitch(target);
```

## 🎯 Custom Hooks Usage

### useGSAP Hook
```typescript
import { useGSAP } from '@/hooks/useGSAP';

const MyComponent = () => {
  const { ref, play, pause, reverse, restart, kill } = useGSAP((tl) => {
    tl.fromTo(ref.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  return (
    <div ref={ref}>
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reverse}>Reverse</button>
    </div>
  );
};
```

### useScrollTrigger Hook
```typescript
import { useScrollTrigger } from '@/hooks/useGSAP';

const MyComponent = () => {
  const { refresh, update } = useScrollTrigger(
    '.my-element',
    { opacity: 1, y: 0 },
    {
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => console.log('Element entered viewport'),
      onLeave: () => console.log('Element left viewport'),
    }
  );

  return <div className="my-element">Scroll-triggered content</div>;
};
```

### usePageTransition Hook
```typescript
import { usePageTransition } from '@/hooks/useGSAP';

const Navigation = () => {
  const { brutalTo, slideTo, fadeTo, scaleTo } = usePageTransition();

  return (
    <nav>
      <button onClick={() => brutalTo('/products', 'right')}>
        Brutal Slide Right
      </button>
      <button onClick={() => slideTo('/about', 'left')}>
        Slide Left
      </button>
      <button onClick={() => fadeTo('/contact')}>
        Fade Transition
      </button>
      <button onClick={() => scaleTo('/home')}>
        Scale Transition
      </button>
    </nav>
  );
};
```

### useParallax Hook
```typescript
import { useParallax } from '@/lib/parallax-system';

const ParallaxSection = () => {
  const { 
    createParallax, 
    createBrutalistParallax, 
    createRevealParallax 
  } = useParallax();

  useEffect(() => {
    // Basic parallax
    createParallax('.background', 0.5, 'vertical');
    
    // Brutalist parallax
    createBrutalistParallax('.brutal-element', 'normal');
    
    // Reveal parallax
    createRevealParallax('.reveal-element', 'up');
  }, [createParallax, createBrutalistParallax, createRevealParallax]);

  return (
    <section>
      <div className="background">Background</div>
      <div className="brutal-element">Brutal Element</div>
      <div className="reveal-element">Reveal Element</div>
    </section>
  );
};
```

## ⚡ Performance Optimization

### Device Capability Detection
```typescript
import { useDeviceCapabilities } from '@/lib/performance-utils';

const MyComponent = () => {
  const { capabilities, optimalSettings } = useDeviceCapabilities();

  return (
    <div>
      <p>Device: {capabilities.isMobile ? 'Mobile' : 'Desktop'}</p>
      <p>Low End: {capabilities.isLowEnd ? 'Yes' : 'No'}</p>
      <p>Optimal Duration: {optimalSettings.duration}s</p>
      <p>Max Elements: {optimalSettings.maxElements}</p>
    </div>
  );
};
```

### Performance Monitoring
```typescript
import { usePerformanceMonitoring } from '@/lib/performance-utils';

const PerformanceMonitor = () => {
  const { startMonitoring, getFrameRate, getDroppedFrames } = usePerformanceMonitoring();

  useEffect(() => {
    startMonitoring();
    
    const interval = setInterval(() => {
      const frameRate = getFrameRate();
      if (frameRate < 30) {
        console.warn('Low frame rate detected:', frameRate);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startMonitoring, getFrameRate]);

  return <div>Performance monitoring active</div>;
};
```

### Memory Management
```typescript
import { useMemoryManagement } from '@/lib/performance-utils';

const MyComponent = () => {
  const { 
    registerAnimation, 
    unregisterAnimation, 
    cleanup 
  } = useMemoryManagement();

  useEffect(() => {
    const animationId = 'my-animation';
    const timeline = gsap.timeline();
    
    // Register animation for cleanup
    registerAnimation(animationId, timeline);
    
    return () => {
      unregisterAnimation(animationId);
    };
  }, [registerAnimation, unregisterAnimation]);

  return <div>Memory-managed component</div>;
};
```

## 🎭 Animation Configuration

### Duration Presets
```typescript
import { ANIMATION_CONFIG } from '@/lib/gsap-animations';

const durations = {
  instant: 0.1,
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  epic: 2.0,
};
```

### Easing Presets
```typescript
const easings = {
  smooth: 'power2.out',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  brutal: 'power4.out',
  custom: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};
```

### Performance Settings
```typescript
const performance = {
  mobile: {
    duration: 0.4,
    stagger: 0.05,
    maxElements: 20,
  },
  desktop: {
    duration: 0.6,
    stagger: 0.1,
    maxElements: 50,
  },
  lowEnd: {
    duration: 0.3,
    stagger: 0.03,
    maxElements: 10,
  },
};
```

## 🔧 Advanced Features

### Stagger Animations
```typescript
import { useStaggerAnimation } from '@/hooks/useGSAP';

const StaggeredList = () => {
  const { play } = useStaggerAnimation(
    '.list-item',
    { opacity: 1, y: 0 },
    { amount: 0.1, from: 'start' }
  );

  useEffect(() => {
    play();
  }, [play]);

  return (
    <ul>
      <li className="list-item">Item 1</li>
      <li className="list-item">Item 2</li>
      <li className="list-item">Item 3</li>
    </ul>
  );
};
```

### Custom Animation Creation
```typescript
import { createCustomAnimation } from '@/lib/animation-presets';

const customAnimation = createCustomAnimation(
  'brutal',
  'right',
  { duration: 1.5, ease: 'power4.out' }
);

gsap.to(target, customAnimation);
```

### Animation Sequences
```typescript
import { createAnimationSequence } from '@/lib/animation-presets';

const sequence = createAnimationSequence([
  {
    target: '.element1',
    animation: { opacity: 1, y: 0 },
    delay: 0,
  },
  {
    target: '.element2',
    animation: { opacity: 1, x: 0 },
    delay: 0.2,
  },
  {
    target: '.element3',
    animation: { opacity: 1, scale: 1 },
    delay: 0.4,
  },
]);

sequence.play();
```

## 🎨 Brutalist Theme Integration

### ENSA OFFLINE Specific Animations
```typescript
// Brutalist slide in with rotation and skew
const brutalSlideIn = PREMIUM_ANIMATIONS.brutalist.brutalSlideIn;

// Brutalist hover effects
const brutalHover = PREMIUM_ANIMATIONS.brutalist.brutalHover;

// Brutalist parallax
const brutalParallax = createBrutalistParallax(elements, 'extreme');

// Brutalist page transitions
const brutalTransition = brutalTo('/products', 'right');
```

### Color Scheme Integration
```typescript
const brutalistColors = {
  primary: '#8BC34A',    // Green
  secondary: '#000000',  // Black
  accent: '#333333',     // Dark Gray
  background: '#FFFFFF', // White
};

// Hover glow effect
const hoverGlow = {
  boxShadow: '0 0 20px rgba(139, 195, 74, 0.5)',
  duration: 0.3,
  ease: 'power2.out',
};
```

## 📱 Mobile Optimization

### Touch-Friendly Animations
```typescript
const mobileOptimized = {
  duration: 0.4,        // Shorter duration
  stagger: 0.05,        // Faster stagger
  maxElements: 20,      // Fewer elements
  enableParallax: true, // Parallax enabled
  enableComplexEffects: false, // Complex effects disabled
};
```

### Performance Thresholds
```typescript
const performanceThresholds = {
  lowFrameRate: 30,     // FPS threshold
  memoryLimit: 50,      // MB threshold
  maxAnimations: 50,    // Max concurrent animations
  cleanupRatio: 0.3,    // Cleanup percentage
};
```

## ♿ Accessibility Features

### Reduced Motion Support
```typescript
import { useReducedMotion } from '@/lib/performance-utils';

const AccessibleComponent = () => {
  const { shouldReduceMotion, createReducedMotionAnimation } = useReducedMotion();

  const animate = (target: gsap.TweenTarget, vars: gsap.TweenVars) => {
    if (shouldReduceMotion()) {
      return createReducedMotionAnimation(target, vars);
    }
    return gsap.to(target, vars);
  };

  return <div>Accessible animation component</div>;
};
```

### Screen Reader Compatibility
```typescript
// Animations respect prefers-reduced-motion
const respectsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (respectsReducedMotion) {
  // Use simple opacity transitions only
  gsap.to(target, { opacity: 1, duration: 0.1 });
} else {
  // Use full animation
  gsap.to(target, { opacity: 1, y: 0, duration: 0.6 });
}
```

## 🚀 Best Practices

### 1. Performance First
- Always check device capabilities before creating animations
- Use performance monitoring in development
- Clean up animations when components unmount
- Respect reduced motion preferences

### 2. Mobile Optimization
- Use shorter durations on mobile devices
- Reduce animation complexity on low-end devices
- Test on actual mobile devices
- Consider touch interactions

### 3. Accessibility
- Always provide reduced motion alternatives
- Test with screen readers
- Use semantic HTML elements
- Provide keyboard navigation support

### 4. Memory Management
- Register animations for cleanup
- Monitor memory usage
- Clean up unused animations
- Use efficient animation techniques

### 5. Brutalist Theme
- Use bold, geometric animations
- Incorporate rotation and skew effects
- Use the ENSA OFFLINE color scheme
- Create impactful, memorable animations

## 🔍 Troubleshooting

### Common Issues

#### Animations Not Playing
```typescript
// Check if reduced motion is enabled
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Check device capabilities
const capabilities = DeviceCapabilities.getInstance().getCapabilities();

// Check if animations are registered
const memoryManager = MemoryManager.getInstance();
console.log('Active animations:', memoryManager.getActiveAnimationsCount());
```

#### Performance Issues
```typescript
// Monitor frame rate
const monitor = new PerformanceMonitor();
monitor.startMonitoring();

// Check memory usage
if (typeof performance !== 'undefined' && (performance as any).memory) {
  const memory = (performance as any).memory;
  const usedMB = memory.usedJSHeapSize / 1024 / 1024;
  console.log('Memory usage:', usedMB, 'MB');
}

// Optimize animations
const optimizer = AnimationOptimizer.getInstance();
const optimizedVars = optimizer.optimizeAnimation(animationVars);
```

#### Mobile Issues
```typescript
// Check mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Use mobile-optimized settings
const settings = DeviceCapabilities.getInstance().getOptimalSettings();
console.log('Mobile settings:', settings);
```

## 📚 Examples

See `src/components/AnimationShowcase.tsx` for comprehensive examples of:
- Hero section animations
- Product card animations
- Text animations
- Parallax effects
- Performance monitoring
- Device capability detection

## 🎯 Conclusion

This premium GSAP animation system provides everything needed for high-quality, performant animations on the ENSA OFFLINE website. The system is designed to be:

- **Premium Quality** - Smooth, professional animations
- **Performance Optimized** - Automatic device detection and optimization
- **Accessible** - Reduced motion support and screen reader compatibility
- **Mobile-First** - Touch-friendly with mobile optimization
- **Memory Efficient** - Automatic cleanup and memory management
- **Brutalist Themed** - Perfect for the ENSA OFFLINE aesthetic

The system is ready for production use and provides a solid foundation for creating engaging, accessible, and performant animations.
