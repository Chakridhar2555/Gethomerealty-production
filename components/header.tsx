"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Settings, 
  LogOut, 
  User,
  UserCircle,
  UserCog,
  UserPlus,
  Users,
  Shield,
  Key,
  History,
  Mail,
  Home,
  FileText,
  Calendar,
  X,
  Menu
} from "lucide-react"
import routes from "@/lib/routes"

interface SearchResult {
  id: string
  type: 'lead' | 'property' | 'user' | 'document' | 'showing'
  title: string
  subtitle: string
  url: string
}

export function Header() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Get unread notifications count
    const notificationsData = localStorage.getItem("notifications")
    if (notificationsData) {
      const notifications = JSON.parse(notificationsData)
      setUnreadCount(notifications.filter((n: any) => !n.read).length)
    }

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim().length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    setShowResults(true)

    try {
      const results: SearchResult[] = []
      
      // Search leads
      const leads = JSON.parse(localStorage.getItem('leads') || '[]')
      leads.forEach((lead: any) => {
        if (lead.name.toLowerCase().includes(query.toLowerCase()) ||
            lead.email.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: lead._id,
            type: 'lead',
            title: lead.name,
            subtitle: lead.email,
            url: routes.lead(lead._id)
          })
        }
      })

      // Search users
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      users.forEach((user: any) => {
        if (user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: user.id,
            type: 'user',
            title: user.name,
            subtitle: user.email,
            url: routes.userProfile(user.id)
          })
        }
      })

      // Add property searches
      const properties = JSON.parse(localStorage.getItem('properties') || '[]')
      properties.forEach((property: any) => {
        if (property.address.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: property.id,
            type: 'property',
            title: property.address,
            subtitle: `$${property.price.toLocaleString()}`,
            url: routes.property(property.id)
          })
        }
      })

      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const getSearchIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'lead': return <UserPlus className="h-4 w-4 flex-shrink-0" />
      case 'property': return <Home className="h-4 w-4 flex-shrink-0" />
      case 'user': return <UserCircle className="h-4 w-4 flex-shrink-0" />
      case 'document': return <FileText className="h-4 w-4 flex-shrink-0" />
      case 'showing': return <Calendar className="h-4 w-4 flex-shrink-0" />
      default: return <Search className="h-4 w-4 flex-shrink-0" />
    }
  }

  const handleLogout = () => {
    // Clear all auth data
    localStorage.clear()
    
    // Clear the auth cookie
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    
    // Redirect to root page
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col sm:flex-row items-start sm:items-center h-auto sm:h-14 px-3 sm:px-4">
        <div className="flex items-center justify-between w-full sm:w-auto py-2 sm:py-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setShowDropdown(!showDropdown)}>
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-semibold">Admin</span>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className={`w-full pb-2 sm:pb-0 sm:w-auto sm:ml-4 sm:flex-1 ${isMobileSearchOpen ? 'block' : 'hidden sm:block'}`}>
          <div className="relative w-full" ref={searchRef}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 pr-4 h-9 sm:h-10 text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-[60vh] overflow-y-auto z-50">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      router.push(result.url);
                      setShowResults(false);
                      setSearchQuery('');
                    }}
                  >
                    {getSearchIcon(result.type)}
                    <div>
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-gray-500">{result.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`hidden sm:flex items-center gap-4 ml-auto ${showDropdown ? 'flex flex-col absolute top-full left-0 right-0 bg-white border-b p-2 sm:relative sm:flex-row sm:p-0 sm:border-0' : ''}`}>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">{user?.name || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push('/settings/profile')}>
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

