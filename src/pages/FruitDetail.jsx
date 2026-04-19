import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import fruits from '../data/fruits'

export default function FruitDetail() {
  const { id } = useParams()
  const fruit = fruits.find(f => f.id === id)

  if (!fruit) {
    return (
      <PageTransition>
        <section className="page-hero">
          <h1 className="page-title">Frucht nicht gefunden</h1>
          <Link to="/katalog" className="btn-primary">Zurück zum Katalog</Link>
        </section>
      </PageTransition>
    )
  }

  const others = fruits.filter(f => f.id !== id).slice(0, 3)

  return (
    <PageTransition>
      {/* Hero */}
      <section className="detail-hero">
        <motion.div
          className="detail-hero-shape"
          style={{
            background: `linear-gradient(135deg, ${fruit.gradient[0]}, ${fruit.gradient[1]})`,
          }}
          initial={{ scale: 0, borderRadius: '50%' }}
          animate={{ scale: 1, borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="detail-hero-content">
          <motion.span
            className="detail-emoji"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          >
            {fruit.emoji}
          </motion.span>
          <motion.h1
            className="detail-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {fruit.name}
          </motion.h1>
          <motion.p
            className="detail-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ color: fruit.color }}
          >
            {fruit.tagline}
          </motion.p>
        </div>
      </section>

      {/* Info */}
      <section className="section detail-info">
        <div className="section-inner">
          <div className="detail-grid">
            <motion.div
              className="detail-description"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Geschichte</h2>
              <p>{fruit.description}</p>
              <div className="detail-meta">
                <div className="meta-item">
                  <span className="meta-label">Herkunft</span>
                  <span className="meta-value">{fruit.origin}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Saison</span>
                  <span className="meta-value">{fruit.season}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="detail-nutrients"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2>Nährwerte</h2>
              <div className="nutrient-grid">
                {Object.entries(fruit.nutrients).map(([key, val]) => (
                  <motion.div
                    className="nutrient-card"
                    key={key}
                    whileHover={{ scale: 1.05, y: -4 }}
                    style={{ borderColor: fruit.color }}
                  >
                    <span className="nutrient-value">{val}</span>
                    <span className="nutrient-label">{key}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Facts */}
          <motion.div
            className="detail-facts"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Wusstest du?</h2>
            <div className="facts-list">
              {fruit.facts.map((fact, i) => (
                <motion.div
                  key={i}
                  className="fact-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <span className="fact-number" style={{ color: fruit.color }}>0{i + 1}</span>
                  <p>{fact}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Related */}
          <div className="detail-related">
            <h2>Entdecke auch</h2>
            <div className="related-grid">
              {others.map(f => (
                <Link key={f.id} to={`/frucht/${f.id}`} className="related-card">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="related-inner"
                    style={{ background: `linear-gradient(135deg, ${f.gradient[0]}, ${f.gradient[1]})` }}
                  >
                    <span className="related-emoji">{f.emoji}</span>
                    <span className="related-name">{f.name}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
