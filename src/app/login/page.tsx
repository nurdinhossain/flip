'use client';

import { Suspense } from 'react';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';

export default function Login() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/monitor';
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="flex justify-center text-center absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
      <div className="flex flex-col basis-md h-screen justify-center">
        <h1 className="font-bold text-6xl text-white mb-2">flip.</h1>
        <h2 className="font-bold text-3xl text-white mb-10">The better way to dispose.</h2>

        {/* Login box */}
        <Suspense>
          <form action={formAction} className="border-2 border-solid rounded-sm p-4 bg-white text-xl">
            {/* Title */}
            <h2 className="font-bold text-3xl mb-4">Login</h2>

            {/* User & Pass */}
            <div className="text-left mb-4">
              <label htmlFor="username" className="block font-bold mb-2">Username:</label>
              <input
                name="username"
                className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                required
              />
            </div>
            <div className="text-left">
              <label htmlFor="password" className="block font-bold mb-2">Password:</label>
              <input
                name="password"
                className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            {/* Submit & Forgot password */}
            <div className="flex items-center justify-between mt-6">
              <input type="hidden" name="redirectTo" value={callbackUrl} />
              <button
                aria-disabled={isPending}
                className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}
            </div>
          </form>
        </Suspense>
      </div>
    </div>
  );
}