import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    const over = () => setHovering(true)
    const out = () => setHovering(false)

    window.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, .fruit-card').forEach(el => {
      el.addEventListener('mouseenter', over)
      el.addEventListener('mouseleave', out)
    })

    // Re-run on DOM changes
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, .fruit-card').forEach(el => {
        el.addEventListener('mouseenter', over)
        el.addEventListener('mouseleave', out)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <motion.div
        className="cursor-dot"
        animate={{ x: pos.x - 4, y: pos.y - 4, scale: hovering ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="cursor-ring"
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          scale: hovering ? 1.8 : 1,
          borderColor: hovering ? 'rgba(255,107,107,0.6)' : 'rgba(255,255,255,0.3)',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
    </>
  )
}
