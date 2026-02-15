'use client'

import * as React from 'react'
import { Home, BarChart3, Users, FileText, Settings, LogOut, Bell, Menu, X } from 'lucide-react'

interface SidebarItem {
  name: string
  href: string
  icon?: string | React.ReactNode
  active?: boolean
}

interface SidebarProps {
  items: SidebarItem[]
  appName: string
  themeColor?: string
  logoIcon?: React.ReactNode
  className?: string
}

export function Sidebar({ items, appName, themeColor = '#3b82f6', logoIcon, className }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        setUser(JSON.parse(userStr))
      }
    } catch (e) {
      console.error('Error reading user from localStorage:', e)
    }
  }, [])

  // Close sidebar when clicking outside on mobile
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  const getIcon = (icon?: string | React.ReactNode) => {
    if (typeof icon === 'string') {
      const IconMap: Record<string, React.ReactNode> = {
        'H': <Home className="w-5 h-5" />,
        'T': <FileText className="w-5 h-5" />,
        '$': <BarChart3 className="w-5 h-5" />,
        'W': <Users className="w-5 h-5" />,
        'S': <Settings className="w-5 h-5" />,
      }
      return IconMap[icon] || <FileText className="w-5 h-5" />
    }
    return icon || <FileText className="w-5 h-5" />
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden bg-white dark:bg-slate-900 p-2 rounded-lg border border-gray-200 dark:border-slate-800 shadow-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-gray-900 dark:text-white" /> : <Menu className="w-6 h-6 text-gray-900 dark:text-white" />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-56 bg-white dark:bg-slate-900 transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-slate-800
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${className || ''}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-2 p-4 border-b border-gray-200 dark:border-slate-800">
            {logoIcon || (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)` }}
              >
                {appName.charAt(0)}
              </div>
            )}
            <span className="text-lg font-bold text-gray-900 dark:text-white">{appName}</span>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors no-underline
                  ${item.active
                    ? 'text-white dark:text-white'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'}
                `}
                style={item.active ? { backgroundColor: themeColor } : {}}
              >
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          {user && (
            <div className="p-4 border-t border-gray-200 dark:border-slate-800">
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: themeColor }}
                >
                  {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white font-medium truncate">
                    {user.firstName || user.email?.split('@')[0]}
                  </p>
                  <p className="text-gray-500 dark:text-slate-400 text-sm truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}
