"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ConfirmationPage } from "@/components/ConfirmationPage";

interface ConfirmationRouteProps {
  params: {
    id: string;
  };
}

export default function ConfirmationRoute({ params }: ConfirmationRouteProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      // Page entrance animation
      gsap.fromTo(pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <ConfirmationPage />
    </div>
  );
}
