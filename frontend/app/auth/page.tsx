"use client";
import { useEffect, useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/ui/login-form";

const images = ["/skyscraper_1.jpg", "/skyscraper_2.jpg", "/skyscraper_3.jpg"];

export default function AuthPage() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade out
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFade(true); // Fade in new image
      }, 750);
    }, 10000); // 10s per image
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Niga Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={images[current]}
          alt="Skyscraper"
          className={`absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </div>
  );
}