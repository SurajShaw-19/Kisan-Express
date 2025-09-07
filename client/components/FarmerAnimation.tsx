import React from "react";

const FarmerAnimation: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className="w-64 h-64 md:w-96 md:h-96"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Animated farmer with phone and axe"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#ECFCCB" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>
          <linearGradient id="shirtGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="pantsGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#065F46" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
        </defs>

        {/* background circle */}
        <circle cx="100" cy="100" r="95" fill="url(#bgGrad)" className="opacity-90" />

        {/* farmer body */}
        <g transform="translate(60,40)">
          {/* head */}
          <circle cx="40" cy="18" r="14" fill="#FCEBCF" stroke="#EAB308" strokeWidth="1" />

          {/* hair cap */}
          <path d="M26 13c5-6 26-6 30 0v6H26z" fill="#064E3B" />

          {/* body */}
          <rect x="18" y="32" width="44" height="42" rx="8" fill="url(#shirtGrad)" />

          {/* left arm holding phone (phone will bounce) */}
          <g className="transform origin-[46px_58px]">
            <rect
              x="52"
              y="40"
              width="12"
              height="20"
              rx="2"
              fill="#0F172A"
              className="animate-bounce"
              style={{ animationDuration: "1.6s" }}
            />
            <rect x="54" y="42" width="8" height="16" rx="1" fill="#F8FAFC" />
            <circle cx="58" cy="58" r="1" fill="#0F172A" />
          </g>

          {/* right arm holding axe (subtle pulse) */}
          <g className="transform origin-[18px_60px]">
            <rect x="6" y="46" width="10" height="20" rx="3" fill="#FCD34D" className="animate-pulse" style={{ animationDuration: "2.2s" }} />
            {/* axe head */}
            <path d="M-2 44 L10 44 L10 36 L2 36 Z" fill="#374151" transform="translate(12,4) rotate(-18)" />
          </g>

          {/* pants */}
          <rect x="18" y="74" width="44" height="20" rx="6" fill="url(#pantsGrad)" />

          {/* legs */}
          <rect x="24" y="94" width="12" height="26" rx="6" fill="#0F172A" />
          <rect x="46" y="94" width="12" height="26" rx="6" fill="#0F172A" />

          {/* simple boots */}
          <rect x="22" y="118" width="16" height="6" rx="3" fill="#4B5563" />
          <rect x="44" y="118" width="16" height="6" rx="3" fill="#4B5563" />
        </g>

        {/* accent leaves to give farm vibe */}
        <g transform="translate(10,120)" className="opacity-90">
          <path d="M20 20 C28 2, 52 2, 60 20" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
          <path d="M140 20 C132 2, 108 2, 100 20" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default FarmerAnimation;
