"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPinIcon, SearchIcon, StarIcon, UserIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()

  // Search form state
  const [destination, setDestination] = useState("")
  const [guests, setGuests] = useState("2")
  const [date, setDate] = useState<Date>()

  // Newsletter state
  const [email, setEmail] = useState("")

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!destination) {
      toast({
        title: "Destination required",
        description: "Please enter a destination to search for hotels.",
        variant: "destructive",
      })
      return
    }

    // Navigate to hotels page with search params
    router.push(
      `/hotels?destination=${encodeURIComponent(destination)}&guests=${guests}${date ? `&date=${date.toISOString()}` : ""}`,
    )
  }

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address to subscribe.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Subscription successful!",
      description: "Thank you for subscribing to our newsletter.",
    })

    setEmail("")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-banner.png')" }}
        />
        <div className="relative z-20 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Find Your Perfect Stay</h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover and book the best hotels at the best prices with Hotel Ease
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Where are you going?"
                  className="pl-10"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal pl-10">
                      <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      {date ? format(date, "PPP") : <span className="text-muted-foreground">Check-in date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground z-10" />
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4+ Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                <SearchIcon className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Featured Hotels</h2>
          <Link href="/hotels">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="w-full h-full object-cover" />
                {hotel.discount && <Badge className="absolute top-2 right-2 bg-red-500">{hotel.discount}% OFF</Badge>}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-xl">{hotel.name}</CardTitle>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{hotel.rating}</span>
                  </div>
                </div>
                <CardDescription className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                  {hotel.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="bg-primary/5">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-primary">${hotel.price}</span>
                  <span className="text-sm text-muted-foreground"> / night</span>
                </div>
                <Link href={`/hotels/${hotel.id}`}>
                  <Button>View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Special Deals & Offers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row">
              <div className="md:w-2/5 h-48 md:h-auto">
                <img src="/images/deal-1.png" alt="Weekend Getaway" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:w-3/5 flex flex-col justify-between">
                <div>
                  <Badge className="mb-2 bg-red-500">Limited Time</Badge>
                  <h3 className="text-xl font-bold mb-2">Weekend Getaway</h3>
                  <p className="text-muted-foreground mb-4">
                    Enjoy 20% off on weekend stays at selected luxury hotels.
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-primary">Valid until: Aug 31, 2023</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Deal applied!",
                        description: "Weekend Getaway deal has been applied to your search.",
                      })
                      router.push("/hotels?deal=weekend-getaway")
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row">
              <div className="md:w-2/5 h-48 md:h-auto">
                <img src="/images/deal-2.png" alt="Family Package" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:w-3/5 flex flex-col justify-between">
                <div>
                  <Badge className="mb-2 bg-green-600">Family Deal</Badge>
                  <h3 className="text-xl font-bold mb-2">Family Package</h3>
                  <p className="text-muted-foreground mb-4">Kids stay free when booking a family room for 3+ nights.</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-primary">Valid until: Sep 15, 2023</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Deal applied!",
                        description: "Family Package deal has been applied to your search.",
                      })
                      router.push("/hotels?deal=family-package")
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">What Our Guests Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">Stayed at {testimonial.hotel}</CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Exclusive Offers</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to receive special deals and promotions.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Your email address"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="secondary" className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}

// Sample data
const featuredHotels = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "New York, USA",
    price: 199,
    rating: 4.8,
    image: "/images/hotel-1.png",
    amenities: ["Free WiFi", "Pool", "Spa"],
    discount: 15,
  },
  {
    id: 2,
    name: "Seaside Resort",
    location: "Miami, USA",
    price: 249,
    rating: 4.6,
    image: "/images/hotel-2.png",
    amenities: ["Beachfront", "Restaurant", "Gym"],
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    location: "Denver, USA",
    price: 179,
    rating: 4.7,
    image: "/images/hotel-3.png",
    amenities: ["Breakfast", "Parking", "Pet Friendly"],
    discount: 10,
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "The hotel was amazing! Great service and beautiful rooms. Will definitely come back.",
    hotel: "Grand Plaza Hotel",
    avatar: "/images/avatar-1.png",
  },
  {
    name: "Michael Brown",
    rating: 4,
    comment: "Excellent location and friendly staff. The breakfast was delicious and had many options.",
    hotel: "Seaside Resort",
    avatar: "/images/avatar-2.png",
  },
  {
    name: "Emily Davis",
    rating: 5,
    comment: "One of the best hotel experiences I've had. The views were breathtaking and the room was spotless.",
    hotel: "Mountain View Lodge",
    avatar: "/images/avatar-3.png",
  },
]

