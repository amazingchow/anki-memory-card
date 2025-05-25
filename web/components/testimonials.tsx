import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Icons } from '@/components/icons';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  comment: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Language Teacher",
    comment: "Anki has revolutionized how I teach vocabulary. My students' retention rates have improved dramatically since we started using this platform.",
    avatar: "/avatars/1.webp",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    title: "Medical Student",
    comment: "As a medical student, I need to memorize thousands of terms. Anki makes this process efficient and effective. It's been a game-changer for my studies.",
    avatar: "/avatars/2.webp",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Thompson",
    title: "Software Engineer",
    comment: "I use Anki to learn programming concepts and algorithms. The spaced repetition system is perfect for technical knowledge retention.",
    avatar: "/avatars/3.webp",
    rating: 5
  },
  {
    id: 4,
    name: "David Kim",
    title: "Language Learner",
    comment: "I've tried many language learning apps, but Anki's flexibility and effectiveness are unmatched. I've learned three languages using this platform.",
    avatar: "/avatars/4.webp",
    rating: 5
  },
  {
    id: 5,
    name: "Lisa Wang",
    title: "Research Scientist",
    comment: "Anki helps me stay on top of the latest research papers and technical terms. It's an essential tool in my daily workflow.",
    avatar: "/avatars/5.webp",
    rating: 5
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[currentIndex];

  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-md p-6 backdrop-blur-sm rounded-lg">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
              <p className="text-sm text-zinc-400">{testimonial.title}</p>
            </div>
          </div>
          <p className="text-zinc-300 mb-4">{testimonial.comment}</p>
          <div className="flex items-center">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Icons.star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 