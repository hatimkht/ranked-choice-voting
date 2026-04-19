import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const morphStages = [
  { emoji: '🍎', name: 'Apfel', color: '#FF6B6B', radius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
  { emoji: '🍐', name: 'Birne', color: '#A5D6A7', radius: '50% 50% 40% 40% / 60% 60% 40% 40%' },
  { emoji: '🍋', name: 'Zitrone', color: '#FDD835', radius: '50% 50% 50% 50% / 60% 60% 40% 40%' },
  { emoji: '🫐', name: 'Blaubeere', color: '#5C6BC0', radius: '50% 50% 50% 50% / 50% 50% 50% 50%' },
  { emoji: '🥭', name: 'Mango', color: '#FF8F00', radius: '60% 40% 50% 50% / 50% 60% 40% 50%' },
  { emoji: '🍑', name: 'Pfirsich', color: '#FF8A65', radius: '45% 55% 55% 45% / 55% 45% 45% 55%' },
]

export default function FruitMorph() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % morphStages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const stage = morphStages[current]

  return (
    <div className="fruit-morph-wrapper">
      <motion.div
        className="fruit-morph"
        animate={{
          borderRadius: stage.radius,
          backgroundColor: stage.color,
          boxShadow: `0 30px 120px ${stage.color}66, 0 0 200px ${stage.color}22`,
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            className="fruit-morph-emoji"
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {stage.emoji}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={stage.name}
          className="fruit-morph-label"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          style={{ color: stage.color }}
        >
          {stage.name}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
