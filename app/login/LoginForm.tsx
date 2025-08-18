// app/login/LoginForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/utils/supabase/client";
import { ensureProfileFromMetadata } from "@/utils/validation/ensureProfile";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
type LoginInput = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema), mode: "onBlur" });

  const [success, setSuccess] = React.useState(false);

  const onSubmit = async ({ email, password }: LoginInput) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const msg = error.message.toLowerCase();
      setSuccess(false);
      setError("email", {
        message: /invalid login|invalid.*credentials|email.*not.*found/i.test(msg)
          ? "Invalid email or password."
          : error.message,
      });
      return;
    }

    try {
      await ensureProfileFromMetadata();
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.warn("Profile ensure failed:", e.message);
      } else {
        console.warn("Profile ensure failed:", String(e));
      }
    }

    setSuccess(true);
    
    await new Promise((r) => setTimeout(r, 500));
    await supabase.auth.getSession();

    router.replace("/");
    router.refresh();
  }

  return (
    <section className="mt-20 mx-80 h-full">
      <h1 className="text-7xl font-extrabold bg-gradient-to-r from-blue-950 to-violet-700 text-transparent bg-clip-text pb-5">
        Log In
      </h1>

      <form className="text-3xl" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="border block mt-1 px-2 py-2 rounded-md"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="mt-2 text-base text-red-600">{errors.email.message}</p>}
        <div className="mb-6" />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="border block mt-1 px-2 py-2 rounded-md"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="mt-2 text-base text-red-600">{errors.password.message}</p>
        )}

        <div className="mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 bg-blue-800 rounded-xl text-white font-bold py-3 disabled:opacity-60 mb-40"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </div>

        {success && <p className="mt-4 text-xl text-green-700">Logged in! Redirecting…</p>}
      </form>
    </section>
  );
}
