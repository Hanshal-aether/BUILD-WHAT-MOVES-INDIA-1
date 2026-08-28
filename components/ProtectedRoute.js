'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_KEY = 'ration_saathi_logged_in';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const flag = window.localStorage.getItem(AUTH_KEY);
    if (flag === 'true') {
      setAuthed(true);
      setChecked(true);
    } else {
      router.replace('/login');
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100">
        <div className="w-8 h-8 rounded-full border-2 border-brand-300 border-t-brand-600 animate-spin" />
      </div>
    );
  }

  if (!authed) return null;

  return children;
}