import React from 'react'
import './technical.css'
import Header from '../../components/Header/Header'
import Contact from '../../components/contact/Contact'
import Footer from '../../components/footer/Footer'
import { useNavigate } from 'react-router-dom'
import TeslaWidget from '../../components/TeslaWidget'
import TradingViewTechnicalAnalysis from '../../components/TradingViewTechnicalAnalysis'
import TradingViewFinancials from '../../components/TradingViewFinancials'
const TechnicalAnalysisPage = () => {
  const navigate = useNavigate()
  return (
    <>
      <div className='forex-page-section'>
        <Header />
      <div className="forex-page-wrapper">
        <div className="videoframe-text-container" data-aos="fade-up">
          <h1>technical <span className="highlight">analysis </span></h1>
        </div>
        <div className="forex-hero-section news-widget-container">
          <TeslaWidget />
          </div>
          <section className='trading-view-forex-section'>
                      <div className="videoframe-text-container" data-aos="fade-up">
                        <h1>market <span className="highlight">analysis </span></h1>
                      </div>
                    <div className="trading-view-forex-wrapper">
                        <div className="trading-view-card">
                            <div className="trading-view-card-text-container" data-aos="fade-up">
                                <h1>Fundamental Data</h1>
                                <p>Dig into the fundamentals - a full breakdown of how a company is really performing beyond the stock price.</p>
                            </div>
                            <TradingViewFinancials />
                        </div>
                        <div className="trading-view-card">
                            <div className="trading-view-card-text-container" data-aos="fade-up">
                                <h1>Technical Analysis</h1>
                                <p>See our buy/sell/neutral ratings for any symbol, built from technical analysis and made for quick reading.</p>
                            </div>
                            <TradingViewTechnicalAnalysis />
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

export default TechnicalAnalysisPage