import React from 'react'
import './forexanalysis.css'
import TradingViewFinancials from '../TradingViewFinancials'
import TradingViewTechnicalAnalysis from '../TradingViewTechnicalAnalysis'
const ForexAnalysisSection = () => {
  return (
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
  )
}

export default ForexAnalysisSection