import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import ParticleCanvas from '../components/ParticleCanvas'
import FruitMorph from '../components/FruitMorph'
import FruitCard from '../components/FruitCard'
import fruits from '../data/fruits'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

export default function Landing() {
  const featured = fruits.slice(0, 4)

  return (
    <PageTransition>
      {/* HERO */}
      <section className="hero">
        <ParticleCanvas />
        <div className="hero-content">
          <motion.p
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Eine Hommage an die Natur
          </motion.p>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Die Kunst
            <br />
            der <span className="gradient-text">Früchte</span>
          </motion.h1>
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Entdecke Farben, Formen und Geschmäcker — <br />
            kuratiert wie eine Galerie.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="hero-cta"
          >
            <Link to="/katalog" className="btn-primary">Kollektion entdecken</Link>
            <Link to="/playground" className="btn-ghost">Spielen →</Link>
          </motion.div>
        </div>
        <motion.div
          className="hero-morph"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <FruitMorph />
        </motion.div>
        <div className="hero-scroll-indicator">
          <motion.div
            className="scroll-line"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Scroll
          </motion.span>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="marquee-section">
        <div className="marquee-track">
          <div className="marquee-content">
            {[...fruits, ...fruits].map((f, i) => (
              <span key={i} className="marquee-item">
                {f.emoji} {f.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section featured-section">
        <div className="section-inner">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="section-eyebrow">Auswahl</p>
            <h2 className="section-title">Unsere Favoriten</h2>
          </motion.div>
          <motion.div
            className="fruit-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {featured.map((fruit, i) => (
              <FruitCard key={fruit.id} fruit={fruit} index={i} />
            ))}
          </motion.div>
          <motion.div
            className="section-cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/katalog" className="btn-primary">Alle Früchte ansehen</Link>
          </motion.div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="section philosophy-section">
        <div className="section-inner">
          <motion.div
            className="philosophy-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-eyebrow">Philosophie</p>
            <h2 className="big-statement">
              Wir glauben, dass in jeder Frucht<br />
              ein <span className="gradient-text">Kunstwerk</span> steckt.
            </h2>
            <p className="philosophy-text">
              Jede Farbe, jede Kurve, jeder Geschmack ist das Ergebnis
              von Millionen Jahren Evolution — perfektioniert von der Natur
              selbst. Wir haben es uns zur Aufgabe gemacht, diese Schönheit
              sichtbar zu machen.
            </p>
            <Link to="/ueber" className="btn-ghost">Mehr erfahren →</Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
