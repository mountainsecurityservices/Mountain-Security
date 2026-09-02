import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Info,
  KeyRound,
  Users,
  Building2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { MyAccountModal } from '../profile/MyAccountModal';

export const TopNav: React.FC = () => {
  const {
    currentUser,
    currentRole,
    logout,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    sidebarCollapsed,
    setSidebarCollapsed,
    setGlobalSearchOpen,
    activeTab,
    selectedFutureModule,
    users,
    quickSwitchUser,
    setActiveTab,
  } = useERP();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Live real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumb title
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Executive Dashboard';
      case 'users':
        return 'User Management';
      case 'roles':
        return 'Role Management';
      case 'permissions':
        return 'Permissions Matrix Catalog';
      case 'company-profile':
        return 'Company Profile & Licensing';
      case 'settings':
        return 'System Configuration';
      case 'audit-logs':
        return 'Audit & Security Trail';
      case 'future-module':
        return selectedFutureModule ? selectedFutureModule.name : 'Module Roadmap';
      default:
        return 'Mountain Security Services ERP';
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'critical':
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 no-print">
      {/* Left Area: Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-400"
          aria-label="Toggle sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>MSS ERP</span>
            <span>/</span>
            <span className="text-slate-600 truncate">{getTabTitle()}</span>
          </div>
          <h1 className="text-sm font-bold text-slate-900 font-['Space_Grotesk'] leading-tight truncate">
            {getTabTitle()}
          </h1>
        </div>
      </div>

      {/* Center Search Trigger (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          type="button"
          onClick={() => setGlobalSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/70 hover:bg-slate-100/80 text-slate-400 hover:text-slate-600 text-xs transition-colors shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            <span className="text-slate-500">Quick search (Users, Roles, Modules, Logs)...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={() => setGlobalSearchOpen(true)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-xs">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono font-medium">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400">MST</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-400"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-2xl border border-slate-200 z-40 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 font-['Space_Grotesk'] uppercase tracking-wider">
                    System Notifications
                  </h3>
                  {unreadNotificationCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                      {unreadNotificationCount} New
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                        n.isRead ? 'bg-white hover:bg-slate-50/70' : 'bg-blue-50/30 hover:bg-blue-50/60'
                      }`}
                    >
                      <div className="mt-0.5">{getNotifIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-xs font-semibold truncate ${
                              n.isRead ? 'text-slate-800' : 'text-slate-900 font-bold'
                            }`}
                          >
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-mono">
                            {n.createdAt.substring(11, 16)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-normal">{n.message}</p>
                        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                            {n.relatedModule || n.module || 'SYSTEM'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="text-slate-400 hover:text-red-600 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('audit-logs');
                    setNotifMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
                >
                  View Full Audit Logs <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-400"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs shadow-xs font-['Space_Grotesk']">
              {currentUser
                ? currentUser.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                : 'MS'}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-bold text-slate-900 truncate max-w-[130px] font-['Space_Grotesk']">
                {currentUser ? currentUser.fullName : 'Guest'}
              </div>
              <div className="text-[10px] font-medium text-slate-500 truncate max-w-[130px]">
                {currentRole ? currentRole.name : 'Authorized User'}
              </div>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-2xl border border-slate-200 z-40 p-2 divide-y divide-slate-100">
              <div className="px-3 py-2">
                <p className="text-xs font-bold text-slate-900 font-['Space_Grotesk'] truncate">
                  {currentUser?.fullName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  <Shield className="w-3 h-3 text-red-600" />
                  {currentRole?.name}
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setAccountModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  <span>My Account Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setAccountModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-slate-500" />
                  <span>Security & Password</span>
                </button>
              </div>

              {/* Quick Switch Role Simulator for Demo */}
              <div className="py-2 px-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Quick Switch Identity
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {users.slice(0, 6).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        quickSwitchUser(u.id);
                        setProfileMenuOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] truncate flex items-center justify-between ${
                        u.id === currentUser?.id
                          ? 'bg-slate-900 text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{u.fullName.split(' ')[0]}</span>
                      <span className="text-[9px] opacity-75">{u.username}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Profile & Security Modal */}
      <MyAccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </header>
  );
};
