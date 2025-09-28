"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isLoading, user } = useAuth();
  const router = useRouter();
  
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/admin/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!formRef.current) return;

    // Simple CSS animation instead of GSAP
    formRef.current.style.opacity = '0';
    formRef.current.style.transform = 'translateY(30px) scale(0.95)';
    
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.style.transition = 'all 0.8s ease';
        formRef.current.style.opacity = '1';
        formRef.current.style.transform = 'translateY(0) scale(1)';
      }
    }, 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      if (success) {
        // Simple success animation
        if (formRef.current) {
          formRef.current.style.transition = 'all 0.5s ease';
          formRef.current.style.opacity = '0';
          formRef.current.style.transform = 'scale(0.95)';
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 500);
        }
      } else {
        setError("Invalid credentials");
        // Simple error animation
        if (errorRef.current) {
          errorRef.current.style.opacity = '0';
          errorRef.current.style.transform = 'translateX(-10px)';
          setTimeout(() => {
            if (errorRef.current) {
              errorRef.current.style.transition = 'all 0.3s ease';
              errorRef.current.style.opacity = '1';
              errorRef.current.style.transform = 'translateX(0)';
            }
          }, 10);
        }
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldFocus = (fieldRef: React.RefObject<HTMLInputElement>) => {
    if (fieldRef.current) {
      fieldRef.current.style.transition = 'transform 0.2s ease';
      fieldRef.current.style.transform = 'scale(1.02)';
    }
  };

  const handleFieldBlur = (fieldRef: React.RefObject<HTMLInputElement>) => {
    if (fieldRef.current) {
      fieldRef.current.style.transition = 'transform 0.2s ease';
      fieldRef.current.style.transform = 'scale(1)';
    }
  };

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  if (!isLoading && user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Go Back Button */}
        <div className="mb-6">
          <Link href="/">
            <button className="inline-flex items-center gap-2 bg-black text-white border-4 shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold text-sm uppercase tracking-wider py-3 px-4">
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
              Go Back
            </button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-black mb-4">
            Admin Login
          </h1>
          <p className="text-lg text-brand-accent font-bold">
            ENSA OFFLINE Dashboard
          </p>
        </div>

        {/* Login Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Username
            </label>
            <input
              ref={usernameRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => handleFieldFocus(usernameRef)}
              onBlur={() => handleFieldBlur(usernameRef)}
              className="w-full px-4 py-3 border-6 shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black placeholder-gray-500"
              placeholder="Enter username"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFieldFocus(passwordRef)}
              onBlur={() => handleFieldBlur(passwordRef)}
              className="w-full px-4 py-3 border-6 shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black placeholder-gray-500"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div ref={errorRef} className="bg-red-100 border-3 border-red-500 text-red-700 px-4 py-3 font-bold text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-brand-green text-black border-6 shadow-brutalLg hover:shadow-brutalMd transition-all duration-300 font-display font-bold text-lg uppercase tracking-wider py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isLoading ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 bg-black text-white p-4 border-6 shadow-brutal">
          <h3 className="text-sm font-display font-bold uppercase tracking-tight mb-2">
            Demo Credentials
          </h3>
          <div className="text-xs space-y-1">
            <div><strong>Username:</strong> admin</div>
            <div><strong>Password:</strong> ensa2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}
