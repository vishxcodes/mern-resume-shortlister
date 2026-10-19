export default function Layout({ title, children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#09090b] text-zinc-100 flex flex-col justify-center">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Subtle top glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-zinc-800/20 blur-3xl rounded-full pointer-events-none" />

      {/* Page content */}
      <div className="relative z-10 px-4 pt-24 pb-16 w-full max-w-md mx-auto">
        {title && <h1 className="sr-only">{title}</h1>}
        {children}
      </div>
    </div>
  );
}
