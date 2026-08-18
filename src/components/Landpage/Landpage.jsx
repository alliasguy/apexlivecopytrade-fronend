import React from 'react'
import './landpage.css'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
const Landpage = () => {
    const navigate= useNavigate()
  return (
      <main className='landpage' >
        <div className='landpage-content-wrapper'>
           
              <motion.div className="landpage-text-container">
                <motion.h1
                    initial={{y:45, opacity:0}}
                    animate={{y:0, opacity:1}}
                    transition={{duration:0.65,delay:0.2}}
                >
                    <span className="landpage-highlight">copytrading</span>, simplified
                </motion.h1>
                <motion.p
                    initial={{y:45, opacity:0}}
                    animate={{y:0, opacity:1}}
                    transition={{duration:0.65,delay:0.4}}
                >
                    Follow proven traders across 50+ markets and mirror their strategies for consistent results.
                  </motion.p>
                  <div className="launch-btn-container">
                <motion.button className='launch-btn'
                    initial={{y:45, opacity:0}}
                    animate={{y:0, opacity:1}}
                    transition={{duration:0.65,delay:0.6}}
                    onClick={()=>{
                        navigate('/signup')
                    }}
                >
                    <span>start earning</span>
                </motion.button>
                </div>
              </motion.div>
              
          </div>
    </main>
  )
}

export default Landpage





