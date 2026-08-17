import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { FaUsers, FaTrophy } from 'react-icons/fa';
import { FiSearch, FiSliders, FiCheckCircle } from 'react-icons/fi';
import { MdCandlestickChart, MdOutlineShowChart } from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';

import Userdashboardheader from '../userdashboardheader/Userdashboardheader';
import DashboardTopbar from '../dashboardtopbar/DashboardTopbar';
import MobileDropdown from '../MobileDropdown';
import { TraderCardSkeleton } from '../common/SkeletonLoader';
import EmptyStateCard from '../common/EmptyStateCard';
import SparklineChart from './SparklineChart';
import RiskScoreBadge from './RiskScoreBadge';
import CopyTradeModal from './CopyTradeModal';

import './userdashboardtraders.css';

const UserdashboardTraders = ({ route }) => {
  const [loader, setLoader] = useState(true);
  const [showTraderModal, setShowTraderModal] = useState(false);
  const [activeTrader, setActiveTrader] = useState(null);
  const [selectedTraderForCopy, setSelectedTraderForCopy] = useState(null);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'top_roi' | 'low_risk' | 'popular' | 'low_min'
  const [traders, setTraders] = useState([]);
  const [myTrader, setMyTrader] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isSubmittingCopy, setIsSubmittingCopy] = useState(false);

  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    background: '#121624',
    color: '#ffffff',
  });

  const getData = async () => {
    try {
      setLoader(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${route}/api/getData`, {
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.status === 'error') {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    } finally {
      setLoader(false);
    }
  };

  const fetchTraders = async () => {
    try {
      const req = await fetch(`${route}/api/fetchTraders`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const res = await req.json();
      if (res.status === 200) {
        setTraders(res.traders || []);
      } else {
        setTraders([]);
      }
    } catch (err) {
      console.error('Failed to fetch traders:', err);
      setTraders([]);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getData();
    fetchTraders();
  }, [route]);

  useEffect(() => {
    if (traders.length > 0 && userData?.trader) {
      const target = traders.find((t) => t._id === userData.trader);
      setMyTrader(target || null);
    } else {
      setMyTrader(null);
    }
  }, [traders, userData]);

  // Filter logic
  const filteredTraders = traders.filter((trader) => {
    const fullName = `${trader.firstname || ''} ${trader.lastname || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase());

    if (!matchesSearch) return false;

    const winRate = Number(trader.profitrate) || 0;
    const riskScore = Number(trader.riskScore) || 3;
    const minCap = Number(trader.minimumcapital) || 0;

    switch (activeFilter) {
      case 'top_roi':
        return winRate >= 80;
      case 'low_risk':
        return riskScore <= 3;
      case 'popular':
        return (Number(trader.followers) || 0) >= 100;
      case 'low_min':
        return minCap <= 500;
      default:
        return true;
    }
  });

  const handleOpenCopyModal = (trader) => {
    setSelectedTraderForCopy(trader);
  };

  const executeCopyTrade = async (trader, copyConfig) => {
    try {
      setIsSubmittingCopy(true);
      const req = await fetch(`${route}/api/copytrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          trader: trader._id,
          allocation: copyConfig.allocationAmount,
          stopLoss: copyConfig.stopLoss,
          strategy: copyConfig.copyMode,
        }),
      });
      const res = await req.json();

      if (res.status === 200) {
        Toast.fire({
          icon: 'success',
          title: res.message || `Now copying ${trader.firstname}!`,
        });
        setSelectedTraderForCopy(null);
        getData();
      } else {
        Toast.fire({
          icon: 'error',
          title: res.message || 'Failed to start copy trading',
        });
      }
    } catch (error) {
      console.error('Copy trade error:', error);
      Toast.fire({
        icon: 'error',
        title: 'Network error processing copy trade',
      });
    } finally {
      setIsSubmittingCopy(false);
    }
  };

  const stopCopyTrade = async (trader) => {
    const result = await Swal.fire({
      title: 'Stop Copy Trading?',
      text: `Are you sure you want to stop copying ${trader.firstname}? All active copied trades will be safely managed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, Stop Copying',
      background: '#121624',
      color: '#ffffff',
    });

    if (result.isConfirmed) {
      try {
        setLoader(true);
        const req = await fetch(`${route}/api/stopcopytrade`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
          },
          body: JSON.stringify({
            trader: trader._id,
          }),
        });
        const res = await req.json();

        if (res.status === 200) {
          Toast.fire({
            icon: 'success',
            title: res.message || 'Copy trading stopped successfully',
          });
          getData();
        } else {
          Toast.fire({
            icon: 'error',
            title: res.message || 'Failed to stop copy trading',
          });
        }
      } catch (error) {
        console.error('Stop copy trade error:', error);
      } finally {
        setLoader(false);
      }
    }
  };

  const closeMobileMenu = () => {
    setShowMobileDropdown(false);
  };

  return (
    <main className="homewrapper">
      <Userdashboardheader />

      <section className="dashboardhomepage copytrading-theme">
        <DashboardTopbar
          greetingName={userData?.firstname}
          onProfileClick={() => setShowMobileDropdown(!showMobileDropdown)}
          onMenuClick={() => setShowMobileDropdown(!showMobileDropdown)}
        />

        <MobileDropdown
          showStatus={showMobileDropdown}
          route={route}
          closeMenu={closeMobileMenu}
        />

        {/* Detailed Trader Profile View Drawer/Page */}
        {showTraderModal && activeTrader ? (
          <div className="trader-profile-page">
            <button
              className="trader-page-back-btn"
              onClick={() => setShowTraderModal(false)}
            >
              <IoIosArrowBack /> Back to Leaderboard
            </button>

            <div className="trader-profile-container">
              <div className="trader-profile-card glow-card">
                <div className="trader-card-header">
                  <div className="trader-card-image-container">
                    <img
                      src={activeTrader.traderImage || '/preview.gif'}
                      alt={`${activeTrader.firstname} ${activeTrader.lastname}`}
                      className="trader-card-image"
                    />
                  </div>
                  <div className="trader-card-text-container">
                    <h3 className="trader-name">
                      {activeTrader.firstname} {activeTrader.lastname}
                    </h3>
                    <div className="profile-badge-row">
                      <RiskScoreBadge score={activeTrader.riskScore || 3} />
                      <span className="followers-pill">
                        <FaUsers /> {activeTrader.followers || '1.4k'} followers
                      </span>
                    </div>
                  </div>
                </div>

                <div className="trader-sparkline-box">
                  <span className="sparkline-title">30-Day Profit Curve</span>
                  <SparklineChart
                    data={[20, 28, 24, 38, 45, 42, 60, 58, 75]}
                    isPositive={true}
                    height={80}
                  />
                </div>

                <div className="trader-perfomance-container">
                  <div className="trader-performance">
                    <div className="trader-performance-item">
                      <p className="performance-label">Win Rate</p>
                      <p className="performance-value profit-color">
                        <MdCandlestickChart /> {activeTrader.profitrate}%
                      </p>
                    </div>
                    <div className="trader-performance-item">
                      <p className="performance-label">Average Return</p>
                      <p className="performance-value">
                        <MdOutlineShowChart /> {activeTrader.averagereturn}
                      </p>
                    </div>
                    <div className="trader-performance-item">
                      <p className="performance-label">Risk/Reward Ratio</p>
                      <p className="performance-value">{activeTrader.rrRatio || '1:3.2'}</p>
                    </div>
                    <div className="trader-performance-item">
                      <p className="performance-label">Minimum Capital</p>
                      <p className="performance-value highlight-val">
                        ${Number(activeTrader.minimumcapital).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="trader-performance-btn-container">
                    <button
                      className="btn-primary-glow"
                      onClick={() => {
                        setShowTraderModal(false);
                        handleOpenCopyModal(activeTrader);
                      }}
                    >
                      Copy This Trader
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="trader-show-case-wrapper">
            {/* Hero Leaderboard Header */}
            <div className="traders-hero-banner">
              <div className="hero-content">
                <div className="hero-tag">
                  <FaTrophy /> Top Copytrading Master Directory
                </div>
                <h2>Explore & Copy Master Traders</h2>
                <p>
                  Mirror trades in real-time from verified strategy providers. Set your risk parameters and automate your portfolio growth.
                </p>

                <div className="hero-stats-row">
                  <div className="hero-stat-pill">
                    <span className="num">{traders.length > 0 ? traders.length : '12+'}</span>
                    <span className="lbl">Verified Masters</span>
                  </div>
                  <div className="hero-stat-pill">
                    <span className="num">88.4%</span>
                    <span className="lbl">Avg Win Rate</span>
                  </div>
                  <div className="hero-stat-pill">
                    <span className="num">$4.2M+</span>
                    <span className="lbl">Copied Volume</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Currently Active Copied Trader Banner */}
            {myTrader && (
              <div className="active-trader-section">
                <div className="section-title-row">
                  <h3>
                    <FiCheckCircle className="icon-active" /> Active Copied Trader
                  </h3>
                  <span className="status-badge live">Live Copying</span>
                </div>

                <div className="active-trader-card glow-card">
                  <div className="active-trader-left">
                    <img
                      src={myTrader.traderImage || '/preview.gif'}
                      alt={`${myTrader.firstname} ${myTrader.lastname}`}
                      className="active-avatar"
                    />
                    <div>
                      <h4>
                        {myTrader.firstname} {myTrader.lastname}
                      </h4>
                      <p className="trader-meta">
                        Win Rate: <span className="highlight-text">{myTrader.profitrate}%</span> · Min Capital: ${myTrader.minimumcapital}
                      </p>
                    </div>
                  </div>

                  <div className="active-trader-right">
                    <button
                      className="btn-danger-outline"
                      onClick={() => stopCopyTrade(myTrader)}
                    >
                      Stop Copying Trader
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Traders Discovery Leaderboard Section */}
            <div className="traders-section">
              <div className="leaderboard-control-bar">
                <div className="title-area">
                  <h2>
                    Expert <span className="highlight">Traders</span>
                  </h2>
                  <p>Filter by strategy, win rate, or minimum investment.</p>
                </div>

                {/* Search Bar */}
                <div className="search-input-container">
                  <FiSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by trader name..."
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter Chips Bar */}
              <div className="filter-chips-row">
                {[
                  { id: 'all', label: 'All Masters' },
                  { id: 'top_roi', label: 'High Win Rate (≥80%)' },
                  { id: 'low_risk', label: 'Low Risk (Score ≤3)' },
                  { id: 'popular', label: 'Most Followed' },
                  { id: 'low_min', label: 'Min Capital ≤$500' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    className={`filter-chip ${activeFilter === chip.id ? 'active' : ''}`}
                    onClick={() => setActiveFilter(chip.id)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Traders Grid / Loading State */}
              <div className="traders-card-container">
                {loader ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <TraderCardSkeleton key={idx} />
                  ))
                ) : filteredTraders.length === 0 ? (
                  <EmptyStateCard
                    title="No Traders Found"
                    description={`No master traders match your search criteria "${search}". Try adjusting your filters.`}
                    actionText="Reset Search"
                    onActionClick={() => {
                      setSearch('');
                      setActiveFilter('all');
                    }}
                    icon={FiSliders}
                  />
                ) : (
                  filteredTraders.map((trader) => (
                    <div className="traders-card glow-card" key={trader._id || trader.firstname}>
                      {/* Card Header */}
                      <div className="trader-card-header">
                        <div className="trader-card-image-container">
                          <img
                            src={trader.traderImage || '/preview.gif'}
                            alt={`${trader.firstname} ${trader.lastname}`}
                            className="trader-card-image"
                          />
                        </div>
                        <div className="trader-card-text-container">
                          <h3 className="trader-name">
                            {trader.firstname} {trader.lastname}
                          </h3>
                          <RiskScoreBadge score={trader.riskScore || 3} />
                        </div>
                      </div>

                      {/* Performance Sparkline SVG */}
                      <div className="card-sparkline-area">
                        <SparklineChart
                          data={[15, 20, 18, 30, 38, 35, 48, 52, 65]}
                          isPositive={Number(trader.profitrate) >= 60}
                          height={44}
                        />
                      </div>

                      {/* Key Performance Indicators */}
                      <div className="trader-perfomance-container">
                        <div className="trader-performance">
                          <div className="trader-performance-item">
                            <p className="performance-label">Win Rate</p>
                            <p className="performance-value profit-color">
                              <MdCandlestickChart /> {trader.profitrate}%
                            </p>
                          </div>
                          <div className="trader-performance-item">
                            <p className="performance-label">Avg Return</p>
                            <p className="performance-value">
                              <MdOutlineShowChart /> {trader.averagereturn || '+18.4%'}
                            </p>
                          </div>
                          <div className="trader-performance-item">
                            <p className="performance-label">Min Capital</p>
                            <p className="performance-value highlight-val">
                              ${Number(trader.minimumcapital).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="trader-performance-btn-container">
                          <button
                            className="btn-secondary-outline"
                            onClick={() => {
                              setActiveTrader(trader);
                              setShowTraderModal(true);
                            }}
                          >
                            View Analytics
                          </button>
                          <button
                            className="btn-primary-glow"
                            onClick={() => handleOpenCopyModal(trader)}
                          >
                            Copy Trade
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Copy Trader Allocation & Risk Control Modal */}
        {selectedTraderForCopy && (
          <CopyTradeModal
            trader={selectedTraderForCopy}
            userData={userData}
            onClose={() => setSelectedTraderForCopy(null)}
            onConfirmCopy={executeCopyTrade}
            isSubmitting={isSubmittingCopy}
          />
        )}
      </section>
    </main>
  );
};

export default UserdashboardTraders;