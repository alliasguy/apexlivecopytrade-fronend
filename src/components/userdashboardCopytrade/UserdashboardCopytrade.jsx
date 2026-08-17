import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoMdNotifications } from 'react-icons/io';
import { FaUserAlt, FaAngleDown, FaChartPie, FaExchangeAlt } from 'react-icons/fa';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiSearch } from 'react-icons/fi';
import { RxHamburgerMenu } from 'react-icons/rx';

import Userdashboardheader from '../userdashboardheader/Userdashboardheader';
import MobileDropdown from '../MobileDropdown';
import { TableRowSkeleton } from '../common/SkeletonLoader';
import EmptyStateCard from '../common/EmptyStateCard';

import './userdashboardcopytrade.css';

const UserdashboardCopytrade = ({ route }) => {
  const [loader, setLoader] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [logFilter, setLogFilter] = useState('all'); // 'all' | 'profit' | 'loss'
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
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
        console.error('Error fetching trade log data:', error);
        navigate('/login');
      } finally {
        setLoader(false);
      }
    };

    getData();
  }, [navigate, route]);

  const closeMobileMenu = () => {
    setShowMobileDropdown(false);
  };

  const tradesList = userData?.trades || [];

  // Filtered trades
  const filteredTrades = tradesList.filter((trade) => {
    const pair = (trade.pair || '').toLowerCase();
    const matchesSearch = pair.includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (logFilter === 'profit') return trade.tradeType === 'profit';
    if (logFilter === 'loss') return trade.tradeType === 'loss';
    return true;
  });

  // Performance metrics calculation
  const totalTrades = tradesList.length;
  const profitTrades = tradesList.filter((t) => t.tradeType === 'profit');
  const lossTrades = tradesList.filter((t) => t.tradeType === 'loss');
  const winRate = totalTrades > 0 ? ((profitTrades.length / totalTrades) * 100).toFixed(1) : 0;

  const totalProfitSum = profitTrades.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalLossSum = lossTrades.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const netPnL = totalProfitSum - totalLossSum;

  return (
    <main className="homewrapper">
      <Userdashboardheader />

      <section className="dashboardhomepage copytrading-logs-theme">
        {/* Navigation Header Bar */}
        <div className="dashboardheaderwrapper">
          <button
            type="button"
            className="dashboard-topbar__menu-toggle"
            onClick={() => setShowMobileDropdown(!showMobileDropdown)}
            aria-label="Open menu"
          >
            <RxHamburgerMenu />
          </button>
          <div className="header-notification-icon-container">
            <IoMdNotifications />
          </div>
          <div className="header-username-container">
            <h3>Hi, {userData ? userData.firstname : 'Trader'}</h3>
          </div>
          <div className="header-userprofile-container">
            <div className="user-p-icon-container">
              <FaUserAlt />
            </div>
            <div
              className="user-p-drop-icon"
              onClick={() => setShowMobileDropdown(!showMobileDropdown)}
            >
              <FaAngleDown />
            </div>
          </div>
        </div>

        <MobileDropdown
          showStatus={showMobileDropdown}
          route={route}
          closeMenu={closeMobileMenu}
        />

        <div className="page-swiper-wrapper trans-page">
          {/* Back Button */}
          <button className="back-floating-btn" onClick={() => navigate('/dashboard')}>
            <AiOutlineArrowLeft /> Dashboard
          </button>

          {/* Page Header */}
          <div className="page-header-banner">
            <div className="header-left">
              <h2>Copytrade Performance & Activity Logs</h2>
              <p>Real-time record of all trades automatically executed by your assigned master trader.</p>
            </div>
            <div className="header-right-action">
              <Link to="/traders" className="btn-explore-traders">
                <FaExchangeAlt /> Manage Master Trader
              </Link>
            </div>
          </div>

          {/* Portfolio Metric Overview Cards */}
          <div className="portfolio-stats-grid">
            <div className="stat-card glow-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Copied Trades</span>
                <FaExchangeAlt className="stat-card-icon blue" />
              </div>
              <span className="stat-card-val">{totalTrades}</span>
              <span className="stat-card-sub">Total Orders Executed</span>
            </div>

            <div className="stat-card glow-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Net Copied PnL</span>
                {netPnL >= 0 ? (
                  <FiTrendingUp className="stat-card-icon green" />
                ) : (
                  <FiTrendingDown className="stat-card-icon red" />
                )}
              </div>
              <span className={`stat-card-val ${netPnL >= 0 ? 'profit-color' : 'loss-color'}`}>
                {netPnL >= 0 ? '+' : ''}${Math.abs(netPnL).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="stat-card-sub">Realized Portfolio PnL</span>
            </div>

            <div className="stat-card glow-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Win Rate Ratio</span>
                <FaChartPie className="stat-card-icon green" />
              </div>
              <span className="stat-card-val profit-color">{winRate}%</span>
              <span className="stat-card-sub">{profitTrades.length} Wins / {lossTrades.length} Losses</span>
            </div>

            <div className="stat-card glow-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Execution Mode</span>
                <FiActivity className="stat-card-icon blue" />
              </div>
              <span className="stat-card-val highlight-text">Real-Time</span>
              <span className="stat-card-sub">Mirroring Active</span>
            </div>
          </div>

          {/* Trade Logs Table Container */}
          <div className="logs-table-wrapper glow-card">
            <div className="table-filter-bar">
              <div className="filter-tabs">
                <button
                  className={`tab-btn ${logFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setLogFilter('all')}
                >
                  All Logs ({totalTrades})
                </button>
                <button
                  className={`tab-btn ${logFilter === 'profit' ? 'active' : ''}`}
                  onClick={() => setLogFilter('profit')}
                >
                  Profitable ({profitTrades.length})
                </button>
                <button
                  className={`tab-btn ${logFilter === 'loss' ? 'active' : ''}`}
                  onClick={() => setLogFilter('loss')}
                >
                  Losses ({lossTrades.length})
                </button>
              </div>

              {/* Log Search */}
              <div className="log-search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Filter by pair (e.g. EUR/USD)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loader ? (
              <div className="table-scroll-container">
                <table className="trade-logs-table">
                  <thead>
                    <tr>
                      <th>Trade Pair</th>
                      <th>Executed Amount</th>
                      <th>Direction / Type</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRowSkeleton key={i} columns={4} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : filteredTrades.length === 0 ? (
              <EmptyStateCard
                title="No Trade Logs Available"
                description={
                  searchTerm
                    ? `No trade logs found matching "${searchTerm}".`
                    : 'Your trader has not placed any trades yet. Trades taken by your master trader will be logged here instantly.'
                }
                actionText="Explore Master Traders"
                actionLink="/traders"
              />
            ) : (
              <div className="table-scroll-container">
                <table className="trade-logs-table">
                  <thead>
                    <tr>
                      <th>Trade Pair</th>
                      <th>Amount (USD)</th>
                      <th>Outcome</th>
                      <th>Execution Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrades.map((trade, index) => {
                      const isProfit = trade.tradeType === 'profit';
                      return (
                        <tr key={index} className="log-row">
                          <td className="pair-cell">
                            <span className="pair-symbol">{trade.pair || 'BTC/USDT'}</span>
                          </td>
                          <td className="amount-cell">
                            ${Number(trade.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                          </td>
                          <td>
                            <span className={`outcome-badge ${isProfit ? 'profit' : 'loss'}`}>
                              {isProfit ? <FiTrendingUp /> : <FiTrendingDown />}
                              {trade.tradeType || 'profit'}
                            </span>
                          </td>
                          <td className="date-cell">{trade.date || 'Today'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserdashboardCopytrade;