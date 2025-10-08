import { cn } from '@/lib/utils'

export function CatalogCard({ title, children, className }: React.PropsWithChildren<{title:string, className?:string}>) {
  return (
    <div
      className={cn(
        'relative rounded-xl bg-[#fffdf7] ring-1 ring-black/10 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_20px_rgba(0,0,0,0.04)]',
        'hover:shadow-[0_6px_40px_rgba(0,0,0,0.06)] transition-shadow', className
      )}
    >
      {/* hole punch notch */}
      <div aria-hidden className="absolute left-1/2 -top-2 h-4 w-7 -translate-x-1/2 rounded-b-[10px] bg-[var(--solun-cream)] ring-1 ring-black/10" />
      <div className="label-mono text-[var(--solun-green)] mb-2">Feature</div>
      <h3 className="typewriter text-xl mb-2">{title}</h3>
      <div className="text-black/75 leading-relaxed">{children}</div>
      {/* stamp on hover */}
      <div aria-hidden className="absolute right-3 bottom-3 rotate-[-8deg] text-[var(--solun-green)]/35 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        JUN 2025 · SOLUN
      </div>
    </div>
  )
}
