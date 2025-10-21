import { SignUp } from "@clerk/nextjs";
import { Command } from "lucide-react";

export default function Page() {
  return (
    <div className="container relative hidden min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900"></div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Command className="mr-2 h-6 w-6" />
          O2 Stack
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              “This library has saved me countless hours of work and helped me
              deliver stunning apps to my clients faster than ever before.”
            </p>
            <footer className="text-sm">John Doe</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 flex justify-center items-center">
        <SignUp />
      </div>
    </div>
  );
}
