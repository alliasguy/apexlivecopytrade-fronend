import { useEffect } from 'react'

// Plain `overflow: hidden` on body doesn't reliably stop background
// scroll/rubber-banding on iOS Safari behind a position:fixed drawer.
// Pinning the body at its current scroll offset via position:fixed and
// restoring it (with the scroll position) on unlock works across engines.
const useBodyScrollLock = (locked) => {
  useEffect(() => {
    if (!locked) return

    const scrollY = window.scrollY
    const { position, top, width, overflow } = document.body.style

    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.position = position
      document.body.style.top = top
      document.body.style.width = width
      document.body.style.overflow = overflow
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}

export default useBodyScrollLock
