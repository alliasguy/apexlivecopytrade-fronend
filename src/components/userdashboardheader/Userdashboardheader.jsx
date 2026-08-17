import React from 'react'
import "./userdashboardheader.css"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AiOutlineAppstoreAdd, AiOutlineSafety, AiOutlineSetting } from "react-icons/ai";
import { GrLineChart, GrTransaction } from "react-icons/gr";
import { FiAward, FiLogOut } from "react-icons/fi";
import { MdAddchart } from "react-icons/md";
import { FaRegChartBar } from 'react-icons/fa';

const Userdashboardheader = ({ route }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: <AiOutlineAppstoreAdd /> },
        { path: '/traders', label: 'Copy Traders', icon: <MdAddchart /> },
        { path: '/usercopytrade', label: 'Copy Trading', icon: <FaRegChartBar /> },
        { path: '/live-trading', label: 'Live Trading', icon: <GrLineChart /> },
        { path: '/transactions', label: 'Transactions', icon: <GrTransaction /> },
        { path: '/ranking', label: 'Ranking', icon: <FiAward /> },
        { path: '/kyc', label: 'KYC Verification', icon: <AiOutlineSafety /> },
        { path: '/settings', label: 'Settings', icon: <AiOutlineSetting /> },
        { path: '/passwordreset', label: 'Password Reset', icon: <AiOutlineSetting /> },
    ];

    return (
        <aside className='userdashboard-sidebar'>
            <div className="dashboard-logo-container">
                <img src="/apexlivetradelogo3.png" alt="Apexlivecopytrade" className="dashboard-logo" />
            </div>
            <div className='dashboard-links-container'>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={item.path}
                            className={`dashboard-links ${isActive ? 'dashboard-links--active' : ''}`}
                        >
                            <div className="dashboard-svg-container">
                                {item.icon}
                            </div>
                            <Link to={item.path}>{item.label}</Link>
                        </div>
                    );
                })}

                <div className="dashboard-links dashboard-links--logout" onClick={logout}>
                    <div className="dashboard-svg-container">
                        <FiLogOut />
                    </div>
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
};

export default Userdashboardheader;