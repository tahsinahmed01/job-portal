'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, Show, UserButton, useUser } from '@clerk/nextjs';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#search', label: 'Find Jobs' },
  { href: '/#companies', label: 'Companies' },
  { href: '/#post-job', label: 'Post a Job' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { user, isLoaded } = useUser();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (isLoaded && user && (user.publicMetadata?.role === 'ADMIN' || user.publicMetadata?.role === 'RECRUITER')) {
      fetch('/api/jobs/pending-count')
        .then(res => res.json())
        .then(data => setPendingCount(data.count || 0))
        .catch(console.error);
    }
  }, [isLoaded, user]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl'
          : 'border-b border-transparent bg-white/60 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-md shadow-indigo-500/25 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/35">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-white"
              aria-hidden="true"
            >
              <path
                d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <rect
                x="4"
                y="7"
                width="16"
                height="13"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M9 12h6M9 16h4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Hired
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              .
            </span>
          </span>
        </Link>

        {/* Center links — desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-indigo-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="hidden items-center gap-4 sm:flex">
          {pendingCount > 0 && user?.publicMetadata?.role && (user.publicMetadata.role === 'ADMIN' || user.publicMetadata.role === 'RECRUITER') && (
            <Link href={user.publicMetadata.role === 'ADMIN' ? '/admin' : '/dashboard'} className="relative inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            </Link>
          )}

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-100 hover:text-indigo-600"
              >
                Sign In
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/35"
              >
                Get Started
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton afterSignOutUrl="/" />
          </Show>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-all duration-300 hover:bg-slate-100 md:hidden"
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-xl md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-100 hover:text-indigo-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:hidden">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-100"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:shadow-lg"
                  >
                    Get Started
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton afterSignOutUrl="/" />
              </Show>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;
