import React from "react";
import FarmerAnimation from "../components/FarmerAnimation";

export default function Index() {
  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-emerald-50/80 via-emerald-100 to-amber-50">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-700">
              Kisan Express
            </h1>
            <p className="text-lg text-emerald-700 max-w-xl leading-relaxed">
              AI-powered advisory and tools for smallholder farmers. Get timely
              recommendations, manage your farm profile, and connect with
              relevant government schemes — all in one place.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex items-center px-5 py-3 rounded-lg bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 transition"
                href="/signup"
              >
                Create Account
              </a>
              <a
                className="inline-flex items-center px-5 py-3 rounded-lg border border-emerald-200 text-emerald-800 hover:bg-emerald-50 transition"
                href="/about"
              >
                Learn More
              </a>
            </div>

            <div className="mt-6 text-sm text-emerald-600">
              <strong className="text-emerald-800">Tip:</strong> Add your profile
              and farm details to get personalized recommendations.
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-0 rounded-2xl blur-3xl opacity-30 bg-gradient-to-br from-emerald-200 via-amber-100 to-yellow-50" />
              <div className="relative p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100">
                <FarmerAnimation />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
