import React from 'react'
import './copytrade.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/footer/Footer'
import ForexAnalysisSection from '../../components/ForexAnalysisSection/ForexAnalysisSection'
import Contact from '../../components/contact/Contact'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const CopytradePage = () => {
  const navigate = useNavigate()
      const [withdrawMethods,setWithdrawalMethods] = useState([
        {
          id:1,
          min:'500',
          max:'4,999',      
          type:'starter plan',
          percent:'20',
          duration:'2 day(s)'
        },
        {
          id:2,
          min:'5,000',
          max:'19,999',
          type:'medium plan',
          percent:'35',
          duration:'4 day(s)'
        },
        {
          id:3,
          min:'20,000',
          max:'49,999',
          type:'classic plan',
          percent:'50',
          duration:'7 day(s)'
        },
        {
          id:4,
          min:'50,000',
          max:'99,000',
          type:'diamond plan',
          percent:'65',
          duration:'10 day(s)'
        },
        
        ])
  return (
    <> 
      <section className='copytrade-page-section'>
        <Header />
        <div className="copytrade-gap"></div>
        <div className='plan-section copy-trade-plan-section'>
      <div className="videoframe-text-container" data-aos="fade-up">
              <h1> <span className="highlight">copytrade </span> plans</h1>
              <p>Here are some carefully currated investment plans, created to ensure maximum return of investment.</p>
      </div>
      <div className="service-gap"></div>
              <div className="plan-card-container copy-trade-card-container">
              {
            withdrawMethods.map((withdrawmethod) => (
              <div class="pack-container" key={withdrawmethod.id} >
            <div class="pack-header">
                  <h3>{withdrawmethod.type}</h3>
                  <h2>$ {withdrawmethod.min}</h2>
                  <button className='plan-card-btn'>
                    <p>Subscribe</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </button>

            </div>
                <div className='lot-wrapper'>
                  <div className="lot-container">
                      <span className="lot-line"></span><p>Minimum order: 0.1 lot</p>
                  </div>
                  <div className="lot-container">
                      <span className="lot-line"></span><p>Minimum order: 0.1 lot</p>
                  </div>
                  <div className="lot-container">
                      <span className="lot-line"></span><p>Maximum order: 20 lots</p>
                  </div>
                  <div className="lot-container">
                      <span className="lot-line"></span><p>Leverage up to 1:80</p>
                  </div>
            </div>
          </div>
          ))}
          </div>
        </div>
        <ForexAnalysisSection />
      </section>
      <Contact />
      <Footer />
      </>
  )
}

export default CopytradePage