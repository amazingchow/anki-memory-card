"use client"

import { Check, ChevronRight, CreditCard, Crown, ExternalLink, Heart, Shield, ShoppingCart, Stars } from "lucide-react"
import { SinglePricingCard, type Testimonial } from "@/components/single-pricing-card"

export default function PricingSectionBasic() {
  const features = [
    "Unlimited access to all premium features",
    "Advanced spaced repetition algorithms",
    "Customizable learning schedules",
    "Priority customer support",
    "Exclusive content and templates",
    // "Offline mode for learning anywhere",
    "Progress tracking and analytics",
    "Cloud synchronization across devices",
    "AI-powered learning recommendations",
    // "Community access and shared decks"
  ].map((text) => ({ text }))

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Language Teacher",
      company: "",
      content:
        "Anki has revolutionized how I teach vocabulary. My students' retention rates have improved dramatically since we started using this platform.",
      rating: 5,
      avatar: "/avatars/1.webp",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Medical Student",
      company: "",
      content:
        "As a medical student, I need to memorize thousands of terms. Anki makes this process efficient and effective. It's been a game-changer for my studies.",
      rating: 5,
      avatar: "/avatars/2.webp",
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "Software Engineer",
      company: "",
      content:
        "I use Anki to learn programming concepts and algorithms. The spaced repetition system is perfect for technical knowledge retention.",
      rating: 5,
      avatar: "/avatars/3.webp",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Language Learner",
      company: "",
      content:
        "I've tried many language learning apps, but Anki's flexibility and effectiveness are unmatched. I've learned three languages using this platform.",
      rating: 4,
      avatar: "/avatars/4.webp",
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Research Scientist",
      company: "",
      content:
        "Anki helps me stay on top of the latest research papers and technical terms. It's an essential tool in my daily workflow.",
      rating: 5,
      avatar: "/avatars/5.webp",
    },
  ]

  return (
    <section className="py-1 relative overflow-hidden flex justify-center" id="pricing">
      <div className="container px-4 md:px-6 relative z-10">
        <SinglePricingCard
          badge={{
            icon: Crown,
            text: "Anki AI Premium",
          }}
          title="Anki AI"
          subtitle="Learn faster & smarter, remember longer."
          price={{
            current: "$9.99",
            original: "$19.99",
            discount: "50% Off",
          }}
          benefits={[
            {
              text: "One-time payment, lifetime updates",
              icon: Check,
            },
            {
              text: "30-day money-back guarantee",
              icon: Shield,
            },
            {
              text: "Created for language learners",
              icon: Heart,
            },
          ]}
          features={features}
          featuresIcon={Check}
          featuresBadge={{
            icon: Stars,
            text: "All Features",
          }}
          primaryButton={{
            text: "Purchase Premium",
            icon: ShoppingCart,
            chevronIcon: ChevronRight,
          }}
          secondaryButton={{
            text: "Live Demo",
            icon: ExternalLink,
            href: "#",
          }}
          testimonials={testimonials}
          testimonialRotationSpeed={5000}
        />
      </div>
    </section>
  )
}
