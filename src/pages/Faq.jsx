import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/footer/Footer'
import Contact from '../components/contact/Contact'
import Faq from '../components/Faq/Faq'
const Faqpage = () => {
  return (
    <main>
    <Header />
      <section className='about-landpage faq-landpage'>
        <div className="about-page-text">
          <span className="page-hero-eyebrow">support</span>
          <h3>frequently asked questions</h3>
          <span className="small-thin-line"></span>
          <p>Everything you need to know about copytrading, funding, and withdrawals - answered in one place.</p>
        </div>
      </section>
       <Faq />
      <Contact />
      <Footer />
    </main>
  )
}

export default Faqpage