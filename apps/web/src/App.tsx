import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AboutSection } from './components/epk/AboutSection'
import { HomeSection } from './components/epk/HomeSection'
import { MusicGrid } from './components/epk/MusicGrid'
import { NewsletterSection } from './components/epk/NewsletterSection'
import { ShopGrid } from './components/epk/ShopGrid'
import { TourList } from './components/epk/TourList'
import { VIPPage } from './components/epk/VIPPage'
import { VideoGrid } from './components/epk/VideoGrid'
import { EPKPage } from './pages/EPKPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EPKPage />}>
          <Route index element={<HomeSection />} />
          <Route path="music" element={<MusicGrid />} />
          <Route path="videos" element={<VideoGrid />} />
          <Route path="tour" element={<TourList />} />
          <Route path="vip" element={<VIPPage />} />
          <Route path="shop" element={<ShopGrid />} />
          <Route path="about" element={<AboutSection />} />
          <Route path="newsletter" element={<NewsletterSection />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
