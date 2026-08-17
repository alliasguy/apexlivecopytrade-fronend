import React, { useState, useEffect } from 'react'
import './userdashboardhomepage.css'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import { IoCloseSharp, IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { RiLuggageDepositLine } from "react-icons/ri";
import Userdashboardheader from '../userdashboardheader/Userdashboardheader'
import DashboardTopbar from '../dashboardtopbar/DashboardTopbar'
import { BiMoneyWithdraw } from "react-icons/bi";
import TeslaWidget from '../TeslaWidget'
import MobileDropdown from '../MobileDropdown';
import { Card, Badge, FinancialFigure, Table, Button, toast } from '../ui';
import EmptyStateCard from '../common/EmptyStateCard';
import { StatCardSkeleton } from '../common/SkeletonLoader';

const RANK_TIERS = [
  { threshold: 20000, name: 'Diamond', tone: 'primary', image: '/diamond.png', range: '$20,001 - unlimited', bonus: '$500' },
  { threshold: 5000, name: 'Gold', tone: 'warning', image: '/download-removebg-preview (2).png', range: '$5,001 - $20,000', bonus: '$100' },
  { threshold: 0, name: 'Silver', tone: 'neutral', image: '/images-removebg-preview.png', range: '$0 - $5,000', bonus: '$50' },
];

const getRank = (totalDeposit) => RANK_TIERS.find((tier) => totalDeposit > tier.threshold) || RANK_TIERS[RANK_TIERS.length - 1];

const Userdashboardhomepage = ({ route }) => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(true)
  const [showMobileDropdown, setShowMobileDropdown] = useState(false)
  const [showRankDetails, setShowRankDetails] = useState(false)
  const [dailyTrades, setDailyTrades] = useState([])

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);

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
        toast.error('Could not load your dashboard - please try again');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [navigate, route]);

  const closeMobileMenu = () => {
    setShowMobileDropdown(false)
  }

  useEffect(() => {
    if (userData?.trades?.length > 0) {
      setDailyTrades(userData.trades.filter((trade) => isToday(trade.date)));
    }
  }, [userData]);

  const rank = userData ? getRank(userData.totaldeposit) : null;
  const balanceValue = Math.round(userData?.funded || 0);

  return (
    <main className='homewrapper'>
      <Userdashboardheader />
      <section className='dashboardhomepage'>

        <DashboardTopbar
          greetingName={userData?.firstname}
          hasAlert={showNotification && userData && userData.funded === 0}
          onProfileClick={() => setShowMobileDropdown(!showMobileDropdown)}
          onMenuClick={() => setShowMobileDropdown(!showMobileDropdown)}
        />

        {
          userData && showNotification && userData.funded === 0 &&
          <motion.div
            className="notification-dashoboard-container"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="notification-card">
              <p>You have not deposited yet - click <Link to='/fundwallet'>here</Link> to make your first deposit</p>
              <button type="button" className="close-notification-container" onClick={() => setShowNotification(false)} aria-label="Dismiss notification">
                <IoCloseSharp />
              </button>
            </div>
          </motion.div>
        }

        <div className="dashboard-overview-container">
          <MobileDropdown showStatus={showMobileDropdown} route={route} closeMenu={closeMobileMenu} />

          <Card padding="lg" glass className="balance-card">
            <div className="upper-overview-card">
              <div className="total-balance-container">
                <p className="main-balance">Total Portfolio Balance</p>
                {loading ? (
                  <div className="balance-skeleton" aria-hidden="true" />
                ) : (
                  <div className="amount">
                    <h2>
                      $<CountUp end={balanceValue} duration={1.5} separator="," />.00
                    </h2>
                    <span className="usd-btn">USD</span>
                  </div>
                )}
              </div>
              <div className="overview-btn-container">
                <div className="deposit-btn-container">
                  <Button onClick={() => navigate('/fundwallet')}>Deposit</Button>
                  <Button variant="outline" onClick={() => navigate('/withdraw')}>Withdraw</Button>
                </div>
              </div>
            </div>

            <div className="lower-overview-card-container">
              <div className="lower-overview-card">
                <div className="lower-card-icon-container">
                  <RiLuggageDepositLine />
                </div>
                <div className="lower-card-text-container">
                  <p className="lower-card-label">Total Deposit</p>
                  <p className="lower-card-value">
                    ${userData ? Number(userData.totaldeposit).toLocaleString() : '0'}.00
                  </p>
                </div>
              </div>
              <div className="lower-overview-card">
                <div className="lower-card-icon-container">
                  <BiMoneyWithdraw />
                </div>
                <div className="lower-card-text-container">
                  <p className="lower-card-label">Total Withdrawal</p>
                  <p className="lower-card-value">
                    ${userData ? Number(userData.totalwithdraw).toLocaleString() : '0'}.00
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="dashboard-chart-container">
          <TeslaWidget />
        </div>

        <div className="dashboard-rank-section">
          <div className="dashboard-rank-header">
            <h2 className="section-heading">Current Tier <span className="section-heading-accent">Rank</span></h2>
            <button
              type="button"
              className="rank-disclosure-btn"
              onClick={() => setShowRankDetails(!showRankDetails)}
            >
              <span>{showRankDetails ? 'Hide All Tiers' : 'View Tier Breakdown'}</span>
              {showRankDetails ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
            </button>
          </div>

          {loading ? (
            <StatCardSkeleton />
          ) : (
            <Card padding="md" glass className="rank-card">
              <div className="rank-trader-header">
                <div className="rank-trader-image-container">
                  <img src={rank.image} alt={rank.name} className='rank-trader-image' />
                </div>
                <div className="rank-trader-text-container">
                  <div className="rank-trader-name-row">
                    <h3 className="rank-trader-name">{rank.name} Tier</h3>
                    <Badge tone={rank.tone}>Active Rank</Badge>
                  </div>
                </div>
              </div>
              <div className="rank-performance-container">
                <div className="rank-performance-item">
                  <p className="rank-performance-label">Capital Range</p>
                  <p className="rank-performance-value">{rank.range}</p>
                </div>
                <div className="rank-performance-item">
                  <p className="rank-performance-label">Rank Bonus</p>
                  <p className="rank-performance-value">{rank.bonus}</p>
                </div>
              </div>

              <AnimatePresence>
                {showRankDetails && (
                  <motion.div
                    className="rank-tiers-grid"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="rank-tiers-title">All VIP Membership Tiers</div>
                    <div className="rank-tiers-list">
                      {RANK_TIERS.map((tier) => (
                        <div
                          key={tier.name}
                          className={`rank-tier-row ${rank.name === tier.name ? 'rank-tier-row--active' : ''}`}
                        >
                          <div className="rank-tier-info">
                            <span className="rank-tier-badge-name">{tier.name}</span>
                            <span className="rank-tier-range">{tier.range}</span>
                          </div>
                          <div className="rank-tier-bonus">Bonus: {tier.bonus}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )}
        </div>

        <div className="daily-trades-section">
          <div className="daily-trades-header">
            <h2 className="section-heading">Daily Trade Logs</h2>
            <p>Real-time execution log of trades taken for your account today.</p>
          </div>

          {loading ? (
            <Table
              columns={[
                { key: 'pair', header: 'Trade Pair' },
                { key: 'amount', header: 'Amount', align: 'right' },
                { key: 'type', header: 'Type' },
                { key: 'date', header: 'Date' },
              ]}
              rows={[]}
              loading
            />
          ) : dailyTrades.length !== 0 ? (
            <Table
              columns={[
                { key: 'pair', header: 'Trade Pair' },
                {
                  key: 'amount',
                  header: 'Amount',
                  align: 'right',
                  render: (row) => (
                    <FinancialFigure
                      value={row.tradeType === 'profit' ? Number(row.amount) : -Number(row.amount)}
                      format="currency"
                      size="sm"
                    />
                  ),
                },
                {
                  key: 'type',
                  header: 'Type',
                  render: (row) => <Badge tone={row.tradeType === 'profit' ? 'success' : 'error'}>{row.tradeType}</Badge>,
                },
                { key: 'date', header: 'Date' },
              ]}
              rows={dailyTrades}
              getRowKey={(row, i) => `${row.pair}-${row.date}-${i}`}
            />
          ) : (
            <EmptyStateCard
              title="No trades recorded today"
              description="Your master trader has not executed trades for your portfolio today. New trade entries will render here live as executed."
              actionText="Browse Master Traders"
              actionLink="/traders"
            />
          )}
        </div>
      </section>
    </main>
  )
}

export default Userdashboardhomepage
