import Link from "next/link"
import { BedDoubleIcon, FacebookIcon, InstagramIcon, MailIcon, MapPinIcon, PhoneIcon, TwitterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BedDoubleIcon className="h-6 w-6" />
              <span className="text-xl font-bold">Hotel Ease</span>
            </Link>
            <p className="text-white/80 mb-4">
              Find and book your perfect stay with ease. The best hotels at the best prices.
            </p>
            <div className="flex space-x-4">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full h-8 w-8 text-white hover:text-primary hover:bg-white"
              >
                <FacebookIcon className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full h-8 w-8 text-white hover:text-primary hover:bg-white"
              >
                <TwitterIcon className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full h-8 w-8 text-white hover:text-primary hover:bg-white"
              >
                <InstagramIcon className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/80 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-white/80 hover:text-white">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-white/80 hover:text-white">
                  Deals & Offers
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/80 hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/80 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">123 Hotel Street, Cityville, State 12345, Country</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-white/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-white/80">info@hotelease.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-white/80 mb-4">Subscribe to receive updates on special offers and promotions.</p>
            <div className="flex flex-col space-y-2">
              <Input
                placeholder="Your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/80 text-sm">&copy; {new Date().getFullYear()} Hotel Ease. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

