import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import Userdashboardheader from '../userdashboardheader/Userdashboardheader';
import DashboardTopbar from '../dashboardtopbar/DashboardTopbar';
import MobileDropdown from '../MobileDropdown';
import { BsImage } from 'react-icons/bs';
import { RxUpload } from 'react-icons/rx';
import { FiShield, FiLock } from 'react-icons/fi';
import { Badge, Button, Card, CardHeader, Input, toast } from '../ui';

const KYC_STATUS_TONE = { unsubmitted: 'neutral', pending: 'warning', approved: 'success', rejected: 'error' };
const KYC_STATUS_LABEL = { unsubmitted: 'Not started', pending: 'Pending review', approved: 'Verified', rejected: 'Rejected' };

const Profile = ({ route }) => {
  const [form, setForm] = useState({ firstname: '', lastname: '', country: '', zipcode: '', state: '', phonenumber: '', address: '' });
  const [userData, setUserData] = useState(null);
  const [kycStatus, setKycStatus] = useState('unsubmitted');
  const [profileImage, setProfileImage] = useState();
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const navigate = useNavigate();
  const token = () => localStorage.getItem('token');

  useEffect(() => {
    const t = token();
    if (!t) {
      navigate('/login');
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const [dataRes, kycRes] = await Promise.all([
          fetch(`${route}/api/getData`, { headers: { 'x-access-token': t } }),
          fetch(`${route}/api/kyc/status`, { headers: { 'x-access-token': t } }),
        ]);
        const res = await dataRes.json();
        if (res.status === 'error') {
          navigate('/login');
          return;
        }
        setUserData(res);
        setForm({
          firstname: res.firstname || '',
          lastname: res.lastname || '',
          country: res.country || '',
          zipcode: res.zipcode || '',
          state: res.state || '',
          phonenumber: res.phonenumber || '',
          address: res.address || '',
        });
        setProfileImage(res.profilepicture);
        const kycJson = await kycRes.json();
        if (kycJson.status === 'ok') setKycStatus(kycJson.kyc.status);
      } catch (error) {
        toast.error('Could not load your profile');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const uploadProfilePicture = async (file) => {
    if (!file) return;
    setUploadingPicture(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'upload');
      const req = await fetch('https://api.cloudinary.com/v1_1/duesyx3zu/image/upload', {
        method: 'POST',
        body: formData,
      });
      const res = await req.json();
      if (res.secure_url) {
        setProfileImage(res.secure_url);
      }
    } catch (error) {
      toast.error('Could not upload image');
    } finally {
      setUploadingPicture(false);
    }
  };

  const updateUserData = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const req = await fetch(`${route}/api/updateUserData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-access-token': token() },
        body: JSON.stringify({ ...form, profilepicture: profileImage }),
      });
      const res = await req.json();
      if (res.status === 200) {
        toast.success('Profile updated successfully');
      } else if (res.status === 400) {
        toast.warning('No changes were made');
      } else {
        toast.error('Internal server error');
      }
    } catch (error) {
      toast.error('Could not update your profile - please try again');
    } finally {
      setSaving(false);
    }
  };

  const closeMobileMenu = () => setShowMobileDropdown(false);

  return (
    <main className="homewrapper">
      <Userdashboardheader route={route} />
      <div className="dashboardhomepage">
        <DashboardTopbar
          greetingName={userData?.firstname}
          onProfileClick={() => setShowMobileDropdown(!showMobileDropdown)}
          onMenuClick={() => setShowMobileDropdown(!showMobileDropdown)}
        />
        <MobileDropdown showStatus={showMobileDropdown} route={route} closeMenu={closeMobileMenu} />

        <div className="settings-page-header">
          <h2 className="section-heading">Settings</h2>
          <p>Manage your profile information and account security.</p>
        </div>

        <div className="settings-grid">
          <Card padding="lg">
            <CardHeader title="Profile information" subtitle="This information is used across your account." />
            {!loading && (
              <form className="settings-form" onSubmit={updateUserData}>
                <div className="profile-picture-row">
                  <div className="profile-circle">
                    {profileImage ? <img src={profileImage} alt="" className="profile-circle-img" /> : <BsImage />}
                  </div>
                  <label htmlFor="file-input" className="profile-upload-btn">
                    <RxUpload /> {uploadingPicture ? 'Uploading...' : 'Change photo'}
                    <input
                      type="file"
                      accept=".jpg, .png, .webp, .jpeg"
                      id="file-input"
                      className="profile-upload-input"
                      onChange={(e) => uploadProfilePicture(e.target.files[0])}
                    />
                  </label>
                </div>

                <div className="settings-form-grid">
                  <Input label="First name" value={form.firstname} onChange={handleChange('firstname')} required />
                  <Input label="Last name" value={form.lastname} onChange={handleChange('lastname')} required />
                  <Input label="Email" value={userData ? userData.email : ''} disabled />
                  <Input label="Phone number" type="tel" value={form.phonenumber} onChange={handleChange('phonenumber')} />
                  <Input label="Country" value={form.country} onChange={handleChange('country')} />
                  <Input label="State" value={form.state} onChange={handleChange('state')} />
                  <Input label="Postal code" value={form.zipcode} onChange={handleChange('zipcode')} />
                </div>
                <Input label="Address" value={form.address} onChange={handleChange('address')} />

                <Button type="submit" loading={saving}>Save changes</Button>
              </form>
            )}
          </Card>

          <div className="settings-side-column">
            <Card padding="lg">
              <CardHeader title="Identity verification" />
              <div className="settings-side-row">
                <FiShield className="settings-side-icon" />
                <div>
                  <p className="settings-side-label">KYC status</p>
                  <Badge tone={KYC_STATUS_TONE[kycStatus]}>{KYC_STATUS_LABEL[kycStatus]}</Badge>
                </div>
              </div>
              <Button variant="outline" fullWidth onClick={() => navigate('/kyc')}>
                {kycStatus === 'unsubmitted' || kycStatus === 'rejected' ? 'Complete verification' : 'View status'}
              </Button>
            </Card>

            <Card padding="lg">
              <CardHeader title="Security" />
              <div className="settings-side-row">
                <FiLock className="settings-side-icon" />
                <div>
                  <p className="settings-side-label">Password</p>
                  <p className="settings-side-description">Reset your password via email.</p>
                </div>
              </div>
              <Button variant="outline" fullWidth onClick={() => navigate('/passwordreset')}>
                Reset password
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
