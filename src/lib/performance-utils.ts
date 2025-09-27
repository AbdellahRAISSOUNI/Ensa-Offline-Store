import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Performance monitoring and optimization utilities
export class PerformanceMonitor {
  private frameRate: number = 60;
  private droppedFrames: number = 0;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private animationId: number | null = null;
  private isMonitoring: boolean = false;

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    
    const measureFrameRate = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime - this.lastFrameTime >= 1000) {
        this.frameRate = this.frameCount;
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
        
        // Check for performance issues
        if (this.frameRate < 30) {
          this.handlePerformanceIssue();
        }
      }
      
      if (this.isMonitoring) {
        this.animationId = requestAnimationFrame(measureFrameRate);
      }
    };
    
    this.animationId = requestAnimationFrame(measureFrameRate);
  }

  stopMonitoring() {
    this.isMonitoring = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private handlePerformanceIssue() {
    console.warn('Performance issue detected. Frame rate:', this.frameRate);
    
    // Automatically reduce animation complexity
    this.optimizeAnimations();
  }

  private optimizeAnimations() {
    // Reduce animation duration
    gsap.globalTimeline.timeScale(1.5);
    
    // Disable complex effects
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.scrub) {
        trigger.kill();
      }
    });
  }

  getFrameRate(): number {
    return this.frameRate;
  }

  getDroppedFrames(): number {
    return this.droppedFrames;
  }

  reset() {
    this.frameRate = 60;
    this.droppedFrames = 0;
    this.frameCount = 0;
  }
}

// Device capability detection
export class DeviceCapabilities {
  private static instance: DeviceCapabilities;
  private capabilities: {
    isLowEnd: boolean;
    isMobile: boolean;
    supportsWebGL: boolean;
    memoryLimit: number;
    cpuCores: number;
  };

  private constructor() {
    this.capabilities = this.detectCapabilities();
  }

  static getInstance(): DeviceCapabilities {
    if (!DeviceCapabilities.instance) {
      DeviceCapabilities.instance = new DeviceCapabilities();
    }
    return DeviceCapabilities.instance;
  }

  private detectCapabilities() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cpuCores = navigator.hardwareConcurrency || 2;
    const memoryLimit = (navigator as any).deviceMemory || 4;
    const isLowEnd = cpuCores <= 2 || memoryLimit <= 2;
    
    // Test WebGL support
    let supportsWebGL = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      supportsWebGL = !!gl;
    } catch (e) {
      supportsWebGL = false;
    }

    return {
      isLowEnd,
      isMobile,
      supportsWebGL,
      memoryLimit,
      cpuCores,
    };
  }

  getCapabilities() {
    return this.capabilities;
  }

  shouldReduceAnimations(): boolean {
    return this.capabilities.isLowEnd || this.capabilities.isMobile;
  }

  getOptimalSettings() {
    const { isLowEnd, isMobile, cpuCores, memoryLimit } = this.capabilities;
    
    if (isLowEnd) {
      return {
        duration: 0.3,
        stagger: 0.03,
        maxElements: 10,
        enableParallax: false,
        enableComplexEffects: false,
        enableWebGL: false,
      };
    }
    
    if (isMobile) {
      return {
        duration: 0.4,
        stagger: 0.05,
        maxElements: 20,
        enableParallax: true,
        enableComplexEffects: false,
        enableWebGL: this.capabilities.supportsWebGL,
      };
    }
    
    return {
      duration: 0.6,
      stagger: 0.1,
      maxElements: 50,
      enableParallax: true,
      enableComplexEffects: true,
      enableWebGL: this.capabilities.supportsWebGL,
    };
  }
}

// Memory management utilities
export class MemoryManager {
  private static instance: MemoryManager;
  private activeAnimations: Map<string, gsap.core.Timeline> = new Map();
  private activeScrollTriggers: ScrollTrigger[] = [];
  private memoryThreshold: number = 50; // MB

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  registerAnimation(id: string, timeline: gsap.core.Timeline) {
    this.activeAnimations.set(id, timeline);
    this.checkMemoryUsage();
  }

