"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { BedDoubleIcon, MenuIcon, UserIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    setIsLoggedIn(false)
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
    router.push("/")
  }

  const handleLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true")
    }
    setIsLoggedIn(true)
    toast({
      title: "Logged in successfully",
      description: "Welcome back to Hotel Ease!",
    })

    // If there was a redirect from booking, go back to that page
    if (typeof window !== "undefined") {
      const redirectUrl = localStorage.getItem("bookingRedirect")
      if (redirectUrl) {
        localStorage.removeItem("bookingRedirect")
        router.push(redirectUrl)
      } else {
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }

  useEffect(() => {
    // Check login status on mount
    if (typeof window !== "undefined") {
      const isUserLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(isUserLoggedIn)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BedDoubleIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">Hotel Ease</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/hotels" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Hotels</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>About Us</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <UserIcon className="mr-2 h-4 w-4" />
                  My Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/account/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/account/bookings")}>My Bookings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/account/favorites")}>Saved Hotels</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login" className="hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    // For demo purposes, let's simulate login
                    if (pathname === "/auth/login") {
                      e.preventDefault()
                      handleLogin()
                    }
                  }}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register" className="hidden md:block">
                <Button
                  size="sm"
                  onClick={(e) => {
                    // For demo purposes, let's simulate registration
                    if (pathname === "/auth/register") {
                      e.preventDefault()
                      handleLogin()
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="flex items-center gap-2">
                  <BedDoubleIcon className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold text-primary">Hotel Ease</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link href="/" className="text-lg font-medium">
                    Home
                  </Link>
                  <Link href="/hotels" className="text-lg font-medium">
                    Hotels
                  </Link>
                  <Link href="/about" className="text-lg font-medium">
                    About Us
                  </Link>
                  <Link href="/contact" className="text-lg font-medium">
                    Contact
                  </Link>
                </nav>
                <div className="flex flex-col gap-2 mt-auto">
                  {isLoggedIn ? (
                    <>
                      <Link href="/account/profile">
                        <Button variant="outline" className="w-full justify-start">
                          <UserIcon className="mr-2 h-4 w-4" />
                          My Account
                        </Button>
                      </Link>
                      <Button className="w-full" onClick={handleLogout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={(e) => {
                            // For demo purposes, let's simulate login
                            if (pathname === "/auth/login") {
                              e.preventDefault()
                              handleLogin()
                            }
                          }}
                        >
                          <UserIcon className="mr-2 h-4 w-4" />
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button
                          className="w-full"
                          onClick={(e) => {
                            // For demo purposes, let's simulate registration
                            if (pathname === "/auth/register") {
                              e.preventDefault()
                              handleLogin()
                            }
                          }}
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

