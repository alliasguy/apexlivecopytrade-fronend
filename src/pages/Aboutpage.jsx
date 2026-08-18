import React from 'react'
import './page.css'
import Header from '../components/Header/Header'
import About from '../components/about/About'
import Footer from '../components/footer/Footer'
import Contact from '../components/contact/Contact'
import ForexAnalysisSection from '../components/ForexAnalysisSection/ForexAnalysisSection'
import Copytrade from '../components/copytrade/Copytrade'
import Why from '../components/why/Why'
import TradeInfo from '../components/TradeInfo/TradeInfo'
const Aboutpage = () => {
  return (
    <>
    <main className='about-page-land'>
    <Header />
      <section className='about-landpage my-about'>
        <div className="about-page-text">
          <span className="page-hero-eyebrow">about us</span>
          <h3>About <span className="highlight">Apexlivecopytrade</span></h3>
          <span className="small-thin-line"></span>
          <p>We connect everyday investors with top-performing traders across forex, crypto, indices and futures - so you can copy proven strategies instead of guessing.</p>
        </div>
      </section>
      <Copytrade />
      <TradeInfo />
      <Why />
      <About />
      <ForexAnalysisSection />
      <Contact />
      <Footer />
    </main></>
  )
}

export default Aboutpage