  unregisterAnimation(id: string) {
    const timeline = this.activeAnimations.get(id);
    if (timeline) {
      timeline.kill();
      this.activeAnimations.delete(id);
    }
  }

  registerScrollTrigger(trigger: ScrollTrigger) {
    this.activeScrollTriggers.push(trigger);
    this.checkMemoryUsage();
  }

  unregisterScrollTrigger(trigger: ScrollTrigger) {
    const index = this.activeScrollTriggers.indexOf(trigger);
    if (index > -1) {
      trigger.kill();
      this.activeScrollTriggers.splice(index, 1);
    }
  }

  private checkMemoryUsage() {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      
      if (usedMB > this.memoryThreshold) {
        this.cleanupOldAnimations();
      }
    }
  }

  private cleanupOldAnimations() {
    // Kill oldest animations if memory usage is high
    const animationsToKill = Math.floor(this.activeAnimations.size * 0.3);
    const animationIds = Array.from(this.activeAnimations.keys()).slice(0, animationsToKill);
    
    animationIds.forEach(id => {
      this.unregisterAnimation(id);
    });
  }

  cleanup() {
    this.activeAnimations.forEach(timeline => timeline.kill());
    this.activeAnimations.clear();
    
    this.activeScrollTriggers.forEach(trigger => trigger.kill());
    this.activeScrollTriggers = [];
  }

  getActiveAnimationsCount(): number {
    return this.activeAnimations.size;
  }

  getActiveScrollTriggersCount(): number {
    return this.activeScrollTriggers.length;
  }
}

// Animation optimization utilities
export class AnimationOptimizer {
  private static instance: AnimationOptimizer;
  private deviceCapabilities: DeviceCapabilities;
  private memoryManager: MemoryManager;

  private constructor() {
    this.deviceCapabilities = DeviceCapabilities.getInstance();
    this.memoryManager = MemoryManager.getInstance();
  }

  static getInstance(): AnimationOptimizer {
    if (!AnimationOptimizer.instance) {
      AnimationOptimizer.instance = new AnimationOptimizer();
    }
    return AnimationOptimizer.instance;
  }

  optimizeAnimation(vars: gsap.TweenVars): gsap.TweenVars {
    const settings = this.deviceCapabilities.getOptimalSettings();
    const { isLowEnd, isMobile } = this.deviceCapabilities.getCapabilities();

    // Reduce duration for low-end devices
    if (isLowEnd && vars.duration && vars.duration > 0.3) {
      vars.duration = 0.3;
    } else if (isMobile && vars.duration && vars.duration > 0.4) {
      vars.duration = 0.4;
    }

    // Simplify easing for low-end devices
    if (isLowEnd && vars.ease && typeof vars.ease === 'string') {
      if (vars.ease.includes('power4') || vars.ease.includes('back') || vars.ease.includes('elastic')) {
        vars.ease = 'power2.out';
      }
    }

    // Disable complex transforms for low-end devices
    if (isLowEnd) {
      if (vars.skewX || vars.skewY) {
        delete vars.skewX;
        delete vars.skewY;
      }
      if (vars.rotation && Math.abs(vars.rotation) > 10) {
        vars.rotation = vars.rotation > 0 ? 5 : -5;
      }
    }

    return vars;
  }

  optimizeStagger(stagger: number): number {
    const settings = this.deviceCapabilities.getOptimalSettings();
    return Math.min(stagger, settings.stagger);
  }

  shouldEnableParallax(): boolean {
    const settings = this.deviceCapabilities.getOptimalSettings();
    return settings.enableParallax;
  }

  shouldEnableComplexEffects(): boolean {
    const settings = this.deviceCapabilities.getOptimalSettings();
    return settings.enableComplexEffects;
  }

  getMaxElements(): number {
    const settings = this.deviceCapabilities.getOptimalSettings();
    return settings.maxElements;
  }
}

// Reduced motion utilities
export class ReducedMotionManager {
  private static instance: ReducedMotionManager;
  private prefersReducedMotion: boolean = false;
  private mediaQuery: MediaQueryList | null = null;

  private constructor() {
    this.detectReducedMotionPreference();
  }

