import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import StarField from './components/StarField'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import DeliberateFutures from './pages/DeliberateFutures'
import './App.css'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <StarField />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/deliberate-futures" element={<DeliberateFutures />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
