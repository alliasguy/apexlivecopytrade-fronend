import React from 'react'
import { Link } from 'react-router-dom'
import './footer.css'

const linkColumns = [
    {
        heading: 'product',
        links: [
            { label: 'copytrade', to: '/copytrade' },
            { label: 'forex', to: '/forex' },
            { label: 'stocks', to: '/stocks' },
            { label: 'indices', to: '/indices' },
            { label: 'futures', to: '/futures' },
        ],
    },
    {
        heading: 'insights',
        links: [
            { label: 'news', to: '/news' },
            { label: 'technical analysis', to: '/technical-analysis' },
            { label: 'heatmaps', to: '/heatmaps' },
            { label: 'watchlists', to: '/watchlists' },
        ],
    },
    {
        heading: 'company',
        links: [
            { label: 'about us', to: '/about' },
            { label: 'our team', to: '/team' },
            { label: 'faq', to: '/faq' },
        ],
    },
    {
        heading: 'get started',
        links: [
            { label: 'log in', to: '/login' },
            { label: 'create account', to: '/signup' },
            { label: 'buy crypto', to: '/buy-crypto' },
        ],
    },
]

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className='footer'>
        <div className="trusted-patners-section">
            <h2 data-aos="fade-up">our <span className="highlight">partners</span></h2>
            <div className="trusted-patners-img-container">
                <img src="/a-xs-light.png" alt="" className="trusted-patener-icon" data-aos="fade-up"/>
                <img src="/b-xs-light.png" alt="" className="trusted-patener-icon" data-aos="fade-up"/>
                <img src="/c-xs-light.png" alt="" className="trusted-patener-icon" data-aos="fade-up"/>
                <img src="/d-xs-light.png" alt="" className="trusted-patener-icon" data-aos="fade-up"/>
                <img src="/e-xs-light.png" alt="" className="trusted-patener-icon" data-aos="fade-up"/>
            </div>
        </div>
        <div className="quicklinks-container">
            <div className="quicklink-card-container">
                <div className="quicklink-brand" data-aos="fade-up">
                    <img src="/apexlivetradelogo3.png" alt="Apexlivecopytrade" className="footer-logo" />
                    <p>Follow top-performing traders across forex, stocks, indices, and crypto - one account, every market.</p>
                </div>
                {linkColumns.map((column) => (
                    <div className="quicklink-card" key={column.heading} data-aos="fade-up">
                        <p className="quicklink-heading">{column.heading}</p>
                        {column.links.map((link) => (
                            <Link key={link.to} to={link.to}>{link.label}</Link>
                        ))}
                    </div>
                ))}
            </div>
            <div className="copyright-container">
                <div className="copyright-txt">
                    <p>copyright &copy; {year} Apexlivecopytrade. All rights reserved.</p>
                </div>
                <div className="policy-txt">
                    <Link to="/privacy-policy">terms and conditions</Link>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
