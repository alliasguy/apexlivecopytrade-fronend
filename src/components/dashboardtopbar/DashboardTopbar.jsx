import React from 'react'
import { FaUserAlt, FaAngleDown } from 'react-icons/fa'
import { IoMdNotifications } from 'react-icons/io'
import { RxHamburgerMenu } from 'react-icons/rx'
import { ThemeToggle } from '../ui'
import './dashboardtopbar.css'

/**
 * Shared top bar for dashboard pages - sidebar toggle, bell, greeting,
 * profile/mobile-menu trigger, and the theme toggle, all consistently
 * aligned. Replaces the near-identical header markup that used to be
 * hand-copied into every dashboard page (see AUDIT.md §4).
 */
export default function DashboardTopbar({ greetingName, hasAlert = false, onProfileClick, onMenuClick }) {
  return (
    <div className="dashboard-topbar">
      {onMenuClick && (
        <button
          type="button"
          className="dashboard-topbar__menu-toggle"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <RxHamburgerMenu />
        </button>
      )}
      <ThemeToggle />
      <div className="dashboard-topbar__bell">
        {hasAlert && <span className="dashboard-topbar__alert-dot" aria-hidden="true" />}
        <IoMdNotifications />
      </div>
      {greetingName !== undefined && (
        <div className="dashboard-topbar__greeting">
          <h3>Hi, {greetingName || ''}</h3>
        </div>
      )}
      <button type="button" className="dashboard-topbar__profile" onClick={onProfileClick}>
        <span className="dashboard-topbar__profile-icon"><FaUserAlt /></span>
        <span className="dashboard-topbar__profile-chevron"><FaAngleDown /></span>
      </button>
    </div>
  )
}
