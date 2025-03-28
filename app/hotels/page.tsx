"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { MapPinIcon, SearchIcon, StarIcon } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

// Define proper types for our data
interface Hotel {
  id: number
  name: string
  location: string
  price: number
  rating: number
  image: string
  amenities: string[]
  discount?: number
  description: string
}

export default function HotelsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

  // Get search params
  const destination = searchParams.get("destination") || ""
  const dealParam = searchParams.get("deal") || ""

  // Filter state
  const [searchTerm, setSearchTerm] = useState(destination)
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 300])
  const [starRating, setStarRating] = useState("any")
  const [amenities, setAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("recommended")
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [error, setError] = useState<string | null>(null)

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        // For demo, we'll just use a timeout to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 800))
        setFilteredHotels(hotels)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load hotels. Please try again.")
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Failed to load hotels. Please try again.",
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [toast])

  // Apply deal if present in URL
  useEffect(() => {
    if (dealParam) {
      toast({
        title: "Deal Applied",
        description: `The ${dealParam.replace("-", " ")} deal has been applied to your search.`,
      })
    }
  }, [dealParam, toast])

  // Handle amenity toggle
  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  // Apply filters
  const applyFilters = () => {
    try {
      setIsLoading(true)

      let filtered = [...hotels]

      // Apply search term
      if (searchTerm) {
        filtered = filtered.filter(
          (hotel) =>
            hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.location.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Apply price range
      filtered = filtered.filter((hotel) => hotel.price >= priceRange[0] && hotel.price <= priceRange[1])

      // Apply star rating
      if (starRating !== "any") {
        filtered = filtered.filter((hotel) => Math.floor(hotel.rating) === Number.parseInt(starRating))
      }

      // Apply amenities
      if (amenities.length > 0) {
        filtered = filtered.filter((hotel) => amenities.every((amenity) => hotel.amenities.includes(amenity)))
      }

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filtered.sort((a, b) => b.price - a.price)
          break
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating)
          break
        default:
          // Recommended - featured first, then by rating
          filtered.sort((a, b) => {
            if (a.discount && !b.discount) return -1
            if (!a.discount && b.discount) return 1
            return b.rating - a.rating
          })
      }

      setFilteredHotels(filtered)

      toast({
        title: "Filters Applied",
        description: `Found ${filtered.length} hotels matching your criteria.`,
      })

      setIsLoading(false)
    } catch (err) {
      setError("Failed to apply filters. Please try again.")
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Failed to apply filters. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Reset filters
  const resetFilters = () => {
    try {
      setSearchTerm("")
      setPriceRange([50, 300])
      setStarRating("any")
      setAmenities([])
      setSortBy("recommended")
      setFilteredHotels(hotels)

      toast({
        title: "Filters Reset",
        description: "All filters have been reset to default values.",
      })
    } catch (err) {
      setError("Failed to reset filters. Please try again.")
      toast({
        title: "Error",
        description: "Failed to reset filters. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle view details click
  const handleViewDetails = (hotelId: number) => {
    try {
      router.push(`/hotels/${hotelId}`)
    } catch (err) {
      toast({
        title: "Navigation Error",
        description: "Failed to navigate to hotel details. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Find Your Perfect Hotel</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Search</h3>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hotel name or location"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <Slider
                defaultValue={priceRange}
                min={0}
                max={500}
                step={10}
                className="mb-6"
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Star Rating</h3>
              <RadioGroup value={starRating} onValueChange={setStarRating}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="any" id="any" />
                  <Label htmlFor="any">Any</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="5" id="5-star" />
                  <Label htmlFor="5-star" className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="4" id="4-star" />
                  <Label htmlFor="4-star" className="flex">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="3" id="3-star" />
                  <Label htmlFor="3-star" className="flex">
                    {[...Array(3)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="2-star" />
                  <Label htmlFor="2-star" className="flex">
                    {[...Array(2)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Amenities</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wifi"
                    checked={amenities.includes("Free WiFi")}
                    onCheckedChange={() => toggleAmenity("Free WiFi")}
                  />
                  <Label htmlFor="wifi">Free WiFi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="breakfast"
                    checked={amenities.includes("Breakfast")}
                    onCheckedChange={() => toggleAmenity("Breakfast")}
                  />
                  <Label htmlFor="breakfast">Breakfast Included</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pool"
                    checked={amenities.includes("Pool")}
                    onCheckedChange={() => toggleAmenity("Pool")}
                  />
                  <Label htmlFor="pool">Swimming Pool</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parking"
                    checked={amenities.includes("Parking")}
                    onCheckedChange={() => toggleAmenity("Parking")}
                  />
                  <Label htmlFor="parking">Free Parking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="gym" checked={amenities.includes("Gym")} onCheckedChange={() => toggleAmenity("Gym")} />
                  <Label htmlFor="gym">Fitness Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="spa" checked={amenities.includes("Spa")} onCheckedChange={() => toggleAmenity("Spa")} />
                  <Label htmlFor="spa">Spa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pet"
                    checked={amenities.includes("Pet Friendly")}
                    onCheckedChange={() => toggleAmenity("Pet Friendly")}
                  />
                  <Label htmlFor="pet">Pet Friendly</Label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={applyFilters} disabled={isLoading}>
                {isLoading ? "Applying..." : "Apply Filters"}
              </Button>
              <Button variant="outline" onClick={resetFilters} disabled={isLoading}>
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Hotel Listings */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <p className="text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-6 w-40" />
              ) : (
                <>
                  Showing {filteredHotels.length} hotels
                  {destination ? ` in ${destination}` : ""}
                </>
              )}
            </p>
            <Select value={sortBy} onValueChange={setSortBy} disabled={isLoading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-10 w-28" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={hotel.image || "/placeholder.svg?height=200&width=400"}
                      alt={hotel.name}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={(e) => {
                        // Fallback for image loading errors
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=200&width=400"
                      }}
                    />
                    {hotel.discount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {hotel.discount}% OFF
                      </div>
                    )}
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
                    <div className="flex flex-wrap gap-2 mb-2">
                      {hotel.amenities.slice(0, 3).map((amenity) => (
                        <div key={amenity} className="bg-primary/5 text-primary text-xs px-2 py-1 rounded">
                          {amenity}
                        </div>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <div className="bg-primary/5 text-primary text-xs px-2 py-1 rounded">
                          +{hotel.amenities.length - 3} more
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{hotel.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-primary">${hotel.price}</span>
                      <span className="text-sm text-muted-foreground"> / night</span>
                    </div>
                    <Button onClick={() => handleViewDetails(hotel.id)}>View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredHotels.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters to find more options.</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filteredHotels.length > 0 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <Button variant="outline" size="icon" disabled>
                  <span className="sr-only">Previous page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-white">
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Pagination",
                      description: "This would navigate to page 2 in a real application.",
                    })
                  }}
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Pagination",
                      description: "This would navigate to page 3 in a real application.",
                    })
                  }}
                >
                  3
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Pagination",
                      description: "This would navigate to page 4 in a real application.",
                    })
                  }}
                >
                  4
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Pagination",
                      description: "This would navigate to page 5 in a real application.",
                    })
                  }}
                >
                  5
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    toast({
                      title: "Pagination",
                      description: "This would navigate to the next page in a real application.",
                    })
                  }}
                >
                  <span className="sr-only">Next page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Sample data
