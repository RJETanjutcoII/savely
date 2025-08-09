"use client"

import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase/client'

type SignUpData = {
  email: string
  password: string
  username: string
}

async function signUp({ email, password, username}: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  })
  if (error) throw new Error(error.message)
  return data;
}

const SignUp = () => {

  const mutation = useMutation<any, Error, SignUpData>({
    mutationFn: signUp,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") || "")
    const password = String(fd.get("password") || "")
    const username = String(fd.get("username") || "")

    mutation.mutate({ email, password, username })
  }

  return (
    <section className="mt-20 mx-80 h-full">
        <h1 className="text-7xl font-extrabold text-black text-wrap w-200 bg-gradient-to-r from-blue-950 to-violet-700 text-transparent bg-clip-text pb-5">Sign Up</h1>
        <form className="text-3xl" onSubmit={handleSubmit}>

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="border block mt-1 mb-10 px-1 py-0.5 rounded-md" />
          
          <label htmlFor='username'>Username</label>
          <input id="username" name="username" type="text" className='border block mt-1 mb-10 px-1 py-0.5 rounded-md' />

          <label htmlFor='password'>Password</label>
          <input id="password" name="password" type="password" className='border block mt-1 mb-10 px-1 py-0.5 rounded-md' />

          <button type="submit" disabled={mutation.isPending} className="px-10 bg-blue-800 rounded-xl text-white font-bold py-3 disabled:opacity-60">
          {mutation.isPending ? "Creating..." : "Sign Up"}
          </button>

          {mutation.isError && <p className="mt-4 text-red-600 text-xl">{(mutation.error as Error).message}</p>}
          {mutation.isSuccess && <p className="mt-4 text-green-700 text-xl">Check your email to confirm your account.</p>}

        </form>
    </section>
  )
}

export default SignUp