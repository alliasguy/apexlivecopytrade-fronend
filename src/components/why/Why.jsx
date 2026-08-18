import React from 'react'
import './why.css'
import { FaUserPlus } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FiPieChart } from "react-icons/fi";
import { RiLineChartLine } from "react-icons/ri";
const Why = () => {
  return (
      <div className='why-choose-section'>
          <div className="why-choose-us-img-container">
              <div className="videoframe-text-container" data-aos="fade-up">
                    <h1>Market <span className="highlight">rates</span></h1>
                    <p>always accurate, live</p>
                </div>
              <img src="/apexprimemockup1.png" alt="" className="mockup" data-aos="fade-up"/>
          </div>
        
          <div className="why-choose-us-card-container">
              <div className="why-choose-us-text-container">
            <div className="header" data-aos="fade-up">
                <span className="header-line"></span>
                <h2>built for serious traders</h2>
            </div>
            <h1 data-aos="fade-up">trade with an edge</h1>
            <p data-aos="fade-up">here's what makes our platform stand out.</p>
            </div>
            <div className="why-choose-us-card" data-aos="fade-up">
                <span className="card-counter">01</span>
                <RiLineChartLine />
                <h2>Live analysis</h2>
                <p>Every trade is backed by real analysis, so entries and exits are timed to capture the strongest moves.</p>
            </div>
            <div className="why-choose-us-card" data-aos="fade-up">
                <span className="card-counter">02</span>
                <FiPieChart />
                <h2>Access</h2>
                <p>Trade global markets - stocks, forex, and commodities - with every tool a serious investor needs.</p>
            </div>
        </div>
    </div>
  )
}

export default Why