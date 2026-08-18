import React from 'react'
import './about.css'
import { IoWallet } from "react-icons/io5";
import { BsBarChartFill } from "react-icons/bs";

const About = () => {
  return (
      <div className='about-section' id='about'>
          <div className="videoframe-text-container about-section-eyebrow" data-aos="fade-up">
            <div className="header">
              <span className="header-line"></span>
              <h2>assets</h2>
            </div>
        </div>
        <div className='why-choose-section why-choose-section--reverse'>
      <div className="why-choose-us-img-container">
        <div className="videoframe-text-container" data-aos="fade-up">
                <h1>Global <span className="highlight">overview</span></h1>
                <p>See real-time price changes, highs, lows, and closes across global markets, all in one clean dashboard.</p>
        </div>
        <img src="/apexmockup1.png" alt="" className="mockup" data-aos="fade-up"/>
        </div>
      <div className="why-choose-us-card-container">
        <div className="why-choose-us-text-container">
            <div className="header" data-aos="fade-up">
                <span className="header-line"></span>
                <h2>why choose us</h2>
            </div>
            <h1 data-aos="fade-up">what sets us apart</h1>
            <p data-aos="fade-up">Our team brings deep experience in arbitrage, stocks, indices, forex, and crypto trading to every account.</p>
        </div>
            <div className="why-choose-us-card" data-aos="fade-up">
                            <span className="card-counter">01</span>
                            <IoWallet />
                            <h2>Flexible deposits</h2>
                            <p>Scale your investment whenever you're ready - upgrade your plan any time as your goals and capital grow.</p>
                        </div>
                        <div className="why-choose-us-card" data-aos="fade-up">
                            <span className="card-counter">02</span>
                            <BsBarChartFill />
                            <h2>Trade smarter</h2>
                            <p>Our advanced arbitrage strategies help keep your trading costs low and cut out unnecessary transaction fees.</p>
                        </div>
        </div>
        </div>
    </div>
  )
}

export default About