import React from 'react'
import './contact.css'
import {FiMail} from 'react-icons/fi'
const Contact = () => {
  return (
    <div className='contact-section' id='contact'>
        <div className="contact-wrapper" data-aos="fade-up">
            <div className="header">
                <span className="header-line"></span>
                <h2>contact us</h2>
            </div>
            <h1 data-aos="fade-up">let's talk</h1>
            <p data-aos="fade-up">
                Have a question? Send us a message and we'll respond right away.
            </p>
            <a href='mailto:support@apexlivecopytrade.com' className="contact-email-btn" data-aos="fade-up">
                <FiMail />
                <span>support@apexlivecopytrade.com</span>
            </a>
        </div>
    </div>
  )
}

export default Contact