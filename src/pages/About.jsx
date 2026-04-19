import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const values = [
  { icon: '🎨', title: 'Design', text: 'Jede Frucht ist ein Meisterwerk der Natur. Wir präsentieren sie so, wie sie es verdient.' },
  { icon: '🔬', title: 'Wissen', text: 'Fundierte Informationen, kuratiert von Ernährungsexperten und Botanikern.' },
  { icon: '✨', title: 'Erlebnis', text: 'Mehr als eine Website — eine sensorische Reise durch die Welt der Früchte.' },
  { icon: '🌍', title: 'Nachhaltigkeit', text: 'Wir fördern bewussten Konsum und Wertschätzung für die Gaben der Natur.' },
]

export default function About() {
  return (
    <PageTransition>
      <section className="page-hero">
        <motion.p
          className="section-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Über uns
        </motion.p>
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Das <span className="gradient-text">Konzept</span>
        </motion.h1>
      </section>

      <section className="section">
        <div className="section-inner about-content">
          <motion.div
            className="about-statement"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="big-statement">
              FRUCHT ist ein digitales Studio, das die Schönheit von Obst<br />
              durch <span className="gradient-text">Design & Technologie</span> erlebbar macht.
            </h2>
            <p className="about-text">
              Wir sind Designer, Entwickler und Naturliebhaber. Uns verbindet die Überzeugung,
              dass die einfachsten Dinge des Lebens — wie eine perfekt gereifte Frucht —
              die größte Aufmerksamkeit verdienen. Diese Website ist unser Medium,
              um diese Philosophie zum Leben zu erwecken.
            </p>
          </motion.div>

          <div className="values-grid">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="value-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                whileHover={{ y: -8 }}
              >
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="about-manifesto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="manifesto-text">
              „Die Natur braucht keinen Designer —<br />
              aber sie verdient einen, der ihre Arbeit würdigt."
            </p>
            <p className="manifesto-credit">— FRUCHT Studio, 2026</p>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
