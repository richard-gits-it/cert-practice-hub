import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center mt-16">
      <div className="text-6xl font-mono font-extrabold text-accent-pink mb-2">404</div>
      <h2 className="text-white font-mono text-xl font-bold mb-2">Route Not Found</h2>
      <p className="text-gray-600 text-sm mb-6">
        That cert or page doesn&apos;t exist yet.
      </p>
      <Link
        href="/"
        className="inline-block bg-accent-cyan rounded-md px-6 py-3 text-bg-primary font-mono text-xs font-bold tracking-[1px] hover:brightness-110 transition-all"
      >
        ← BACK TO HOME
      </Link>
    </div>
  );
}
