import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Userdashboardheader from '../userdashboardheader/Userdashboardheader'
import DashboardTopbar from '../dashboardtopbar/DashboardTopbar'
import MobileDropdown from '../MobileDropdown'
import { Badge, Table } from '../ui'
import EmptyStateCard from '../common/EmptyStateCard'
import './userdashboardtransactions.css'

const TYPE_TONE = {
  deposit: 'success',
  withdraw: 'warning',
  investment: 'primary',
}

const formatCurrency = (value) => `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const Userdashboardtransactions = ({ route }) => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(true)
  const [showMobileDropdown, setShowMobileDropdown] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    const getData = async () => {
      try {
        setLoading(true)
        const req = await fetch(`${route}/api/getData`, {
          headers: { 'x-access-token': token }
        })
        const res = await req.json()
        if (res.status === 'error') {
          navigate('/login')
          return
        }
        setUserData(res)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [navigate, route])

  const closeMobileMenu = () => setShowMobileDropdown(false)

  const transactions = userData?.transaction || []

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

        <div className="transactions-page-header">
          <h2 className="section-heading">Transaction logs</h2>
          <p>We keep track of every transaction on your account.</p>
        </div>

        {loading ? (
          <Table
            columns={[
              { key: 'id', header: 'Transaction ID' },
              { key: 'type', header: 'Type' },
              { key: 'amount', header: 'Amount', align: 'right' },
              { key: 'date', header: 'Date' },
              { key: 'balance', header: 'Balance', align: 'right' },
            ]}
            rows={[]}
            loading
          />
        ) : transactions.length !== 0 ? (
          <Table
            columns={[
              {
                key: 'id',
                header: 'Transaction ID',
                render: (row) => <span className="transactions-id">{String(row.id).slice(0, 10)}&hellip;</span>,
              },
              {
                key: 'type',
                header: 'Type',
                render: (row) => <Badge tone={TYPE_TONE[row.type?.toLowerCase()] || 'neutral'}>{row.type}</Badge>,
              },
              { key: 'amount', header: 'Amount', align: 'right', render: (row) => formatCurrency(row.amount) },
              { key: 'date', header: 'Date' },
              { key: 'balance', header: 'Balance', align: 'right', render: (row) => formatCurrency(row.balance) },
            ]}
            rows={transactions}
            getRowKey={(row, i) => row.id || i}
          />
        ) : (
          <EmptyStateCard
            title="No transactions yet"
            description="You have not performed any transaction yet. Deposits, withdrawals and investments will appear here."
            actionText="Make a deposit"
            actionLink="/fundwallet"
          />
        )}
      </div>
    </main>
  )
}

export default Userdashboardtransactions
