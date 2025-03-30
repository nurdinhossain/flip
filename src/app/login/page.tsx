'use client';

import { Suspense } from 'react';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [callbackUrl, setCallbackURL] = useState<string>('/monitor')
  const [errorMessage, setErrorMessage] = useState<string>('Please input valid data')
  const [isPending, setIsPending] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch('/api/getUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (data.success) {
        router.push('/monitor');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center text-center absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
      <div className="flex flex-col basis-md h-screen justify-center">
        <h1 className="font-bold text-6xl text-white mb-2">flip.</h1>
        <h2 className="font-bold text-3xl text-white mb-10">The better way to dispose.</h2>

        {/* Login box */}
        <Suspense>
          <form onSubmit={handleSubmit} className="border-2 border-solid rounded-sm p-4 bg-white text-xl">
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
                value={username} // Controlled input
                onChange={(e) => setUsername(e.target.value)}
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
                value={password} // Controlled input
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit & Forgot password */}
            <div className="flex items-center justify-between mt-6">
              <input type="hidden" name="redirectTo" value={callbackUrl} />
              <button
                aria-disabled={isLoading}
                className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
          </form>
        </Suspense>
      </div>
    </div>
  );
}