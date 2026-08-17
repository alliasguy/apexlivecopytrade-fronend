import React, { useState, useEffect } from 'react'
import Userdashboardheader from '../userdashboardheader/Userdashboardheader'
import DashboardTopbar from '../dashboardtopbar/DashboardTopbar'
import MobileDropdown from '../MobileDropdown'
import { useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiClock, FiXCircle, FiUploadCloud, FiAlertTriangle } from 'react-icons/fi'
import { Badge, Button, Card, Input, toast } from '../ui'
import './userdashboardkyc.css'

const DOCUMENT_TYPES = [
  { value: 'passport', label: 'Passport' },
  { value: 'national_id', label: 'National ID card' },
  { value: 'drivers_license', label: "Driver's license" },
]

const MAX_FILE_BYTES = 4 * 1024 * 1024

const fileToDataUri = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(file)
})

const emptyForm = { firstName: '', lastName: '', country: '', state: '', postalCode: '', address: '', documentType: 'passport' }

const UserdashboardKyc = ({ route }) => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState()
  const [kyc, setKyc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showMobileDropdown, setShowMobileDropdown] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)

  const token = () => localStorage.getItem('token')

  const loadStatus = async () => {
    const t = token()
    if (!t) {
      navigate('/login')
      return
    }
    setLoading(true)
    setLoadError(false)
    try {
      const [statusRes, dataRes] = await Promise.all([
        fetch(`${route}/api/kyc/status`, { headers: { 'x-access-token': t } }),
        fetch(`${route}/api/getData`, { headers: { 'x-access-token': t } }),
      ])
      // A missing/misconfigured endpoint (e.g. backend not yet deployed
      // with this route) returns a non-JSON error page - treat that the
      // same as a network failure rather than letting .json() throw past
      // this check into the catch block with no useful message.
      if (!statusRes.ok || !dataRes.ok) {
        throw new Error(`Request failed (status ${statusRes.status}/${dataRes.status})`)
      }
      const statusJson = await statusRes.json()
      const dataJson = await dataRes.json()

      if (dataJson.status === 'error') {
        navigate('/login')
        return
      }
      if (statusJson.status !== 'ok') {
        throw new Error(statusJson.message || 'Unexpected response')
      }

      setUserData(dataJson)
      setKyc(statusJson.kyc)
      if (statusJson.kyc.status === 'unsubmitted' || statusJson.kyc.status === 'rejected') {
        setForm({
          firstName: statusJson.kyc.firstName || dataJson.firstname || '',
          lastName: statusJson.kyc.lastName || dataJson.lastname || '',
          country: statusJson.kyc.country || dataJson.country || '',
          state: statusJson.kyc.state || dataJson.state || '',
          postalCode: statusJson.kyc.postalCode || '',
          address: statusJson.kyc.address || dataJson.address || '',
          documentType: statusJson.kyc.documentType || 'passport',
        })
      }
    } catch (error) {
      setLoadError(true)
      toast.error('Could not load your KYC status - please try again')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeMobileMenu = () => setShowMobileDropdown(false)

  const handleFieldChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(selected.type)) {
      toast.error('Please upload a PNG, JPG or WebP image')
      e.target.value = ''
      return
    }
    if (selected.size > MAX_FILE_BYTES) {
      toast.error('Document image must be under 4MB')
      e.target.value = ''
      return
    }
    setFile(selected)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.country || !form.state || !form.postalCode || !form.address) {
      toast.warning('Please fill in every field')
      return
    }
    if (!file) {
      toast.warning('Please upload a photo of your document')
      return
    }

    setSubmitting(true)
    try {
      const documentImage = await fileToDataUri(file)
      const req = await fetch(`${route}/api/kyc/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-access-token': token() },
        body: JSON.stringify({ ...form, documentImage }),
      })
      const res = await req.json()
      if (res.status === 'ok') {
        toast.success('KYC submitted - your documents are now under review')
        setFile(null)
        await loadStatus()
      } else {
        toast.error(res.message || 'Could not submit KYC')
      }
    } catch (error) {
      toast.error('Could not submit KYC - please try again')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStatusCard = () => {
    if (kyc.status === 'approved') {
      return (
        <Card padding="lg" className="kyc-status-card">
          <FiCheckCircle className="kyc-status-icon kyc-status-icon--success" />
          <h2>Identity verified</h2>
          <p>Your KYC documents have been reviewed and approved. You have full access to all account features.</p>
          <Badge tone="success">Verified</Badge>
        </Card>
      )
    }
    if (kyc.status === 'pending') {
      return (
        <Card padding="lg" className="kyc-status-card">
          <FiClock className="kyc-status-icon kyc-status-icon--pending" />
          <h2>Under review</h2>
          <p>We've received your documents and they're being reviewed. This usually takes 1-2 business days.</p>
          <Badge tone="warning">Pending review</Badge>
        </Card>
      )
    }
    return null
  }

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

        <div className="kyc-page-header">
          <h2 className="section-heading">Identity verification</h2>
          <p>Verify your identity to unlock full access to deposits and withdrawals.</p>
        </div>

        {loading ? (
          <Card padding="lg" className="kyc-status-card">
            <div className="kyc-status-icon kyc-skeleton-circle kyc-skeleton-shimmer" />
            <div className="kyc-skeleton-line kyc-skeleton-line--title kyc-skeleton-shimmer" />
            <div className="kyc-skeleton-line kyc-skeleton-line--text kyc-skeleton-shimmer" />
            <div className="kyc-skeleton-line kyc-skeleton-line--text-short kyc-skeleton-shimmer" />
            <div className="kyc-skeleton-badge kyc-skeleton-shimmer" />
          </Card>
        ) : loadError || !kyc ? (
          <Card padding="lg" className="kyc-status-card">
            <FiAlertTriangle className="kyc-status-icon kyc-status-icon--rejected" />
            <h2>Couldn't load your KYC status</h2>
            <p>Something went wrong reaching the server. Please check your connection and try again.</p>
            <Button onClick={loadStatus}>Retry</Button>
          </Card>
        ) : kyc.status === 'approved' || kyc.status === 'pending' ? (
          renderStatusCard()
        ) : (
          <>
            {kyc.status === 'rejected' && (
              <Card padding="md" className="kyc-rejection-banner">
                <FiXCircle className="kyc-status-icon kyc-status-icon--rejected" />
                <div>
                  <p className="kyc-rejection-title">Your submission was not approved</p>
                  <p className="kyc-rejection-reason">{kyc.rejectionReason || 'Please review your details and resubmit.'}</p>
                </div>
              </Card>
            )}

            <Card padding="lg">
              <form className="kyc-form" onSubmit={handleSubmit}>
                <div className="kyc-form-grid">
                  <Input label="First name" required value={form.firstName} onChange={handleFieldChange('firstName')} />
                  <Input label="Last name" required value={form.lastName} onChange={handleFieldChange('lastName')} />
                  <Input label="Country" required value={form.country} onChange={handleFieldChange('country')} />
                  <Input label="State" required value={form.state} onChange={handleFieldChange('state')} />
                  <Input label="Postal code" required value={form.postalCode} onChange={handleFieldChange('postalCode')} />
                  <div className="kyc-field">
                    <label className="kyc-select-label" htmlFor="documentType">Document type</label>
                    <select id="documentType" className="kyc-select" value={form.documentType} onChange={handleFieldChange('documentType')}>
                      {DOCUMENT_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input label="Address" required value={form.address} onChange={handleFieldChange('address')} />

                <div className="kyc-field">
                  <label className="kyc-select-label" htmlFor="kyc-document">Document photo</label>
                  <label htmlFor="kyc-document" className="kyc-upload-dropzone">
                    <FiUploadCloud />
                    <span>{file ? file.name : 'Click to upload a clear photo (PNG, JPG or WebP, max 4MB)'}</span>
                    <input
                      id="kyc-document"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="kyc-upload-input"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                <Button type="submit" fullWidth loading={submitting}>
                  {kyc.status === 'rejected' ? 'Resubmit KYC' : 'Submit KYC'}
                </Button>
              </form>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}

export default UserdashboardKyc
