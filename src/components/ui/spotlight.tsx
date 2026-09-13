'use client'
import { motion, useSpring, useTransform, type SpringOptions } from 'framer-motion'
import React, { useRef, useState, useCallback, useEffect } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

export function Spotlight({ className, size = 220, springOptions = { bounce: 0 } }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Use reduced motion settings if user prefers it
  const finalSpringOptions = prefersReducedMotion 
    ? { bounce: 0, damping: 50, stiffness: 100 } // Much less bouncy
    : springOptions

  const mouseX = useSpring(0, finalSpringOptions)
  const mouseY = useSpring(0, finalSpringOptions)

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`)
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`)

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement
      if (parent) {
        parent.style.position = 'relative'
        parent.style.overflow = 'hidden'
        setParentElement(parent)
      }
    }
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!parentElement) return
    const { left, top } = parentElement.getBoundingClientRect()
    mouseX.set(event.clientX - left)
    mouseY.set(event.clientY - top)
  }, [mouseX, mouseY, parentElement])

  useEffect(() => {
    if (!parentElement) return
    const enter = () => setIsHovered(true)
    const leave = () => setIsHovered(false)

    parentElement.addEventListener('mousemove', handleMouseMove)
    parentElement.addEventListener('mouseenter', enter)
    parentElement.addEventListener('mouseleave', leave)

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove)
      parentElement.removeEventListener('mouseenter', enter)
      parentElement.removeEventListener('mouseleave', leave)
    }
  }, [parentElement, handleMouseMove])

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full blur-2xl transition-opacity duration-200',
        // very subtle ink-spot radial with low opacity to avoid brown tinting on cream
        'bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03),transparent_70%)]',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft as any,
        top: spotlightTop as any,
      }}
      // Respect reduced motion preferences
      animate={prefersReducedMotion ? false : undefined}
      transition={prefersReducedMotion ? { duration: 0 } : undefined}
    />
  )
}
