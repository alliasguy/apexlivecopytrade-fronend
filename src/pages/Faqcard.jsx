import React from 'react'
import CountUp from 'react-countup'
const Faqcard = () => {
  return (
    <div className='why-choose-section stat-section'>
      <div className="why-choose-us-img-container">
        <div className="videoframe-text-container" data-aos="fade-up">
          <h1><span className="highlight">real</span> results</h1>
          <p>the numbers behind the platform</p>
        </div>
        <img src="/apexmockup15.png" alt="" className="mockup" data-aos="fade-up"/>
      </div>
      <div className="why-choose-us-card-container">
        <div className="why-choose-us-text-container">
            <div className="header" data-aos="fade-up">
                <span className="header-line"></span>
                <h2>by the numbers</h2>
            </div>
            <h1 data-aos="fade-up">results that speak</h1>
            <p data-aos="fade-up">Here's a live look at how traders are performing on our platform right now.</p>
        </div>
            <div className="stat-card-container">
              <div className="stat-card" data-aos="fade-up">
                <div className="stat-card-value"><CountUp end={973} enableScrollSpy scrollSpyOnce />k</div>
                <div className="stat-card-label">active traders</div>
              </div>
              <div className="stat-card" data-aos="fade-up">
                <div className="stat-card-value"><CountUp end={186} enableScrollSpy scrollSpyOnce /></div>
                <div className="stat-card-label">supported countries</div>
              </div>
              <div className="stat-card" data-aos="fade-up">
                <div className="stat-card-value"><CountUp end={152} enableScrollSpy scrollSpyOnce />k</div>
                <div className="stat-card-label">transactions</div>
              </div>
        </div>
        </div>
    </div>
  )
}

export default Faqcard