"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckIcon, CreditCard, MapPinIcon, StarIcon, UserIcon, WifiIcon } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter, useParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { getLocalStorage, setLocalStorage } from "@/lib/utils"

// Define proper types for our data
interface Amenity {
  name: string
  icon: React.ElementType
}

interface Room {
  id: number
  name: string
  price: number
  capacity: number
  size: string
  beds: string
  amenities: string[]
  image: string
}

interface Review {
  id: number
  name: string
  rating: number
  date: string
  comment: string
  avatar: string
}

interface Hotel {
  id: string
  name: string
  location: string
  price: number
  rating: number
  images: string[]
  description: string
  amenities: Amenity[]
  rooms: Room[]
  reviews: Review[]
}

export default function HotelDetailPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams() // Use useParams hook instead of accessing params directly
  const hotelId = params?.id as string // Safely access id

  // Loading state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hotel, setHotel] = useState<Hotel | null>(null)

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Booking state
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [adults, setAdults] = useState("2")
  const [children, setChildren] = useState("0")
  const [roomType, setRoomType] = useState("1")
  const [isBookingComplete, setIsBookingComplete] = useState(false)

  // Booking process state
  const [bookingStep, setBookingStep] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Guest details
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

  // Payment details
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [saveCard, setSaveCard] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  // Review state
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")

  // Load hotel data
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setIsLoading(true)

        // In a real app, this would be an API call
        // For demo, we'll just use a timeout to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Check if the hotel ID is valid
        if (!hotelId || isNaN(Number(hotelId)) || Number(hotelId) < 1 || Number(hotelId) > 4) {
          setError("Hotel not found. Please try another hotel.")
          setIsLoading(false)
          return
        }

        // Set the hotel data
        setHotel({
          ...hotelData,
          id: hotelId,
        })
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching hotel data:", err)
        setError("Failed to load hotel details. Please try again.")
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Failed to load hotel details. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchHotelData()
  }, [hotelId, toast])

  // Check login status on mount - use a ref to prevent hydration mismatch
  useEffect(() => {
    // Safely check login status after component mounts
    const isUserLoggedIn = getLocalStorage("isLoggedIn") === "true"
    setIsLoggedIn(isUserLoggedIn)
  }, [])

  // Handle login for demo purposes
  const handleLogin = () => {
    setLocalStorage("isLoggedIn", "true")
    setIsLoggedIn(true)

    toast({
      title: "Logged in successfully",
      description: "You can now proceed with your booking.",
    })
  }

  // Handle booking initiation
  const initiateBooking = () => {
    if (!isLoggedIn) {
      // Save the current URL to redirect back after login
      setLocalStorage("bookingRedirect", `/hotels/${hotelId}`)

      toast({
        title: "Authentication required",
        description: "Please log in or sign up to continue with your booking.",
        variant: "destructive",
      })

      router.push("/auth/login")
      return
    }

    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Dates required",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      })
      return
    }

    // Open booking modal and start process
    setBookingStep(1)
    setShowBookingModal(true)
  }

  // Handle booking step navigation
  const nextStep = () => {
    try {
      // Validate current step
      if (bookingStep === 1) {
        if (!firstName || !lastName || !email || !phone) {
          toast({
            title: "Missing information",
            description: "Please fill in all required guest details.",
            variant: "destructive",
          })
          return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          toast({
            title: "Invalid email",
            description: "Please enter a valid email address.",
            variant: "destructive",
          })
          return
        }

        // Basic phone validation
        const phoneRegex = /^\+?[0-9\s\-()]{8,}$/
        if (!phoneRegex.test(phone)) {
          toast({
            title: "Invalid phone number",
            description: "Please enter a valid phone number.",
            variant: "destructive",
          })
          return
        }
      } else if (bookingStep === 2) {
        if (paymentMethod === "credit-card" && (!cardName || !cardNumber || !cardExpiry || !cardCvc)) {
          toast({
            title: "Missing payment information",
            description: "Please fill in all required payment details.",
            variant: "destructive",
          })
          return
        }

        // Basic card number validation
        if (paymentMethod === "credit-card") {
          // Remove spaces and dashes
          const cleanCardNumber = cardNumber.replace(/[\s-]/g, "")
          if (!/^\d{13,19}$/.test(cleanCardNumber)) {
            toast({
              title: "Invalid card number",
              description: "Please enter a valid credit card number.",
              variant: "destructive",
            })
            return
          }

          // Basic expiry validation (MM/YY format)
          if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            toast({
              title: "Invalid expiry date",
              description: "Please enter a valid expiry date in MM/YY format.",
              variant: "destructive",
            })
            return
          }

          // Basic CVC validation
          if (!/^\d{3,4}$/.test(cardCvc)) {
            toast({
              title: "Invalid CVC",
              description: "Please enter a valid CVC code (3 or 4 digits).",
              variant: "destructive",
            })
            return
          }
        }
      }

      setBookingStep((prev) => prev + 1)
    } catch (err) {
      console.error("Error in booking process:", err)
      toast({
        title: "Error",
        description: "An error occurred during the booking process. Please try again.",
        variant: "destructive",
      })
    }
  }

  const prevStep = () => {
    setBookingStep((prev) => prev - 1)
  }

  // Complete booking
  const completeBooking = () => {
    try {
      setIsBookingComplete(true)
      setShowBookingModal(false)

      toast({
        title: "Booking successful!",
        description: "Your reservation has been confirmed. Check your email for details.",
      })
    } catch (err) {
      console.error("Error completing booking:", err)
      toast({
        title: "Error",
        description: "An error occurred while completing your booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!reviewComment.trim()) {
        toast({
          title: "Review required",
          description: "Please enter your review comment.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your experience.",
      })

      setIsReviewDialogOpen(false)
      setReviewComment("")
    } catch (err) {
      console.error("Error submitting review:", err)
      toast({
        title: "Error",
        description: "An error occurred while submitting your review. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Calculate total price
  const calculateTotal = () => {
    try {
      if (!hotel) return { subtotal: 0, taxes: 0, total: 0, nights: 0 }

      const roomPrice = hotel.rooms.find((room) => room.id.toString() === roomType)?.price || hotel.price
      const nights =
        checkInDate && checkOutDate
          ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
          : 1

      const subtotal = roomPrice * nights
      const taxes = subtotal * 0.15

      return {
        subtotal,
        taxes,
        total: subtotal + taxes,
        nights,
      }
    } catch (err) {
      console.error("Error calculating total:", err)
      return { subtotal: 0, taxes: 0, total: 0, nights: 0 }
    }
  }

  // In a real app, you would fetch the hotel data based on the ID
  const hotelData: Hotel = {
    id: hotelId || "1",
    name: "Grand Plaza Hotel",
    location: "Manhattan, New York",
    price: 199,
    rating: 4.8,
    images: [
      "/images/hotel-detail-1.png",
      "/images/hotel-detail-2.png",
      "/images/hotel-detail-3.png",
      "/images/hotel-detail-4.png",
    ],
    description:
      "Experience luxury and comfort at the Grand Plaza Hotel, located in the heart of Manhattan. Our hotel offers stunning city views, a rooftop pool, and world-class dining options. Each room is elegantly designed with modern amenities to ensure a memorable stay.",
    amenities: [
      { name: "Free WiFi", icon: WifiIcon },
      { name: "Swimming Pool", icon: WifiIcon },
      { name: "Spa & Wellness", icon: WifiIcon },
      { name: "Fitness Center", icon: WifiIcon },
      { name: "Restaurant", icon: WifiIcon },
      { name: "Room Service", icon: WifiIcon },
      { name: "Business Center", icon: WifiIcon },
      { name: "Parking", icon: WifiIcon },
    ],
    rooms: [
      {
        id: 1,
        name: "Deluxe King Room",
        price: 199,
        capacity: 2,
        size: "35 m²",
        beds: "1 King Bed",
        amenities: ["Free WiFi", "Air Conditioning", "Flat-screen TV", "Mini Bar"],
        image: "/images/room-1.png",
      },
      {
        id: 2,
        name: "Premium Double Room",
        price: 249,
        capacity: 2,
        size: "40 m²",
        beds: "2 Queen Beds",
        amenities: ["Free WiFi", "Air Conditioning", "Flat-screen TV", "Mini Bar", "City View"],
        image: "/images/room-2.png",
      },
      {
        id: 3,
        name: "Executive Suite",
        price: 349,
        capacity: 3,
        size: "55 m²",
        beds: "1 King Bed + Sofa Bed",
        amenities: ["Free WiFi", "Air Conditioning", "Flat-screen TV", "Mini Bar", "City View", "Bathtub"],
        image: "/images/room-3.png",
      },
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        date: "August 15, 2023",
        comment:
          "Absolutely loved my stay at this hotel! The staff was incredibly friendly and helpful. The room was spacious, clean, and had an amazing view of the city. The location is perfect - close to all the major attractions. Will definitely stay here again!",
        avatar: "/images/avatar-1.png",
      },
      {
        id: 2,
        name: "Michael Brown",
        rating: 4,
        date: "July 22, 2023",
        comment:
          "Great hotel with excellent amenities. The pool and spa were highlights of my stay. Room was comfortable and clean. Only giving 4 stars because the restaurant was a bit pricey, but the food was delicious.",
        avatar: "/images/avatar-2.png",
      },
      {
        id: 3,
        name: "Emily Davis",
        rating: 5,
        date: "June 10, 2023",
        comment:
          "One of the best hotel experiences I've had. The staff went above and beyond to make our anniversary special. The room was spotless and the bed was incredibly comfortable. Highly recommend!",
        avatar: "/images/avatar-3.png",
      },
    ],
  }

  const { subtotal, taxes, total, nights } = calculateTotal()
  const selectedRoom = hotel?.rooms.find((room) => room.id.toString() === roomType)

  // If there's an error, show error message
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => router.push("/hotels")}>Back to Hotels</Button>
      </div>
    )
  }

  // If loading, show loading skeleton
  if (isLoading || !hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Hotel Header Skeleton */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex flex-col items-end">
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-4 w-16 mb-4" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Hotel Images Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="md:col-span-2 md:row-span-2 h-80" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-12 w-full mb-6" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-5/6 mb-6" />

              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>

            <div>
              <Skeleton className="h-[400px] w-full mb-6" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Hotel Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">{hotel.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(hotel.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{hotel.rating}</span>
              <span className="text-muted-foreground">({hotel.reviews.length} reviews)</span>
            </div>
            <div className="flex items-center mt-2 text-muted-foreground">
              <MapPinIcon className="h-5 w-5 mr-1" />
              {hotel.location}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl font-bold text-primary">${hotel.price}</div>
            <div className="text-sm text-muted-foreground">per night</div>
            <Button className="mt-4 w-full md:w-auto" onClick={initiateBooking}>
              Book Now
            </Button>
          </div>
        </div>

        {/* Hotel Images */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 md:row-span-2 relative h-80 md:h-auto">
            <Image
              src={hotel.images[0] || "/placeholder.svg?height=400&width=600"}
              alt={hotel.name}
              className="rounded-lg object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={(e) => {
                // Fallback for image loading errors
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=400&width=600"
              }}
            />
          </div>
          {hotel.images.slice(1, 4).map((image, index) => (
            <div key={index} className="relative h-40 md:h-auto">
              <Image
                src={image || `/placeholder.svg?height=200&width=300&text=Image ${index + 2}`}
                alt={`${hotel.name} ${index + 1}`}
                className="rounded-lg object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                onError={(e) => {
                  // Fallback for image loading errors
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=200&width=300&text=Image ${index + 2}`
                }}
              />
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Hotel Info */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">About {hotel.name}</h2>
                    <p className="text-muted-foreground">{hotel.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Top Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {hotel.amenities.slice(0, 8).map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <amenity.icon className="h-5 w-5 text-primary" />
                          <span>{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="mt-6">
                <h2 className="text-2xl font-semibold mb-6">Available Rooms</h2>
                <div className="space-y-6">
                  {hotel.rooms.map((room) => (
                    <Card key={room.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 relative h-48 md:h-auto">
                          <Image
                            src={room.image || "/placeholder.svg?height=200&width=300"}
                            alt={room.name}
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            onError={(e) => {
                              // Fallback for image loading errors
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=200&width=300"
                            }}
                          />
                        </div>
                        <CardContent className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-semibold">{room.name}</h3>
                              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <UserIcon className="h-4 w-4 mr-1" />
                                  {room.capacity} Guests
                                </div>
                                <div>{room.size}</div>
                                <div>{room.beds}</div>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-4">
                                {room.amenities.map((amenity, index) => (
                                  <Badge key={index} variant="outline" className="bg-primary/5">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-2xl font-bold text-primary">${room.price}</div>
                              <div className="text-sm text-muted-foreground">per night</div>
                              <Button
                                className="mt-4"
                                onClick={() => {
                                  setRoomType(room.id.toString())
                                  toast({
                                    title: "Room selected",
                                    description: `${room.name} has been selected for your booking.`,
                                  })
                                }}
                              >
                                Select Room
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-6">
                <h2 className="text-2xl font-semibold mb-6">Hotel Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">General</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Free WiFi
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Air Conditioning
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        24-hour Front Desk
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Elevator
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Non-smoking Rooms
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Activities & Wellness</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Swimming Pool
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Fitness Center
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Spa & Wellness Center
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Sauna
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Massage
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Food & Drink</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Restaurant
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Bar
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Breakfast Available
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Room Service
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Special Diet Menus
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Services</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Concierge Service
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Luggage Storage
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Laundry Service
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Business Center
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Meeting/Banquet Facilities
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Guest Reviews</h2>
                  <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Write a Review</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Write a Review</DialogTitle>
                        <DialogDescription>
                          Share your experience at {hotel.name} with other travelers.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleReviewSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Your Rating</label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                  key={star}
                                  className={`h-6 w-6 cursor-pointer ${star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  onClick={() => setReviewRating(star)}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Your Review</label>
                            <textarea
                              className="w-full min-h-[100px] p-2 border rounded-md"
                              placeholder="Share your experience..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Submit Review</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-6">
                  {hotel.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={review.avatar} alt={review.name} />
                            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{review.name}</div>
                            <div className="text-sm text-muted-foreground">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Form */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Book Your Stay</h3>

                {!isLoggedIn && (
                  <Alert className="mb-4" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication Required</AlertTitle>
                    <AlertDescription>
                      You need to be logged in to complete a booking.
                      <div className="mt-2">
                        <Button variant="outline" size="sm" onClick={handleLogin} className="mr-2">
                          Login (Demo)
                        </Button>
                        <Link href="/auth/login">
                          <Button size="sm">Go to Login</Button>
                        </Link>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Check-in / Check-out</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {checkInDate ? (
                              format(checkInDate, "PPP")
                            ) : (
                              <span className="text-muted-foreground">Check-in</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkInDate}
                            onSelect={(date) => {
                              setCheckInDate(date)
                              if (date && (!checkOutDate || checkOutDate <= date)) {
                                setCheckOutDate(addDays(date, 1))
                              }
                            }}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {checkOutDate ? (
                              format(checkOutDate, "PPP")
                            ) : (
                              <span className="text-muted-foreground">Check-out</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            initialFocus
                            disabled={(date) => !checkInDate || date <= checkInDate || date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Guests</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Select value={adults} onValueChange={setAdults}>
                          <SelectTrigger>
                            <SelectValue placeholder="Adults" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Adult</SelectItem>
                            <SelectItem value="2">2 Adults</SelectItem>
                            <SelectItem value="3">3 Adults</SelectItem>
                            <SelectItem value="4">4 Adults</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Select value={children} onValueChange={setChildren}>
                          <SelectTrigger>
                            <SelectValue placeholder="Children" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0 Children</SelectItem>
                            <SelectItem value="1">1 Child</SelectItem>
                            <SelectItem value="2">2 Children</SelectItem>
                            <SelectItem value="3">3 Children</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Room Type</label>
                    <Select value={roomType} onValueChange={setRoomType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotel.rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            {room.name} - ${room.price}/night
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Room rate</span>
                      <span>
                        ${subtotal.toFixed(2)} ({nights} night{nights !== 1 ? "s" : ""})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & fees</span>
                      <span>${taxes.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {isBookingComplete ? (
                    <div className="bg-green-50 p-4 rounded-md text-green-700 text-center">
                      <CheckIcon className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-medium">Booking Confirmed!</p>
                      <p className="text-sm mt-1">Check your email for details.</p>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={initiateBooking} disabled={!isLoggedIn}>
                      Book Now
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    No payment required today. You'll pay when you stay.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 bg-primary/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Why Book With Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckIcon className="h-5 w-5 text-primary mt-0.5" />
                  <span>Best price guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="h-5 w-5 text-primary mt-0.5" />
                  <span>Free cancellation on most rooms</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="h-5 w-5 text-primary mt-0.5" />
                  <span>No booking fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="h-5 w-5 text-primary mt-0.5" />
                  <span>Secure booking process</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Process Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              {bookingStep === 1 && "Please provide your details to continue with the booking."}
              {bookingStep === 2 && "Please provide your payment information."}
              {bookingStep === 3 && "Review and confirm your booking details."}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Guest Details */}
          {bookingStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name *</Label>
                  <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name *</Label>
                  <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-requests">Special Requests</Label>
                <Textarea
                  id="special-requests"
                  placeholder="Any special requests or requirements?"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {bookingStep === 2 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="pay-later" id="pay-later" />
                    <Label htmlFor="pay-later">Pay at Hotel</Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "credit-card" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card *</Label>
                    <Input id="card-name" value={cardName} onChange={(e) => setCardName(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number *</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-expiry">Expiry Date *</Label>
                      <Input
                        id="card-expiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-cvc">CVC *</Label>
                      <Input
                        id="card-cvc"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save-card"
                      checked={saveCard}
                      onCheckedChange={(checked) => setSaveCard(checked as boolean)}
                    />
                    <Label htmlFor="save-card">Save card for future bookings</Label>
                  </div>
                </>
              )}

              {paymentMethod === "pay-later" && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Pay at Hotel</AlertTitle>
                  <AlertDescription>
                    You'll pay the full amount at the hotel during check-in. No payment is required now to secure your
                    booking.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 3: Review and Confirm */}
          {bookingStep === 3 && (
            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hotel:</span>
                    <span className="font-medium">{hotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Type:</span>
                    <span className="font-medium">{selectedRoom?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in:</span>
                    <span className="font-medium">{checkInDate ? format(checkInDate, "PPP") : "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out:</span>
                    <span className="font-medium">{checkOutDate ? format(checkOutDate, "PPP") : "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests:</span>
                    <span className="font-medium">
                      {adults} Adult(s), {children} Children
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Rate:</span>
                    <span className="font-medium">
                      ${subtotal.toFixed(2)} ({nights} night{nights !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & Fees:</span>
                    <span className="font-medium">${taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-semibold mb-2">Guest Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">
                      {firstName} {lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{phone}</span>
                  </div>
                  {specialRequests && (
                    <div>
                      <span className="text-muted-foreground">Special Requests:</span>
                      <p className="font-medium mt-1">{specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-semibold mb-2">Payment Method</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="font-medium">
                      {paymentMethod === "credit-card" ? "Credit/Debit Card" : "Pay at Hotel"}
                    </span>
                  </div>
                  {paymentMethod === "credit-card" && cardNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Card:</span>
                      <span className="font-medium">**** **** **** {cardNumber.slice(-4)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>
          )}

          <DialogFooter>
            {bookingStep > 1 && (
              <Button variant="outline" onClick={prevStep} className="mr-auto">
                Back
              </Button>
            )}

            {bookingStep < 3 ? (
              <Button onClick={nextStep}>Continue</Button>
            ) : (
              <Button onClick={completeBooking}>Confirm Booking</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

