export default function Layout({ title, children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0b0e14]">
      
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Slight vignette for depth */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Page content */}
      <div className="relative z-10 px-4 py-12">
        {title && <h1 className="sr-only">{title}</h1>}
        {children}
      </div>
    </div>
  );
}
