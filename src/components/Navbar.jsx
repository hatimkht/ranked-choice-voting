import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const links = [
  { to: '/', label: 'Home' },
  { to: '/katalog', label: 'Katalog' },
  { to: '/ueber', label: 'Über' },
  { to: '/playground', label: 'Playground' },
]

export default function Navbar() {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <NavLink to="/" className="nav-logo">
        FRUCHT<span className="dot">.</span>
      </NavLink>
      <div className="nav-links">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  )
}
