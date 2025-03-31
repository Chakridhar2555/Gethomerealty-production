"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  UserCircle,
  UserCog,
  Heart, 
  Inbox, 
  Package, 
  Calendar, 
  Settings, 
  LogOut,
  Bell,
  Shield,
  BellRing,
  Mail,
  Building2,
  Send,
  MailPlus,
  ScrollText
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/lib/notifications"
import routes from "@/lib/routes"

interface SidebarItem {
  icon: any;
  label: string;
  href: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'showing' | 'document' | 'system';
  date: string;
  read: boolean;
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<{ name: string; email?: string }>({ name: "User" })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const storedNotifications = localStorage.getItem('notifications')
      const userData = localStorage.getItem("user")
      
      if (storedNotifications) {
        try {
          setNotifications(JSON.parse(storedNotifications))
        } catch (error) {
          console.error("Error parsing notifications:", error)
          setNotifications([])
        }
      }

      if (userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    }
  }, [mounted])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    )
    setNotifications(updatedNotifications)
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }))
    setNotifications(updatedNotifications)
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
  }

  const clearNotifications = () => {
    setNotifications([])
    localStorage.setItem('notifications', '[]')
  }

  const unreadCount = mounted ? notifications.filter(n => !n.read).length : 0

  const navigation = [
    {
      label: "Dashboard",
      href: routes.dashboard,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Leads",
      href: routes.leads,
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Inbox",
      href: routes.inbox,
      icon: <Mail className="h-5 w-5" />,
    },
    {
      label: "Calendar",
      href: routes.calendar,
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Inventory",
      href: routes.inventory,
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      label: "Email Templates",
      href: routes.emailTemplates,
      icon: <Mail className="h-5 w-5" />,
    },
    {
      label: "Users",
      href: routes.users,
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: routes.settings,
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen p-4 flex flex-col">
      <div className="text-red-500 text-xl font-semibold mb-8">Get Home Realty</div>
      <nav className="space-y-2 flex-grow">
        {navigation.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors
              ${pathname === item.href 
                ? "bg-red-100 text-red-500" 
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="border-t pt-4 mt-auto">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}

