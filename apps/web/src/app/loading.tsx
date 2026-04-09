export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: 'var(--accent)',
            borderRightColor: 'var(--accent2)',
          }}
        />
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
