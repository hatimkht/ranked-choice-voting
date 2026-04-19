import { useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import FruitCard from '../components/FruitCard'
import fruits from '../data/fruits'

export default function Catalog() {
  const [filter, setFilter] = useState('all')

  const categories = [
    { key: 'all', label: 'Alle' },
    { key: 'suess', label: 'Süß' },
    { key: 'sauer', label: 'Sauer' },
    { key: 'tropisch', label: 'Tropisch' },
  ]

  const categoryMap = {
    suess: ['apfel', 'mango', 'pfirsich', 'wassermelone'],
    sauer: ['zitrone', 'kiwi', 'blaubeere'],
    tropisch: ['mango', 'drachenfrucht', 'kiwi'],
  }

  const filtered = filter === 'all'
    ? fruits
    : fruits.filter(f => categoryMap[filter]?.includes(f.id))

  return (
    <PageTransition>
      <section className="page-hero">
        <motion.p
          className="section-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Kollektion
        </motion.p>
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Alle <span className="gradient-text">Früchte</span>
        </motion.h1>
        <motion.p
          className="page-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Unsere kuratierte Sammlung der faszinierendsten Früchte der Welt.
        </motion.p>
      </section>

      <section className="section">
        <div className="section-inner">
          <motion.div
            className="filter-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`filter-btn ${filter === cat.key ? 'active' : ''}`}
                onClick={() => setFilter(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
          <motion.div
            className="fruit-grid full"
            layout
          >
            {filtered.map((fruit, i) => (
              <FruitCard key={fruit.id} fruit={fruit} index={i} />
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
