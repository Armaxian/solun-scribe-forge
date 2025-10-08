import { cn } from '@/lib/utils'

export function Manuscript({ children, className }: React.PropsWithChildren<{className?: string}>) {
  return (
    <section
      className={cn(
        // centered paper page with deckled shadow
        'relative mx-auto my-12 max-w-[78ch] rounded-[18px] bg-white/92',
        'shadow-[0_2px_40px_rgba(0,0,0,0.06)] ring-1 ring-black/8',
        'px-6 py-8 md:px-8 md:py-10',
        className
      )}
      style={{
        backdropFilter: 'saturate(1.1) blur(1px)',
      }}
    >
      {/* margin line */}
      <div aria-hidden className="absolute left-10 top-0 h-full w-px bg-[rgba(255,0,0,0.18)]" />
      {/* ghost annotations (appear on hover) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
        <svg className="absolute right-8 top-10 h-6 w-6 text-[rgba(0,0,255,0.2)]" viewBox="0 0 24 24" fill="none">
          <path d="M3 21l3-1 12-12-2-2L4 18l-1 3z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <div className="absolute left-[3.2rem] top-[28%] text-[rgba(0,0,255,0.28)] italic text-xs">tighten this</div>
      </div>
      {children}
    </section>
  )
}
