import './forex.css'
import TradingViewWidget from '../../components/TradingViewWidget'
import MiniSymbolOverviewWidget from '../../components/MiniSymbolOverviewWidget'
import Header from '../../components/Header/Header'
import Contact from '../../components/contact/Contact'
import Footer from '../../components/footer/Footer'
import Forexheatmap from '../../components/Forexheatmap'
import Forexcrossmaps from '../../components/Forexcrossmaps'
import { useNavigate } from 'react-router-dom'
const Forex = () => {
    const navigate = useNavigate()
  return (
    <>
      <div className='forex-page-section'>
        <Header />
      <div className="forex-page-wrapper">
        <div className="videoframe-text-container" data-aos="fade-up">
          <h1><span className="highlight">forex </span></h1>
        </div>
        <div className="forex-hero-section">
          <video src="/chart-big.hvc1.6af4110d38611a03c3a4.mp4" className="forex-page-video" autoPlay='true' loop='true'></video>
          <div className="floating-widget-right" data-aos="fade-up">
              <MiniSymbolOverviewWidget />
          </div>
          <div className="floating-widget-left" data-aos="fade-up">
              <TradingViewWidget />
          </div>
          </div>
          <div className='about-section copy-trade-section'>
            <div className="about-wrapper copy-trade-wrapper about-copy-trade-section forex-copy-trade-section">
              <div className="about-page-img forex-img-container">
                <img src="/apexmockup8.png" className='forex-img ' data-aos="fade-up"/>
              </div>
              <div className="tesla-widget-text-container" data-aos="fade-up">
                  <h1>forex <span className="highlight">trading</span> </h1>
                  <p>Buy and sell one currency against another in the world's largest, most liquid market. Central banks, corporations, and funds all trade here around the clock. Whether you're chasing quick pips on minor fluctuations or playing a longer, steadier strategy, forex has a lane for you.</p>
                  <div className="tesla-widget-btn-container">
                      <button className='launch-btn'
                    initial={{y:45, opacity:0}}
                    animate={{y:0, opacity:1}}
                    transition={{duration:0.65,delay:0.6}}
                    onClick={()=>{
                        navigate('/signup')
                    }}
                >
                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor"></path></svg>
                    <span>start trading</span>
                </button>
                  </div>
              </div>
          </div>
        </div>
        </div>
        <section className='trading-view-forex-section' data-aos="fade-up">
                    <div className="videoframe-text-container">
                      <h1><span className="highlight">Forex</span> maps </h1>
                    </div>
                  <div className="trading-view-forex-wrapper">
                      <div className="trading-view-card">
                          <div className="trading-view-card-text-container">
                              <h1>Forex Cross Rates</h1>
                              <p>See how any pair stacks up in real time, with live cross-rate quotes across every major currency.</p>
                          </div>
                          <Forexcrossmaps />
                      </div>
                      <div className="trading-view-card">
                          <div className="trading-view-card-text-container">
                              <h1>Forex Heatmap</h1>
                              <p>Get an instant snapshot of the currency market - spot which currencies are strong, which are weak, and how they compare, live.</p>
                          </div>
                          <Forexheatmap />
                      </div>
                  </div>
            </section>
      <Contact />
      <Footer />
      </div>
      </>
  )
}

export default Forex