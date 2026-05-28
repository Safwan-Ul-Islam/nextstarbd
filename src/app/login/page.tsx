"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Mode = "signin" | "signup" | "verify" | "forgot" | "verify-reset" | "success";

const inputClass = "w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white";

function LoginForm() {
  const { user, loading, signInWithEmail, initiateSignup, verifyOtp, resendOtp, sendPasswordResetOtp, resetPasswordWithOtp } = useAuth();
  const [localOverlay, setLocalOverlay] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-fill OTP from email link
  useEffect(() => {
    const urlEmail = searchParams.get("email");
    const urlOtp = searchParams.get("otp");
    const urlType = searchParams.get("type");
    if (urlEmail && urlOtp && urlOtp.length === 6) {
      setEmail(urlEmail);
      setOtpDigits(urlOtp.split(""));
      setMode(urlType === "password_reset" ? "verify-reset" : "verify");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [user, loading, next, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setInfo("");
    setEmail("");
    setPassword("");
    setDisplayName("");
    setOtpDigits(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
  };

  const showSuccess = (msg: string, redirectTo: string) => {
    setSuccessMsg(msg);
    setMode("success");
    setTimeout(() => router.replace(redirectTo), 2200);
  };

  const friendlyError = (msg: string) => {
    if (msg.includes("invalid-credential") || msg.includes("wrong-password") || msg.includes("user-not-found"))
      return "Incorrect email or password.";
    if (msg.includes("email-already-in-use")) return "An account with this email already exists.";
    if (msg.includes("weak-password")) return "Password must be at least 6 characters.";
    if (msg.includes("invalid-email")) return "Please enter a valid email address.";
    if (msg.includes("too-many-requests")) return "Too many attempts. Please try again later.";
    if (msg.includes("otp-expired")) return "The code expired. Please request a new one.";
    if (msg.includes("invalid-otp")) return "Incorrect code. Please try again.";
    if (msg.includes("no-account")) return "No account found with this email.";
    return "Something went wrong. Please try again.";
  };

  const handleForgotClick = () => {
    const savedEmail = email; // carry email over intentionally
    switchMode("forgot");
    setEmail(savedEmail); // restore only email, everything else stays cleared
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      setLocalOverlay("Welcome back! Taking you in…");
      await signInWithEmail(email, password);
      await new Promise((r) => setTimeout(r, 900));
      router.replace(next);
    } catch (err) {
      setLocalOverlay(null);
      setError(friendlyError((err as Error).message ?? ""));
      setBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await initiateSignup(email, password, displayName);
      setOtpDigits(["", "", "", "", "", ""]);
      switchMode("verify");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(friendlyError((err as Error).message ?? ""));
    } finally {
      setBusy(false);
    }
  };

  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setError(""); setBusy(true);
    try {
      await sendPasswordResetOtp(email);
      setOtpDigits(["", "", "", "", "", ""]);
      setNewPassword(""); setConfirmPassword("");
      switchMode("verify-reset");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(friendlyError((err as Error).message ?? ""));
    } finally {
      setBusy(false);
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setOtpDigits(pasted.split("")); otpRefs.current[5]?.focus(); }
  };

  const handleVerifySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length < 6) { setError("Please enter all 6 digits."); return; }
    setError(""); setBusy(true);
    try {
      await verifyOtp(email, otp);
      showSuccess("Your account has been created. Welcome to NexStarBD!", next);
    } catch (err) {
      setError(friendlyError((err as Error).message ?? ""));
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length < 6) { setError("Please enter all 6 digits."); return; }
    if (!newPassword) { setError("Please enter a new password."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setBusy(true);
    try {
      await resetPasswordWithOtp(email, otp, newPassword);
      showSuccess("Your password has been reset successfully. Signing you in…", next);
    } catch (err) {
      setError(friendlyError((err as Error).message ?? ""));
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(""); setInfo("");
    try {
      if (mode === "verify-reset") await sendPasswordResetOtp(email);
      else await resendOtp(email);
      setInfo("A new code has been sent.");
      setResendCooldown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError((err as Error).message || "Failed to resend.");
    }
  };

  const OtpBoxes = () => (
    <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
      {otpDigits.map((digit, i) => (
        <input key={i} ref={(el) => { otpRefs.current[i] = el; }}
          type="text" inputMode="numeric" maxLength={1} value={digit}
          onChange={(e) => handleOtpInput(i, e.target.value)}
          onKeyDown={(e) => handleOtpKeyDown(i, e)}
          className="w-11 text-center text-xl font-bold border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          style={{ height: "52px" }} />
      ))}
    </div>
  );

  const ResendButton = () => (
    <div className="text-center text-sm text-muted-foreground">
      Didn&apos;t get the code?{" "}
      <button type="button" onClick={handleResend} disabled={resendCooldown > 0}
        className="text-primary font-semibold hover:underline disabled:opacity-50">
        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!loading && user) return null;

  if (localOverlay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="flex items-center gap-0 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banners/lnsbd.png" alt="NexStarBD" style={{ height: "72px", width: "auto", transform: "translateY(-6px) translateX(6px)" }} />
          <span className="font-brand font-bold text-3xl tracking-wide">
            NexStar<span className="text-primary">B</span><span className="text-green-700">D</span>
          </span>
        </div>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">{localOverlay}</p>
      </div>
    );
  }

  // Success screen
  if (mode === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-foreground font-semibold text-base mb-1">{successMsg}</p>
          <p className="text-muted-foreground text-sm">Redirecting you now…</p>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-border p-8">

        {/* Logo */}
        <div className="text-center mb-7">
          <div className="flex items-center justify-center gap-0 mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/banners/lnsbd.png" alt="NexStarBD logo" style={{ height: "88px", width: "auto", display: "block", transform: "translateY(-8px) translateX(8px)" }} />
            <h1 className="font-brand font-bold text-3xl text-foreground tracking-wide">
              NexStar<span className="text-primary">B</span><span className="text-green-700">D</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "signin" && "Sign in to register for tournaments"}
            {mode === "signup" && "Create your player account"}
            {mode === "verify" && "Check your email for a code"}
            {mode === "forgot" && "Reset your password"}
            {mode === "verify-reset" && "Enter the code we sent you"}
          </p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">{error}</div>}
        {info && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm mb-4">{info}</div>}

        {/* Signup OTP verify */}
        {mode === "verify" && (
          <form onSubmit={handleVerifySignup} className="space-y-5">
            <p className="text-sm text-muted-foreground text-center">
              We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>
            </p>
            <OtpBoxes />
            <button type="submit" disabled={busy}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60">
              {busy ? "Verifying…" : "Verify Email"}
            </button>
            <ResendButton />
            <div className="text-center">
              <button type="button" onClick={() => switchMode("signup")} className="text-xs text-muted-foreground hover:underline">← Back</button>
            </div>
          </form>
        )}

        {/* Forgot — send OTP */}
        {mode === "forgot" && (
          <form onSubmit={handleSendResetOtp} className="space-y-4">
            {email ? (
              <p className="text-sm text-muted-foreground text-center">
                We&apos;ll send a reset code to <span className="font-semibold text-foreground">{email}</span>
              </p>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com" required className={inputClass} autoComplete="email" />
              </div>
            )}
            <button type="submit" disabled={busy}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60">
              {busy ? "Sending…" : "Send Reset Code"}
            </button>
            {email && (
              <div className="text-center text-xs text-muted-foreground">
                Wrong email?{" "}
                <button type="button" onClick={() => setEmail("")} className="text-primary hover:underline">Change it</button>
              </div>
            )}
            <div className="text-center">
              <button type="button" onClick={() => switchMode("signin")} className="text-xs text-muted-foreground hover:underline">← Back to Sign In</button>
            </div>
          </form>
        )}

        {/* Password reset OTP + new password */}
        {mode === "verify-reset" && (
          <form onSubmit={handleVerifyReset} className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Enter the code sent to <span className="font-semibold text-foreground">{email}</span>
            </p>
            <OtpBoxes />
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters" required className={inputClass} autoComplete="new-password" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password" required className={inputClass} autoComplete="new-password" />
            </div>
            <button type="submit" disabled={busy}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60">
              {busy ? "Resetting…" : "Reset Password"}
            </button>
            <ResendButton />
            <div className="text-center">
              <button type="button" onClick={() => switchMode("forgot")} className="text-xs text-muted-foreground hover:underline">← Back</button>
            </div>
          </form>
        )}

        {/* Sign in / Sign up */}
        {(mode === "signin" || mode === "signup") && (
          <form onSubmit={mode === "signup" ? handleSignUp : handleSignIn} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Your Name</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Safwan" className={inputClass} autoComplete="name" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com" required className={inputClass} autoComplete="email" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-foreground">Password</label>
                {mode === "signin" && (
                  <button type="button" onClick={handleForgotClick} className="text-xs text-primary hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "Min. 6 characters" : "Your password"}
                required className={inputClass}
                autoComplete={mode === "signup" ? "new-password" : "current-password"} />
            </div>
            <button type="submit" disabled={busy}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        )}

        {(mode === "signin" || mode === "signup") && (
          <div className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>Don&apos;t have an account?{" "}
                <button onClick={() => switchMode("signup")} className="text-primary font-semibold hover:underline">Create one</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => switchMode("signin")} className="text-primary font-semibold hover:underline">Sign in</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
