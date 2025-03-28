"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MailIcon, MapPinIcon, MessageSquareIcon, PhoneIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ContactPage() {
  const { toast } = useToast()
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false)

  // Contact form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Live chat state
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "system", text: "Welcome to Hotel Ease live chat! How can we help you today?" },
  ])

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      toast({
        title: "All fields are required",
        description: "Please fill in all fields to send your message.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Message sent successfully",
        description: "Thank you for contacting us. We'll get back to you soon!",
      })

      // Reset form
      setFirstName("")
      setLastName("")
      setEmail("")
      setSubject("")
      setMessage("")
    }, 1500)
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!chatMessage.trim()) return

    // Add user message
    setChatMessages([...chatMessages, { sender: "user", text: chatMessage }])
    const userMessage = chatMessage
    setChatMessage("")

    // Simulate agent response after a delay
    setTimeout(() => {
      let response = "Thank you for your message. One of our agents will assist you shortly."

      // Simple response logic based on keywords
      if (userMessage.toLowerCase().includes("book")) {
        response = "To book a room, you can use our website's booking system or call us directly at +1 (555) 123-4567."
      } else if (userMessage.toLowerCase().includes("cancel")) {
        response =
          "Most bookings can be canceled up to 24-48 hours before check-in without a fee. Please check your specific booking details."
      } else if (userMessage.toLowerCase().includes("price") || userMessage.toLowerCase().includes("cost")) {
        response =
          "Our room prices vary based on season, room type, and availability. You can check current rates on our website."
      }

      setChatMessages((prev) => [...prev, { sender: "agent", text: response }])
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Contact Us</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have questions or need assistance? Our team is here to help. Reach out to us through any of the channels
          below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <PhoneIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Phone</CardTitle>
            <CardDescription>Call us directly</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">+1 (555) 123-4567</p>
            <p className="text-sm text-muted-foreground">Mon-Fri: 9AM - 8PM</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                toast({
                  title: "Calling...",
                  description: "This would initiate a phone call in a real application.",
                })
              }}
            >
              Call Now
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <MailIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Email</CardTitle>
            <CardDescription>Send us an email</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">info@hotelease.com</p>
            <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                window.location.href = "mailto:info@hotelease.com"
              }}
            >
              Email Us
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <MapPinIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Address</CardTitle>
            <CardDescription>Visit our office</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">123 Hotel Street</p>
            <p className="text-sm text-muted-foreground">Cityville, State 12345, Country</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                window.open("https://maps.google.com/?q=123+Hotel+Street,Cityville", "_blank")
              }}
            >
              Get Directions
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="How can we help you?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="min-h-[150px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        <div className="lg:pl-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How do I make a reservation?</h3>
              <p className="text-muted-foreground">
                You can make a reservation through our website by searching for your desired location and dates,
                selecting a hotel, and following the booking process. Alternatively, you can call our reservation line
                at +1 (555) 123-4567.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">What is the cancellation policy?</h3>
              <p className="text-muted-foreground">
                Most of our hotels offer free cancellation up to 24-48 hours before check-in. The specific policy for
                each hotel is displayed during the booking process and in your confirmation email.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Do you offer special rates for groups?</h3>
              <p className="text-muted-foreground">
                Yes, we offer special rates for group bookings of 10 rooms or more. Please contact our group
                reservations department at groups@hotelease.com for more information.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">How does the loyalty program work?</h3>
              <p className="text-muted-foreground">
                Our loyalty program allows you to earn points for each stay, which can be redeemed for free nights, room
                upgrades, and other benefits. Sign up for an account to start earning points immediately.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-primary/5 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <MessageSquareIcon className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Live Chat Support</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Need immediate assistance? Chat with our customer service team in real-time.
            </p>
            <Dialog open={isLiveChatOpen} onOpenChange={setIsLiveChatOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Start Live Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Live Chat Support</DialogTitle>
                  <DialogDescription>Chat with our customer service team. We're here to help!</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 my-4 border rounded-md">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === "user" ? "bg-primary text-white rounded-tr-none" : "bg-muted rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">Send</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Locations</h2>
        <div className="aspect-video rounded-lg overflow-hidden border">
          {/* In a real application, you would embed a Google Map or similar here */}
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Interactive Map Would Be Displayed Here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

