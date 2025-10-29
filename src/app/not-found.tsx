"use client";

import Link from "next/link";
import AdminNavbar from "@/components/organisms/AdminNavbar";
import Footer from "@/components/organisms/Footer";

export default function NotFound() {
  return (
    <main className="h-dvh flex flex-col overflow-auto text-white">
      <AdminNavbar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bricolage font-bold bg-gradient-to-r from-fundable-purple via-fundable-purple-2 to-fundable-violet bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bricolage font-medium">
            Page Not Found
          </h2>
          <p className="text-fundable-grey max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link 
            href="/"
            className="btn-wrapper inline-block"
          >
            <div className="btn-grad" />
            <div className="btn-bottom-grad">
              Return Home
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
} 