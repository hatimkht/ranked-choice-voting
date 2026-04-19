import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import fruits from '../data/fruits'

// Fruit Juice Mixer - the creative surprise feature
export default function Playground() {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(3)
  const [mixing, setMixing] = useState(false)
  const [mixed, setMixed] = useState(null)
  const canvasRef = useRef(null)

  const fruitA = fruits[left]
  const fruitB = fruits[right]

  function handleMix() {
    setMixing(true)
    setMixed(null)
    setTimeout(() => {
      setMixed({
        name: `${fruitA.name}${fruitB.name.toLowerCase()}`,
        emoji: `${fruitA.emoji}✕${fruitB.emoji}`,
        color: blendColors(fruitA.color, fruitB.color),
        description: `Eine einzigartige Kreation aus ${fruitA.name} und ${fruitB.name} — ${fruitA.tagline.toLowerCase()} trifft auf ${fruitB.tagline.toLowerCase()}.`,
      })
      setMixing(false)
    }, 2000)
  }

  // Splatter animation on canvas
  useEffect(() => {
    if (!mixing || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    const particles = []
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: w / 2,
        y: h / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        r: Math.random() * 8 + 3,
        color: Math.random() > 0.5 ? fruitA.color : fruitB.color,
        alpha: 1,
      })
    }

    let frame
    function animate() {
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98
        p.alpha *= 0.97
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })
      ctx.globalAlpha = 1
      if (particles[0].alpha > 0.01) {
        frame = requestAnimationFrame(animate)
      }
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [mixing, fruitA, fruitB])

  return (
    <PageTransition>
      <section className="page-hero">
        <motion.p
          className="section-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Interaktiv
        </motion.p>
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Frucht <span className="gradient-text">Mixer</span>
        </motion.h1>
        <motion.p
          className="page-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Kombiniere zwei Früchte und entdecke, was passiert.
        </motion.p>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="mixer">
            {/* Left fruit picker */}
            <div className="mixer-side">
              <p className="mixer-label">Frucht A</p>
              <div className="mixer-picker">
                {fruits.map((f, i) => (
                  <motion.button
                    key={f.id}
                    className={`mixer-option ${i === left ? 'selected' : ''}`}
                    onClick={() => setLeft(i)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    style={i === left ? { borderColor: f.color, boxShadow: `0 0 20px ${f.color}44` } : {}}
                  >
                    {f.emoji}
                  </motion.button>
                ))}
              </div>
              <p className="mixer-selected-name">{fruitA.name}</p>
            </div>

            {/* Center mix button */}
            <div className="mixer-center">
              <canvas ref={canvasRef} className="mixer-canvas" />
              <motion.button
                className="mix-button"
                onClick={handleMix}
                disabled={mixing}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={mixing ? { rotate: 360 } : { rotate: 0 }}
                transition={mixing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                style={{
                  background: `linear-gradient(135deg, ${fruitA.color}, ${fruitB.color})`,
                }}
              >
                {mixing ? '🌀' : '✕'}
              </motion.button>
            </div>

            {/* Right fruit picker */}
            <div className="mixer-side">
              <p className="mixer-label">Frucht B</p>
              <div className="mixer-picker">
                {fruits.map((f, i) => (
                  <motion.button
                    key={f.id}
                    className={`mixer-option ${i === right ? 'selected' : ''}`}
                    onClick={() => setRight(i)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    style={i === right ? { borderColor: f.color, boxShadow: `0 0 20px ${f.color}44` } : {}}
                  >
                    {f.emoji}
                  </motion.button>
                ))}
              </div>
              <p className="mixer-selected-name">{fruitB.name}</p>
            </div>
          </div>

          {/* Result */}
          <AnimatePresence>
            {mixed && (
              <motion.div
                className="mixer-result"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, type: 'spring' }}
              >
                <div
                  className="result-card"
                  style={{ borderColor: mixed.color, boxShadow: `0 20px 80px ${mixed.color}33` }}
                >
                  <span className="result-emoji">{mixed.emoji}</span>
                  <h3 className="result-name" style={{ color: mixed.color }}>{mixed.name}</h3>
                  <p className="result-desc">{mixed.description}</p>
                  <div className="result-badge" style={{ backgroundColor: mixed.color }}>
                    Neue Kreation!
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  )
}

function blendColors(c1, c2) {
  const hex = s => parseInt(s, 16)
  const r = Math.round((hex(c1.slice(1, 3)) + hex(c2.slice(1, 3))) / 2)
  const g = Math.round((hex(c1.slice(3, 5)) + hex(c2.slice(3, 5))) / 2)
  const b = Math.round((hex(c1.slice(5, 7)) + hex(c2.slice(5, 7))) / 2)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
