'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function Home() {

  const router = useRouter();

  useEffect(() => {
      router.push("/login");
    }, []);

  return (
    <div>
      {/* Hello world! */}
    </div>
  );
}
