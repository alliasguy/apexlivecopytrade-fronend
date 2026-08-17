import React, { useState, useEffect } from 'react'
import Userdashboardheader from '../userdashboardheader/Userdashboardheader'
import DashboardTopbar from '../dashboardtopbar/DashboardTopbar'
import MobileDropdown from '../MobileDropdown'
import { useNavigate } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'
import { Badge, Button, Card } from '../ui'
import '../common/skeletonloader.css'
import './userdashboardranking.css'

const RANK_TIERS = [
  { key: 'silver', name: 'Silver', tone: 'neutral', image: '/images-removebg-preview.png', min: 0, max: 5000, range: '$0 - $5,000', bonus: '$50' },
  { key: 'gold', name: 'Gold', tone: 'warning', image: '/download-removebg-preview (2).png', min: 5000, max: 20000, range: '$5,001 - $20,000', bonus: '$100' },
  { key: 'diamond', name: 'Diamond', tone: 'primary', image: '/diamond.png', min: 20000, max: Infinity, range: '$20,001 - unlimited', bonus: '$500' },
]

const getCurrentTierKey = (totalDeposit) => {
  if (totalDeposit > 20000) return 'diamond'
  if (totalDeposit > 5000) return 'gold'
  return 'silver'
}

const UserdashboardRanking = ({ route }) => {
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(true)
  const [showMobileDropdown, setShowMobileDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    const getData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${route}/api/getData`, {
          headers: { 'x-access-token': token, 'Content-Type': 'application/json' },
        })
        const data = await response.json()
        if (data.status === 'error') {
          localStorage.removeItem('token')
          navigate('/login')
          return
        }
        setUserData(data)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [navigate, route])

  const closeMobileMenu = () => setShowMobileDropdown(false)

  const currentTierKey = userData ? getCurrentTierKey(userData.totaldeposit) : null
  const currentTier = RANK_TIERS.find((t) => t.key === currentTierKey)

  return (
    <main className="homewrapper">
      <Userdashboardheader />
      <div className="dashboardhomepage">
        <DashboardTopbar
          greetingName={userData?.firstname}
          onProfileClick={() => setShowMobileDropdown(!showMobileDropdown)}
          onMenuClick={() => setShowMobileDropdown(!showMobileDropdown)}
        />
        <MobileDropdown showStatus={showMobileDropdown} route={route} closeMenu={closeMobileMenu} />

        <div className="ranking-page-header">
          <h2 className="section-heading">Your rank</h2>
          <p>Your rank is based on your total deposits and unlocks a bigger welcome bonus at each tier.</p>
        </div>

        {loading ? (
          <Card padding="lg" className="ranking-current-card">
            <div className="ranking-current-header">
              <div className="ranking-current-image ranking-skeleton-circle skeleton-shimmer" />
              <div className="ranking-skeleton-header-text">
                <div className="skeleton-line ranking-skeleton-label skeleton-shimmer" />
                <div className="skeleton-line ranking-skeleton-title skeleton-shimmer" />
              </div>
            </div>
            <div className="ranking-current-stats">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <div className="skeleton-line ranking-skeleton-stat-label skeleton-shimmer" />
                  <div className="skeleton-line ranking-skeleton-stat-value skeleton-shimmer" />
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card padding="lg" className="ranking-current-card">
            <div className="ranking-current-header">
              <img src={currentTier.image} alt="" className="ranking-current-image" />
              <div>
                <p className="ranking-current-label">Current rank</p>
                <div className="ranking-current-name-row">
                  <h3>{currentTier.name}</h3>
                  <Badge tone={currentTier.tone}>Active</Badge>
                </div>
              </div>
            </div>
            <div className="ranking-current-stats">
              <div>
                <p className="ranking-stat-label">Total deposited</p>
                <p className="ranking-stat-value">${Math.round(userData.totaldeposit || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="ranking-stat-label">Capital range</p>
                <p className="ranking-stat-value">{currentTier.range}</p>
              </div>
              <div>
                <p className="ranking-stat-label">Welcome bonus</p>
                <p className="ranking-stat-value">{currentTier.bonus}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="ranking-tiers-header">
          <h2 className="section-heading">All ranks</h2>
        </div>

        <div className="ranking-tiers-grid">
          {RANK_TIERS.map((tier) => {
            const isCurrent = tier.key === currentTierKey;
            return (
              <Card key={tier.key} padding="lg" className={`ranking-tier-card ${isCurrent ? 'ranking-tier-card--current' : ''}`}>
                {isCurrent && <Badge tone={tier.tone} className="ranking-tier-current-badge">Your rank</Badge>}
                <img src={tier.image} alt="" className="ranking-tier-image" />
                <h3 className="ranking-tier-name">{tier.name}</h3>
                <ul className="ranking-tier-features">
                  <li><FiCheck /> Capital range: {tier.range}</li>
                  <li><FiCheck /> Welcome bonus: {tier.bonus}</li>
                </ul>
                {!isCurrent && (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate(tier.min > (userData?.totaldeposit || 0) ? '/fundwallet' : '/withdraw')}
                  >
                    {tier.min > (userData?.totaldeposit || 0) ? 'Deposit to upgrade' : 'View plans'}
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default UserdashboardRanking