const hotels: Hotel[] = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "Manhattan, New York",
    price: 199,
    rating: 4.8,
    image: "/images/hotel-1.png",
    amenities: ["Free WiFi", "Pool", "Spa"],
    discount: 15,
    description:
      "Luxury hotel in the heart of Manhattan with stunning city views, a rooftop pool, and world-class dining options.",
  },
  {
    id: 2,
    name: "Seaside Resort",
    location: "Brooklyn, New York",
    price: 249,
    rating: 4.6,
    image: "/images/hotel-2.png",
    amenities: ["Beachfront", "Restaurant", "Gym"],
    description:
      "Beautiful beachfront resort with private access to the shore, multiple restaurants, and spacious rooms with ocean views.",
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    location: "Queens, New York",
    price: 179,
    rating: 4.7,
    image: "/images/hotel-3.png",
    amenities: ["Breakfast", "Parking", "Pet Friendly"],
    discount: 10,
    description:
      "Cozy lodge with panoramic mountain views, complimentary breakfast, and easy access to hiking trails and outdoor activities.",
  },
  {
    id: 4,
    name: "City Center Inn",
    location: "Bronx, New York",
    price: 159,
    rating: 4.5,
    image: "/images/hotel-4.png",
    amenities: ["Free WiFi", "Restaurant", "Bar"],
    description:
      "Conveniently located inn in the city center, walking distance to major attractions, shopping, and dining options.",
  },
]

