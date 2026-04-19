import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import Landing from './pages/Landing'
import Catalog from './pages/Catalog'
import FruitDetail from './pages/FruitDetail'
import About from './pages/About'
import Playground from './pages/Playground'

export default function App() {
  const location = useLocation()

  return (
    <>
      <CustomCursor />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/katalog" element={<Catalog />} />
          <Route path="/frucht/:id" element={<FruitDetail />} />
          <Route path="/ueber" element={<About />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}
