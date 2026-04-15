export function ScreenPlaceholder({ title }: { title: string }) {
  return (
    <main
      className="min-h-dvh p-4"
      style={{
        background: "var(--color-bg)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <h1
        className="font-semibold"
        style={{ fontSize: "var(--text-xl)", color: "var(--color-text-primary)" }}
      >
        {title}
      </h1>
      <p className="mt-2" style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        Placeholder
      </p>
    </main>
  );
}
