import React from 'react'
import './heatmaps.css'
import Header from '../../components/Header/Header'
import Contact from '../../components/contact/Contact'
import Footer from '../../components/footer/Footer'
import { useNavigate } from 'react-router-dom'
import Cryptoheatmaps from '../../components/Cryptoheatmaps'
import Forexheatmap from '../../components/Forexheatmap'
import Heatmapwidget from '../../components/Heatmapwidget'
const Heatmaps = () => {
  const navigate = useNavigate()
  return (
    <>
      <div className='forex-page-section'>
        <Header />
      <div className="forex-page-wrapper">
        <div className="videoframe-text-container" data-aos="fade-up">
          <h1>market <span className="highlight">heatmaps </span></h1>
        </div>
        <div className="forex-hero-section news-widget-container">
          <Heatmapwidget />
          </div>
           <section className='trading-view-forex-section' data-aos="fade-up">
                    <div className="videoframe-text-container">
                      <h1><span className="highlight">heat</span> maps </h1>
                    </div>
                  <div className="trading-view-forex-wrapper">
                      <div className="trading-view-card">
                          <div className="trading-view-card-text-container">
                              <h1>crypto heat maps</h1>
                              <p>See the crypto market at a glance - color-coded by performance, so winners and losers stand out instantly.</p>
                          </div>
                          <Cryptoheatmaps />
                      </div>
                      <div className="trading-view-card">
                          <div className="trading-view-card-text-container">
                              <h1>Forex Heatmap</h1>
                              <p>Spot which currencies are running hot and which are cooling off, color-coded and updated in real time.</p>
                          </div>
                          <Forexheatmap />
                      </div>
                  </div>
            </section>
          </div>
      </div>
      <Contact />
      <Footer />
      </>
  )
}

export default Heatmaps