import React, { useEffect, useRef } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { useParallax } from '../lib/parallax-system';
import { PREMIUM_ANIMATIONS } from '../lib/animation-presets';
import { usePerformanceMonitoring, useDeviceCapabilities } from '../lib/performance-utils';

// Example component demonstrating the premium GSAP animation system
export const AnimationShowcase: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { startMonitoring, getFrameRate } = usePerformanceMonitoring();
  const { capabilities, optimalSettings } = useDeviceCapabilities();
  const { createParallax, createBrutalistParallax } = useParallax();

  // Hero section animations
  const { ref: heroAnimationRef, play: playHero } = useGSAP((tl) => {
    if (!heroRef.current) return;

    // Title reveal with brutalist effect
    const title = heroRef.current.querySelector('.hero-title');
    if (title) {
      tl.add(PREMIUM_ANIMATIONS.hero.titleReveal(title));
    }

    // Subtitle reveal
    const subtitle = heroRef.current.querySelector('.hero-subtitle');
    if (subtitle) {
      tl.add(PREMIUM_ANIMATIONS.hero.subtitleReveal(subtitle), '-=0.5');
    }

    // CTA button reveal
    const cta = heroRef.current.querySelector('.hero-cta');
    if (cta) {
      tl.add(PREMIUM_ANIMATIONS.hero.ctaReveal(cta), '-=0.3');
    }

    // Background reveal
    const background = heroRef.current.querySelector('.hero-background');
    if (background) {
      tl.add(PREMIUM_ANIMATIONS.hero.backgroundReveal(background), 0);
    }
  }, []);

  // Product cards animations
  const { ref: cardsAnimationRef, play: playCards } = useGSAP((tl) => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.product-card');
    
    cards.forEach((card, index) => {
      tl.add(PREMIUM_ANIMATIONS.productCard.cardEnter(card), index * 0.1);
    });
  }, []);

  // Text animations
  const { ref: textAnimationRef, play: playText } = useGSAP((tl) => {
    if (!textRef.current) return;

    const textElements = textRef.current.querySelectorAll('.text-element');
    
    textElements.forEach((element, index) => {
      tl.add(PREMIUM_ANIMATIONS.text.splitTextReveal([element]), index * 0.05);
    });
  }, []);

  // Parallax effects
  useEffect(() => {
    if (!heroRef.current) return;

    const background = heroRef.current.querySelector('.hero-background');
    const foreground = heroRef.current.querySelector('.hero-foreground');
    const text = heroRef.current.querySelector('.hero-text');

    if (background) {
      createParallax(background, 0.5, 'vertical');
    }
    if (foreground) {
      createParallax(foreground, 1, 'vertical');
    }
    if (text) {
      createParallax(text, 1.5, 'vertical');
    }
  }, [createParallax]);

  // Brutalist parallax for cards
  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.product-card');
    createBrutalistParallax(Array.from(cards), 'normal');
  }, [createBrutalistParallax]);

  // Performance monitoring
  useEffect(() => {
    startMonitoring();
    
    const interval = setInterval(() => {
      const frameRate = getFrameRate();
      if (frameRate < 30) {
        console.warn('Low frame rate detected:', frameRate);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startMonitoring, getFrameRate]);

  // Play animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      playHero();
      playCards();
      playText();
    }, 100);

    return () => clearTimeout(timer);
  }, [playHero, playCards, playText]);

  return (
    <div className="animation-showcase">
      {/* Performance Info */}
      <div className="performance-info">
        <p>Device: {capabilities.isMobile ? 'Mobile' : 'Desktop'}</p>
        <p>Low End: {capabilities.isLowEnd ? 'Yes' : 'No'}</p>
        <p>Optimal Duration: {optimalSettings.duration}s</p>
        <p>Max Elements: {optimalSettings.maxElements}</p>
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="hero-section"
        style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}
      >
        <div className="hero-background" style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          background: 'linear-gradient(45deg, #8BC34A, #000000)',
          opacity: 0.8
        }} />
        
        <div className="hero-foreground" style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 2
        }}>
          <h1 className="hero-title" style={{ 
            fontSize: '4rem', 
            color: 'white', 
            textAlign: 'center',
            marginBottom: '1rem',
            fontFamily: 'Impact, Arial Black, sans-serif'
          }}>
            ENSA OFFLINE
          </h1>
          
          <p className="hero-subtitle" style={{ 
            fontSize: '1.5rem', 
            color: 'white', 
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            grace under pressure
          </p>
          
          <button className="hero-cta" style={{ 
            padding: '1rem 2rem',
            backgroundColor: '#8BC34A',
            color: 'black',
            border: '3px solid black',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'block',
            margin: '0 auto'
          }}>
            EXPLORE COLLECTION
          </button>
        </div>
      </section>

      {/* Product Cards Section */}
      <section 
        ref={cardsRef} 
        className="cards-section"
        style={{ padding: '4rem 2rem', backgroundColor: '#f5f5f5' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
          PREMIUM PRODUCTS
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="product-card" 
              style={{ 
                backgroundColor: 'white',
                padding: '2rem',
                border: '6px solid black',
                borderRadius: '0',
                boxShadow: '8px 8px 0px 0px #000000',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                width: '100%', 
                height: '200px', 
                backgroundColor: '#8BC34A',
                marginBottom: '1rem',
                border: '3px solid black'
              }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                Product {i}
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                Premium quality brutalist design
              </p>
              <button style={{ 
                width: '100%',
                padding: '0.8rem',
                backgroundColor: '#8BC34A',
                color: 'black',
                border: '3px solid black',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                ADD TO CART
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Text Animation Section */}
      <section 
        ref={textRef} 
        className="text-section"
        style={{ padding: '4rem 2rem', backgroundColor: 'white' }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="text-element" style={{ 
            fontSize: '2.5rem', 
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            ANIMATION SYSTEM
          </h2>
          
          <p className="text-element" style={{ 
            fontSize: '1.2rem', 
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            This premium animation system provides smooth, high-quality animations 
            optimized for all devices and accessibility preferences.
          </p>
          
          <p className="text-element" style={{ 
            fontSize: '1.2rem', 
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            Features include performance monitoring, reduced motion support, 
            memory management, and brutalist-themed effects perfect for ENSA OFFLINE.
          </p>
          
          <div className="text-element" style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            marginTop: '2rem'
          }}>
            <button style={{ 
              padding: '0.8rem 1.5rem',
              backgroundColor: '#8BC34A',
              color: 'black',
              border: '3px solid black',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              LEARN MORE
            </button>
            <button style={{ 
              padding: '0.8rem 1.5rem',
              backgroundColor: 'transparent',
              color: 'black',
              border: '3px solid black',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              VIEW CODE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Example of using individual animation hooks
export const IndividualAnimationExample: React.FC = () => {
  const { ref, play, pause, reverse } = useGSAP((tl) => {
    tl.fromTo(ref.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  return (
    <div ref={ref} style={{ padding: '2rem', backgroundColor: '#f0f0f0' }}>
      <h3>Individual Animation Example</h3>
      <p>This component demonstrates individual animation control.</p>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={play} style={{ marginRight: '0.5rem' }}>Play</button>
        <button onClick={pause} style={{ marginRight: '0.5rem' }}>Pause</button>
        <button onClick={reverse}>Reverse</button>
      </div>
    </div>
  );
};

// Example of using page transitions
export const PageTransitionExample: React.FC = () => {
  const { brutalTo, slideTo, fadeTo } = usePageTransition();

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Page Transition Examples</h3>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={() => brutalTo('/products', 'right')}>
          Brutal Slide Right
        </button>
        <button onClick={() => slideTo('/about', 'left')}>
          Slide Left
        </button>
        <button onClick={() => fadeTo('/contact')}>
          Fade Transition
        </button>
      </div>
    </div>
  );
};
