import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './header.css';
import { RiArrowDownSLine } from "react-icons/ri";
import { MdClose } from "react-icons/md";
const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [bgColor, setBgColor] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showMarkets,setShowMarkets] = useState(false)
    const [showAnalytics,setShowAnalytics] = useState(false)
    const [showCompany,setShowCompany] = useState(false)
    const [showTrading,setShowTrading] = useState(false)

    useEffect(() => {
        const changeOnScroll = () => {
            setBgColor(window.scrollY >= 90);
        };
        window.addEventListener('scroll', changeOnScroll);
        return () => window.removeEventListener('scroll', changeOnScroll);
    }, []);

    // Lock background scroll while the mobile drawer is open, and let Escape close it.
    useEffect(() => {
        if (!showModal) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setShowModal(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [showModal]);

    const closeMobileMenu = () => {
        setShowModal(false);
        setShowMarkets(false);
        setShowAnalytics(false);
        setShowCompany(false);
        setShowTrading(false);
    };

    const navigate = useNavigate();

    const menuItems = [
        { name: "home", path: "/", dropdown: [] },
        { name: "about", path: "/about", dropdown: [] },
        { name: "markets", path: "/forex", dropdown: ["forex","futures", "indices", "stocks"] },
        { name: "analytics", path: "/news", dropdown: ["news", "technical-analysis","heatmaps","watchlists"] },
        { name: "company", path: "/team", dropdown: ["team","privacy-policy","faq"] },
        { name: "trading", path: "/buy-crypto", dropdown: ["buy-crypto", "copytrade"] }
    ];

    return (
        <motion.header className={`${bgColor && 'scroll-color'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65 }}
        >
            <div className="logo-container">
                <img src="/apexlivetradelogo3.png" alt="Apexlivecopytrade" className='txtlogo'/>
            </div>
            <nav>
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}
                            className="relative"
                            onMouseEnter={() => item.dropdown.length > 0 && setOpenDropdown(index)}
                            onMouseLeave={(e) => {
                                if (!e.relatedTarget || !e.relatedTarget.closest(".drop-down-container")) {
                                    setOpenDropdown(null);
                                }
                            }}>
                            <Link to={item.path}>{item.name}</Link>
                            {openDropdown === index && item.dropdown.length > 0 && (
                                <div className="drop-down-container"
                                    onMouseEnter={() => setOpenDropdown(index)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <div className="drop-wrapper">
                                        {item.dropdown.map((subItem, subIndex) => (
                                            <Link key={subIndex} to={`/${subItem}`} className="dropdown-link">{subItem}</Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sign-up-btn-container">
                <button className='signup-btn' onClick={() => { navigate('/login') }}><span>login</span></button>
            </div>
            <button
                type="button"
                className={`mobile-menu-container ${showModal ? 'is-active' : ''}`}
                onClick={() => setShowModal(true)}
                aria-label="Open menu"
                aria-expanded={showModal}
            >
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
            </button>
            <div
                className={`mobile-nav-backdrop ${showModal ? 'is-open' : ''}`}
                onClick={closeMobileMenu}
                aria-hidden="true"
            ></div>
            <div className={`menu-card ${showModal ? 'is-open' : ''}`} aria-hidden={!showModal}>
                <div className="menu-card-image-conatiner">
                    <img src="/apexlivetradelogo3.png" alt="Apexlivecopytrade" className='mobile-logo'/>
                    <button type="button" className="overlay-close-btn-container" onClick={closeMobileMenu} aria-label="Close menu">
                        <MdClose />
                    </button>
                </div>
                <ul className="list">
                    <li className="element"><Link to='/' onClick={closeMobileMenu}>home</Link></li>
                    <li className="element"><Link to='/about' onClick={closeMobileMenu}>about</Link></li>
                    <li className="market-dropdown">
                        <button type="button" className="market-dropdown-trigger" onClick={()=> setShowMarkets(!showMarkets)}>
                            <span>markets</span>
                            <span className={`market-dropdown-svg-container ${showMarkets && 'rotate'}`}>
                                <RiArrowDownSLine />
                            </span>
                        </button>
                        <ul className={`market-links ${showMarkets && 'show-markets'}`}>
                            <li className="element"><Link to='/forex' onClick={closeMobileMenu}>forex</Link></li>
                            <li className="element"><Link to='/futures' onClick={closeMobileMenu}>futures</Link></li>
                            <li className="element"><Link to='/indices' onClick={closeMobileMenu}>indices</Link></li>
                            <li className="element"><Link to='/stocks' onClick={closeMobileMenu}>stocks</Link></li>
                        </ul>
                    </li>
                    <li className="market-dropdown">
                        <button type="button" className="market-dropdown-trigger" onClick={()=> setShowAnalytics(!showAnalytics)}>
                            <span>analytics</span>
                            <span className={`market-dropdown-svg-container ${showAnalytics && 'rotate'}`}>
                                <RiArrowDownSLine />
                            </span>
                        </button>
                        <ul className={`analytics-links ${showAnalytics && 'show-markets'}`}>
                            <li className="element"><Link to='/news' onClick={closeMobileMenu}>news</Link></li>
                            <li className="element"><Link to='/technical-analysis' onClick={closeMobileMenu}>technical analysis</Link></li>
                            <li className="element"><Link to='/heatmaps' onClick={closeMobileMenu}>heatmaps</Link></li>
                            <li className="element"><Link to='/watchlists' onClick={closeMobileMenu}>watchlists</Link></li>
                        </ul>
                    </li>
                    <li className="market-dropdown">
                        <button type="button" className="market-dropdown-trigger" onClick={()=> setShowCompany(!showCompany)}>
                            <span>company</span>
                            <span className={`market-dropdown-svg-container ${showCompany && 'rotate'}`}>
                                <RiArrowDownSLine />
                            </span>
                        </button>
                        <ul className={`company-links ${showCompany && 'show-markets'}`}>
                            <li className="element"><Link to='/team' onClick={closeMobileMenu}>team</Link></li>
                            <li className="element"><Link to='/privacy-policy' onClick={closeMobileMenu}>privacy policy</Link></li>
                            <li className="element"><Link to='/faq' onClick={closeMobileMenu}>faq</Link></li>
                        </ul>
                    </li>
                    <li className="market-dropdown">
                        <button type="button" className="market-dropdown-trigger" onClick={()=> setShowTrading(!showTrading)}>
                            <span>trading</span>
                            <span className={`market-dropdown-svg-container ${showTrading && 'rotate'}`}>
                                <RiArrowDownSLine />
                            </span>
                        </button>
                        <ul className={`trading-links ${showTrading && 'show-markets'}`}>
                            <li className="element"><Link to='/buy-crypto' onClick={closeMobileMenu}>buy crypto</Link></li>
                            <li className="element"><Link to='/copytrade' onClick={closeMobileMenu}>copytrade</Link></li>
                        </ul>
                    </li>
                    <li className="element"><Link to='/login' onClick={closeMobileMenu}>login</Link></li>
                    <li className="element mobile-signup-element"><Link to='/signup' onClick={closeMobileMenu}>signup</Link></li>
                </ul>
            </div>
        </motion.header>
    );
};

export default Header;