  static getInstance(): ReducedMotionManager {
    if (!ReducedMotionManager.instance) {
      ReducedMotionManager.instance = new ReducedMotionManager();
    }
    return ReducedMotionManager.instance;
  }

  private detectReducedMotionPreference() {
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = this.mediaQuery.matches;
      
      this.mediaQuery.addEventListener('change', (e) => {
        this.prefersReducedMotion = e.matches;
        this.handlePreferenceChange();
      });
    }
  }

  private handlePreferenceChange() {
    if (this.prefersReducedMotion) {
      // Disable all animations
      gsap.globalTimeline.pause();
      ScrollTrigger.getAll().forEach(trigger => trigger.disable());
    } else {
      // Re-enable animations
      gsap.globalTimeline.resume();
      ScrollTrigger.getAll().forEach(trigger => trigger.enable());
    }
  }

  shouldReduceMotion(): boolean {
    return this.prefersReducedMotion;
  }

  createReducedMotionAnimation(target: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween {
    if (this.prefersReducedMotion) {
      // Only animate opacity for reduced motion
      return gsap.to(target, {
        opacity: 1,
        duration: 0.1,
        ease: 'none',
      });
    }
    
    return gsap.to(target, vars);
  }
}

// Performance-aware animation creator
export const createPerformanceOptimizedAnimation = (
  target: gsap.TweenTarget,
  vars: gsap.TweenVars,
  options?: {
    id?: string;
    register?: boolean;
  }
) => {
  const optimizer = AnimationOptimizer.getInstance();
  const reducedMotionManager = ReducedMotionManager.getInstance();
  const memoryManager = MemoryManager.getInstance();

  // Optimize animation based on device capabilities
  const optimizedVars = optimizer.optimizeAnimation({ ...vars });

  // Handle reduced motion preference
  if (reducedMotionManager.shouldReduceMotion()) {
    return reducedMotionManager.createReducedMotionAnimation(target, optimizedVars);
  }

  // Create animation
  const animation = gsap.to(target, optimizedVars);

  // Register for memory management
  if (options?.register && options?.id) {
    memoryManager.registerAnimation(options.id, animation);
  }

  return animation;
};

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const monitor = new PerformanceMonitor();
  
  return {
    startMonitoring: () => monitor.startMonitoring(),
    stopMonitoring: () => monitor.stopMonitoring(),
    getFrameRate: () => monitor.getFrameRate(),
    getDroppedFrames: () => monitor.getDroppedFrames(),
    reset: () => monitor.reset(),
  };
};

// Device capabilities hook
export const useDeviceCapabilities = () => {
  const capabilities = DeviceCapabilities.getInstance();
  
  return {
    capabilities: capabilities.getCapabilities(),
    optimalSettings: capabilities.getOptimalSettings(),
    shouldReduceAnimations: capabilities.shouldReduceAnimations(),
  };
};

// Memory management hook
export const useMemoryManagement = () => {
  const memoryManager = MemoryManager.getInstance();
  
  return {
    registerAnimation: (id: string, timeline: gsap.core.Timeline) => 
      memoryManager.registerAnimation(id, timeline),
    unregisterAnimation: (id: string) => 
      memoryManager.unregisterAnimation(id),
    registerScrollTrigger: (trigger: ScrollTrigger) => 
      memoryManager.registerScrollTrigger(trigger),
    unregisterScrollTrigger: (trigger: ScrollTrigger) => 
      memoryManager.unregisterScrollTrigger(trigger),
    cleanup: () => memoryManager.cleanup(),
    getActiveAnimationsCount: () => memoryManager.getActiveAnimationsCount(),
    getActiveScrollTriggersCount: () => memoryManager.getActiveScrollTriggersCount(),
  };
};

// Reduced motion hook
export const useReducedMotion = () => {
  const reducedMotionManager = ReducedMotionManager.getInstance();
  
  return {
    shouldReduceMotion: () => reducedMotionManager.shouldReduceMotion(),
    createReducedMotionAnimation: (target: gsap.TweenTarget, vars: gsap.TweenVars) =>
      reducedMotionManager.createReducedMotionAnimation(target, vars),
  };
};
