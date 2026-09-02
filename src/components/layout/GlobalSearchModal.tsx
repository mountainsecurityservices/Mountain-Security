import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Users,
  Shield,
  Settings,
  FileText,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  Command,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useERP } from '../../context/ERPContext';
import { ActiveTab } from '../../types';

interface SearchResultItem {
  id: string;
  category: 'Users' | 'Roles' | 'Navigation' | 'Settings' | 'Future Modules' | 'Audit Logs';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
  permissionRequired?: string;
}

export const GlobalSearchModal: React.FC = () => {
  const {
    globalSearchOpen,
    setGlobalSearchOpen,
    users,
    roles,
    futureModules,
    hasPermission,
    setActiveTab,
  } = useERP();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      }
      if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  // Build searchable index based on current permissions
  const searchIndex = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // 1. Navigation items
    items.push({
      id: 'nav-dashboard',
      category: 'Navigation',
      title: 'Executive Dashboard',
      subtitle: 'Overview of business, security operations and KPIs',
      icon: <Sparkles className="w-4 h-4 text-blue-500" />,
      action: () => setActiveTab('dashboard'),
    });

    if (hasPermission('company.view')) {
      items.push({
        id: 'nav-company',
        category: 'Navigation',
        title: 'Company Profile & Official Identity',
        subtitle: 'Mountain Security Services legal, licensing and credentials',
        icon: <Building2 className="w-4 h-4 text-emerald-500" />,
        action: () => setActiveTab('company-profile'),
      });
    }

    if (hasPermission('users.view')) {
      items.push({
        id: 'nav-users',
        category: 'Navigation',
        title: 'User Management',
        subtitle: 'Personnel accounts, security clearance and status control',
        icon: <Users className="w-4 h-4 text-indigo-500" />,
        action: () => setActiveTab('users'),
      });
    }

    if (hasPermission('roles.view')) {
      items.push({
        id: 'nav-roles',
        category: 'Navigation',
        title: 'Role Management',
        subtitle: 'Security roles, clearance hierarchy and permissions matrix',
        icon: <Shield className="w-4 h-4 text-purple-500" />,
        action: () => setActiveTab('roles'),
      });
    }

    if (hasPermission('permissions.view')) {
      items.push({
        id: 'nav-permissions',
        category: 'Navigation',
        title: 'Permissions Matrix Catalog',
        subtitle: 'Master resource actions and ERP permission tokens',
        icon: <Lock className="w-4 h-4 text-amber-500" />,
        action: () => setActiveTab('permissions'),
      });
    }

    if (hasPermission('audit.view')) {
      items.push({
        id: 'nav-audit',
        category: 'Navigation',
        title: 'System Audit Logs',
        subtitle: 'Forensic activity trail, authentication and admin records',
        icon: <FileText className="w-4 h-4 text-red-500" />,
        action: () => setActiveTab('audit-logs'),
      });
    }

    if (hasPermission('settings.view')) {
      items.push({
        id: 'nav-settings',
        category: 'Navigation',
        title: 'System Settings',
        subtitle: 'Security policies, timeouts, localization and parameters',
        icon: <Settings className="w-4 h-4 text-slate-500" />,
        action: () => setActiveTab('settings'),
      });
    }

    // 2. Users records (if allowed)
    if (hasPermission('users.view')) {
      users.forEach((u) => {
        const role = roles.find((r) => r.id === u.primaryRoleId);
        items.push({
          id: `usr-${u.id}`,
          category: 'Users',
          title: u.fullName,
          subtitle: `${u.username} • ${role?.name || 'Staff'} • ${u.email}`,
          icon: <Users className="w-4 h-4 text-blue-600" />,
          action: () => {
            setActiveTab('users');
          },
        });
      });
    }

    // 3. Roles records (if allowed)
    if (hasPermission('roles.view')) {
      roles.forEach((r) => {
        items.push({
          id: `role-${r.id}`,
          category: 'Roles',
          title: r.name,
          subtitle: `Code: ${r.code} • ${r.permissionCodes.length} permissions assigned`,
          icon: <Shield className="w-4 h-4 text-purple-600" />,
          action: () => {
            setActiveTab('roles');
          },
        });
      });
    }

    // 4. Future ERP Modules
    futureModules.forEach((mod) => {
      items.push({
        id: `fut-${mod.id}`,
        category: 'Future Modules',
        title: mod.name,
        subtitle: `${mod.group} • ${mod.phase} • ${mod.description.substring(0, 75)}...`,
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        action: () => {
          setActiveTab('future-module', mod.id);
        },
      });
    });

    return items;
  }, [hasPermission, users, roles, futureModules, setActiveTab]);

  // Filtered results
  const results = useMemo(() => {
    if (!query.trim()) {
      return searchIndex.slice(0, 8); // Top quick suggestions
    }
    const q = query.toLowerCase();
    return searchIndex
      .filter((item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
      .slice(0, 12);
  }, [searchIndex, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: SearchResultItem) => {
    item.action();
    setGlobalSearchOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {globalSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setGlobalSearchOpen(false)}
          />

          <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 divide-y divide-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Bar Input */}
              <div className="relative flex items-center px-4 py-3 bg-white">
                <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search users, roles, settings, security modules..."
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="text-slate-400 hover:text-slate-600 mr-2 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>

              {/* Results List */}
              <div className="max-h-96 overflow-y-auto p-2">
                {results.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No results found matching &quot;{query}&quot;. Try searching for &quot;User&quot;, &quot;Admin&quot;, &quot;Settings&quot;, or a future ERP module.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {results.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 shadow-xs">
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 font-['Space_Grotesk'] truncate">
                                  {item.title}
                                </span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded uppercase tracking-wider">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${isSelected ? 'translate-x-1 text-slate-900' : ''}`} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer navigation cues */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd>{' '}
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd>{' '}
                    Navigate
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">Enter</kbd>{' '}
                    Open
                  </span>
                </div>
                <span>Mountain Security Services ERP</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
