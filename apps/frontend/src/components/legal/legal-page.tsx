import Link from 'next/link';
import { ReactNode } from 'react';

export function LegalPage({
  title,
  updated = 'October 22, 2026',
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#111] px-5 py-12 text-white sm:px-8">
      <article className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#191919] p-6 sm:p-10">
        <Link className="text-sm text-blue-300 hover:underline" href="/">
          Postlane
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-white/60">Last updated: {updated}</p>
        <div className="legal-copy mt-8 space-y-7 text-[15px] leading-7 text-white/80">
          {children}
        </div>
        <nav aria-label="Legal pages" className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-sm text-blue-300">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/data-deletion">Data deletion</Link>
          <a href={`https://github.com/lstan44/postlane/tree/${process.env.NEXT_PUBLIC_SOURCE_REVISION || 'main'}`}>
            Source code
          </a>
          <a href="mailto:support@postlane.fyi">Contact support</a>
        </nav>
      </article>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}
