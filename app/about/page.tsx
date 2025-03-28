"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BedDoubleIcon, CheckIcon, HeartIcon, MapIcon, ShieldCheckIcon, StarIcon, UsersIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary mb-4">About Hotel Ease</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the story behind the leading hotel booking platform that's changing the way people travel.
        </p>
      </div>

      {/* Our Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/images/hotel-detail-1.png"
            alt="Hotel Ease Story"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            Founded in 2015, Hotel Ease began with a simple mission: to make hotel booking simple, transparent, and
            enjoyable. What started as a small startup with just 5 team members has grown into a trusted platform
            serving millions of travelers worldwide.
          </p>
          <p className="text-muted-foreground mb-4">
            Our founders, experienced travelers themselves, were frustrated with the complexity and hidden fees of
            existing booking platforms. They set out to create a solution that puts the customer first – offering clear
            pricing, honest reviews, and exceptional customer service.
          </p>
          <p className="text-muted-foreground">
            Today, Hotel Ease partners with thousands of hotels across the globe, from boutique establishments to luxury
            resorts, all while maintaining our core values of transparency, quality, and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="bg-primary/5 rounded-lg p-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl mb-8">
            To provide travelers with the easiest way to find and book their perfect accommodation, while offering
            exceptional value and unparalleled customer service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <HeartIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-center text-muted-foreground">
                Every decision we make puts our customers' needs and satisfaction at the forefront.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust & Transparency</h3>
              <p className="text-center text-muted-foreground">
                We believe in clear pricing, honest reviews, and open communication.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <StarIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Experience</h3>
              <p className="text-center text-muted-foreground">
                We curate high-quality accommodations and ensure a seamless booking experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Hotel Ease</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <MapIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Global Selection</h3>
                  <p className="text-muted-foreground">
                    Access to over 500,000 properties worldwide, from budget-friendly options to luxury resorts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <CheckIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Best Price Guarantee</h3>
                  <p className="text-muted-foreground">
                    We match or beat any comparable price you find elsewhere for the same accommodation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">24/7 Customer Support</h3>
                  <p className="text-muted-foreground">
                    Our dedicated support team is available around the clock to assist with any questions or issues.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <BedDoubleIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
                  <p className="text-muted-foreground">
                    Authentic reviews from real guests help you make informed decisions about your stay.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto mb-4 rounded-full overflow-hidden">
              <Image
                src="/images/avatar-1.png"
                alt="Sarah Johnson"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="text-xl font-semibold">Sarah Johnson</h3>
            <p className="text-primary font-medium mb-2">CEO & Co-Founder</p>
            <p className="text-muted-foreground">
              Former travel industry executive with 15+ years of experience in hospitality management.
            </p>
          </div>

          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto mb-4 rounded-full overflow-hidden">
              <Image
                src="/images/avatar-2.png"
                alt="Michael Brown"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="text-xl font-semibold">Michael Brown</h3>
            <p className="text-primary font-medium mb-2">CTO & Co-Founder</p>
            <p className="text-muted-foreground">
              Tech innovator with a background in developing scalable platforms for the travel industry.
            </p>
          </div>

          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto mb-4 rounded-full overflow-hidden">
              <Image
                src="/images/avatar-3.png"
                alt="Emily Davis"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="text-xl font-semibold">Emily Davis</h3>
            <p className="text-primary font-medium mb-2">COO</p>
            <p className="text-muted-foreground">
              Operations expert who ensures smooth customer experiences and efficient business processes.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-primary text-white rounded-lg p-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">500K+</div>
            <div className="text-white/80">Hotels Worldwide</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">10M+</div>
            <div className="text-white/80">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">150+</div>
            <div className="text-white/80">Countries Covered</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.8/5</div>
            <div className="text-white/80">Customer Rating</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Stay?</h2>
        <p className="text-muted-foreground mb-8">
          Join millions of satisfied travelers who have found their ideal accommodations through Hotel Ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/hotels">
            <Button size="lg">Browse Hotels</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

