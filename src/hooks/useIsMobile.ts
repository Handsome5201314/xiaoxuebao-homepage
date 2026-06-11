import { useState, useEffect } from 'react'

/**
 * Detects if the current device is mobile based on screen width + touch capability.
 * Updates on resize for responsive behavior.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint || ('ontouchstart' in window && window.innerWidth < 1024)
  })

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    setIsMobile(mql.matches)
    return () => mql.removeEventListener('change', handler)
  }, [breakpoint])

  return isMobile
}
