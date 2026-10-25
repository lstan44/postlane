import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Postlane — Social publishing, in sync',
  description:
    'Plan and publish social content across your channels from one workspace.',
};

const plans = [
  { name: 'Starter', price: '$19', channels: '5 social channels' },
  { name: 'Growth', price: '$49', channels: '25 social channels' },
];

export default function HomePage() {
  const sourceRevision = process.env.NEXT_PUBLIC_SOURCE_REVISION || 'main';
  return (
    <main className="min-h-screen bg-[#0b1020] px-5 text-white sm:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-7">
        <Link href="/" className="text-2xl font-bold tracking-tight">Postlane</Link>
        <nav className="flex items-center gap-5 text-sm text-white/75">
          <a href="#pricing">Pricing</a>
          <Link href="/privacy">Privacy</Link>
          <Link href="/auth/login" className="rounded-lg bg-white px-4 py-2 font-semibold text-slate-950">Sign in</Link>
        </nav>
      </header>
      <section className="mx-auto grid max-w-6xl gap-12 py-24 md:grid-cols-[1.2fr_.8fr] md:py-36">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[.2em] text-cyan-300">Social publishing, in sync</p>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">One clear lane from draft to published.</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">Plan content, coordinate channels, and schedule your publishing from one workspace built for teams that move.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/auth/login" className="rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950">Sign in</Link>
            <a href="#pricing" className="rounded-xl border border-white/20 px-6 py-3 font-semibold">See plans</a>
          </div>
          <p className="mt-4 text-sm text-white/50">Paid signup is not open yet. Existing users can sign in.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-300/15 to-indigo-400/10 p-8">
          <div className="text-sm text-cyan-200">Your publishing workspace</div>
          <div className="mt-8 space-y-4">
            {['Draft once', 'Coordinate every channel', 'Publish on your schedule'].map((item, i) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan-300/20 text-cyan-200">{i + 1}</span>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="pricing" className="mx-auto max-w-6xl py-16">
        <div className="mb-10 text-center"><p className="text-sm font-semibold uppercase tracking-[.2em] text-cyan-300">Planned monthly pricing</p><h2 className="mt-3 text-4xl font-bold">Room to publish more</h2><p className="mt-3 text-white/60">Plans will be available after billing and channel integrations are ready.</p></div>
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-2xl border border-white/15 bg-white/[.04] p-8">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-5 text-5xl font-bold">{plan.price}<span className="text-base font-normal text-white/55"> / month</span></p>
              <p className="mt-3 text-white/70">{plan.channels}</p>
              <p className="mt-2 text-sm text-white/50">Planned: seven-day trial · card required · cancel anytime</p>
              <Link href="mailto:support@postlane.fyi" className="mt-7 block rounded-xl bg-white px-5 py-3 text-center font-semibold text-slate-950">Get launch updates</Link>
            </article>
          ))}
        </div>
      </section>
      <footer className="mx-auto mt-16 flex max-w-6xl flex-wrap gap-x-6 gap-y-3 border-t border-white/10 py-8 text-sm text-white/55">
        <span>© {new Date().getFullYear()} Socia Growth Metrics</span><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/data-deletion">Data deletion</Link><a href="mailto:support@postlane.fyi">Support</a><a href={`https://github.com/lstan44/postlane/tree/${sourceRevision}`}>Source code</a>
      </footer>
    </main>
  );
}
