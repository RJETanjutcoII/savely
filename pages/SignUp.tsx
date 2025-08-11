"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/utils/supabase/client";
import { SignUpSchema, type SignUpInput } from "@/utils/validation/signUp";

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "error";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({ resolver: zodResolver(SignUpSchema), mode: "onBlur" });

  const [usernameStatus, setUsernameStatus] = React.useState<UsernameStatus>("idle");
  const [success, setSuccess] = React.useState(false);
  const usernameValue = watch("username");
  const debounceRef = React.useRef<number | null>(null);

  // Debounced async username availability check (UX only; DB is still the source of truth later)
  React.useEffect(() => {
    // clear previous debounce
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    // basic guard: if empty or invalid per Zod shape, don't call RPC
    const parsed = (SignUpSchema.shape as any).username.safeParse?.(usernameValue);
    const looksValid = parsed ? parsed.success : Boolean(usernameValue);

    if (!usernameValue || !looksValid) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    debounceRef.current = window.setTimeout(async () => {
      try {
        const { data, error } = await supabase.rpc("is_username_available", { u: usernameValue });
        if (error || typeof data !== "boolean") {
          setUsernameStatus("error");
          return;
        }
        setUsernameStatus(data ? "available" : "taken");
      } catch {
        setUsernameStatus("error");
      }
    }, 450); // ~half-second debounce
  }, [usernameValue]);

  const onSubmit = async ({ email, password, username }: SignUpInput) => {
    // If we already know it's taken from the async check, block early
    if (usernameStatus === "taken") {
      setError("username", { message: "That username is already taken." });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }, // store username in metadata for later profile creation
    });

    if (error) {
      const msg = error.message.toLowerCase();
      setSuccess(false);
      setError(
        "email",
        { message: msg.includes("already") && msg.includes("register") ? "That email is already in use." : error.message },
      );
      return;
    }

    setSuccess(true);
    // Optional: localStorage.setItem("pending_username", username);
  };

  const pending = isSubmitting;

  return (
    <section className="mt-20 mx-80 h-full">
      <h1 className="text-7xl font-extrabold bg-gradient-to-r from-blue-950 to-violet-700 text-transparent bg-clip-text pb-5">
        Sign Up
      </h1>

      <form className="text-3xl" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="border block mt-1 pl-2 h-12 rounded-md w-105"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="mt-2 text-base text-red-600">{errors.email.message}</p>}
        <div className="mb-6" />

        {/* Username */}
        <label htmlFor="username">Username</label>
        <input
          id="username"
          className="border block mt-1 pl-2 h-12 rounded-md w-105"
          autoCapitalize="none"
          {...register("username")}
          aria-invalid={!!errors.username}
        />
        {/* Inline username status helper */}
        {!errors.username && usernameValue && (
          <p className="mt-2 text-base">
            {usernameStatus === "checking" && "Checking username…"}
            {usernameStatus === "available" && <span className="text-green-700">Looks good ✓</span>}
            {usernameStatus === "taken" && <span className="text-red-600">That username is already taken.</span>}
            {usernameStatus === "error" && <span className="text-gray-600">Can’t check right now.</span>}
          </p>
        )}
        {errors.username && <p className="mt-2 text-base text-red-600">{errors.username.message}</p>}
        <div className="mb-6" />

        {/* Password */}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="border block mt-1 pl-2 h-12 rounded-md w-105"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="mt-2 text-base text-red-600">{errors.password.message}</p>
        )}

        <div className="mt-10">
          <button
            type="submit"
            disabled={pending}
            className="px-10 bg-blue-800 rounded-xl text-white font-bold py-3 disabled:opacity-60"
          >
            {pending ? "Creating..." : "Sign Up"}
          </button>
        </div>

        {success && (
          <p className="mt-4 text-xl text-green-700">Check your email to confirm your account.</p>
        )}
      </form>
    </section>
  );
}
