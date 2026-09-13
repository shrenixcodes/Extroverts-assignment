import { useEffect, useRef } from 'react'

export function useFocusHeading<T extends HTMLElement>(dep: unknown) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const heading = ref.current
    if (!heading) return
    heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
  }, [dep])

  return ref
}
