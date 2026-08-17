import React , {useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { GrLineChart } from "react-icons/gr";
import { FiAward } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";
import { MdAddchart } from "react-icons/md";
import { AiOutlineSafety } from "react-icons/ai";
import {RiLuggageDepositLine} from 'react-icons/ri'
import {AiOutlineSetting,AiOutlineStock} from 'react-icons/ai'
import {RiLockPasswordLine} from 'react-icons/ri'
import {FiLogOut} from 'react-icons/fi'
import {AiOutlineClose} from 'react-icons/ai'
import {GiReceiveMoney} from 'react-icons/gi'
import {RxDashboard} from 'react-icons/rx'
import {FaUserFriends,FaRegChartBar} from 'react-icons/fa'
import { jwtDecode } from 'jwt-decode'
const AdminHeader = ({route,openCreateTrader,openTraderLogs,openUsers,openKycReview,openSecurity}) => {
    const navigate = useNavigate()
    const [dropDown,setDropDown] = useState(false)
    const [adminEmail, setAdminEmail] = useState('')

    const logout = ()=>{
        localStorage.removeItem('adminToken')
        navigate('/admin')
    }
    // This previously checked the regular user 'token' (copy-pasted from
    // Userdashboardheader) and redirected to /login whenever it was
    // missing - which is nearly always for a real admin, since logging in
    // as admin never sets that key. That made the admin panel effectively
    // unreachable unless the browser also happened to hold a stale user
    // session. There's no backend endpoint for "get the admin's own
    // profile", so the admin's email is read directly off their own JWT.
    useEffect(()=>{
        const adminToken = localStorage.getItem('adminToken')
        if(adminToken){
            try {
                setAdminEmail(jwtDecode(adminToken).email || '')
            } catch (error) {
                logout()
            }
        }
        else{
            navigate('/admin')
        }

    },[])


    const [bgColor, setBgColor] = useState(false)
    const changeOnScroll = ()=>{
        if(window.scrollY >= 50){
            setBgColor(true)
        }
        else{
            setBgColor(false)
        }
    }
    window.addEventListener('scroll', changeOnScroll)
  return (
    <>
        {
            dropDown &&
            <div className="drop-down" onBlur={()=>{
                setDropDown(false)
            }}>
                <div className="dropdown-tabs" onClick={()=>{
                   setDropDown(false)
                }}>
                    <AiOutlineClose />
                    <p>close</p>
                </div>
                <div className="dropdown-header">
                    <span className="profile-pic-container">
                        {adminEmail.charAt(0).toUpperCase()}
                    </span>
                    <span className="dropdown-user-details">
                        <p className='dropdown-name'>Admin</p>
                        <p className='dropdown-email'>{adminEmail}</p>
                    </span>
                </div>
                <div className="mobile-tabs">
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/dashboard')
                }}>
                    <RxDashboard />
                    <p>dashboard</p>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/fundwallet')
                }}>
                    <GiReceiveMoney />
                    <p>deposit</p>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/plans')
                }}>
                    <AiOutlineStock />
                    <p>select plan</p>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/withdraw')
                }}>
                    <RiLuggageDepositLine />
                    <p>withdraw</p>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/referrals')
                }}>
                    <FaUserFriends />
                    <p>referral</p>
                </div>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/myprofile')
                }}>
                    <AiOutlineSetting />
                    <p>profile setting</p>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/myprofile')
                }}>
                    <RiLockPasswordLine />
                    <p>kyc</p>
                </div>
                
                <div className="dropdown-tabs" onClick={()=>{
                   logout()
                }}>
                    <FiLogOut />
                    <p>logout</p>
                </div>
                
            </div>
        }
        <aside  className='userdashboard-sidebar'>
              <div className="dashboard-logo-container">
                  <img src="/apexlivetradelogo3.png" alt="Apexlivecopytrade" className="dashboard-logo"/>
            </div>
            <div className='dashboard-links-container'>
                  <li className="dashboard-links" onClick={()=> openUsers()}>
                      <div className="dashboard-svg-container">
                          <AiOutlineAppstoreAdd />
                      </div>
                      <p>home</p>
                  </li>
                  <li className="dashboard-links" onClick={()=> openCreateTrader()}>
                      <div className="dashboard-svg-container">
                          <MdAddchart />
                      </div>
                      <p>create trader</p></li>
                  <li className="dashboard-links" onClick={()=> openTraderLogs()}>
                      <div className="dashboard-svg-container">
                          <FaRegChartBar />
                      </div>
                      <p >traders log</p></li>
                  <li className="dashboard-links" onClick={()=> openKycReview()}>
                      <div className="dashboard-svg-container">
                          <AiOutlineSafety />
                      </div>
                      <p>KYC review</p></li>
                  <li className="dashboard-links" onClick={()=> openSecurity()}>
                      <div className="dashboard-svg-container">
                          <RiLockPasswordLine />
                      </div>
                      <p>Security</p></li>
                  <li className="dashboard-links">
                      <div className="dashboard-svg-container">
                          <GrLineChart />
                      </div>
                    <Link to='/admin'>logout</Link>
                </li>
            </div>
        </aside>
    </>
  )
}

export default AdminHeader