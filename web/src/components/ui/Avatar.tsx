export function Avatar({ initials }: { initials: string }) {
  return (
    <span
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{
        background:
          'linear-gradient(135deg, var(--color-rose-voile), var(--color-gel-rose))',
      }}
    >
      {initials}
    </span>
  );
}
