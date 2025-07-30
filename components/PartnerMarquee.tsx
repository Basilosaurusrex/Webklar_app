import React from "react";

const partners = [
  {
    name: "Webflow",
    svg: (
      <svg className="partner-spin" viewBox="0 0 48 48" fill="none" width={40} height={40} xmlns="http://www.w3.org/2000/svg">
        <path d="M7 12L15.5 36L24 12L32.5 36L41 12" stroke="#FEFAE0" strokeWidth="3" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Stripe",
    svg: (
      <svg className="partner-spin" viewBox="0 0 48 48" fill="none" width={40} height={40} xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="12" width="32" height="24" rx="6" stroke="#FEFAE0" strokeWidth="3"/>
        <rect x="14" y="20" width="20" height="4" rx="2" fill="#FEFAE0"/>
      </svg>
    ),
  },
  {
    name: "Supabase",
    svg: (
      <svg className="partner-spin" viewBox="0 0 48 48" fill="none" width={40} height={40} xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="8" width="24" height="32" rx="4" stroke="#FEFAE0" strokeWidth="3"/>
        <rect x="18" y="16" width="12" height="4" rx="2" fill="#FEFAE0"/>
        <rect x="18" y="24" width="12" height="4" rx="2" fill="#FEFAE0"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    svg: (
      <svg className="partner-spin" viewBox="0 0 48 48" fill="none" width={40} height={40} xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="#FEFAE0" strokeWidth="3"/>
        <path d="M18 34c-1-2-2-4-2-7 0-4 3-7 8-7s8 3 8 7c0 3-1 5-2 7" stroke="#FEFAE0" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="18" cy="20" r="2" fill="#FEFAE0"/>
        <circle cx="30" cy="20" r="2" fill="#FEFAE0"/>
      </svg>
    ),
  },
  {
    name: "Cursor AI",
    svg: (
      <svg className="partner-spin" viewBox="0 0 48 48" fill="none" width={40} height={40} xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="12" width="24" height="24" rx="8" stroke="#FEFAE0" strokeWidth="3"/>
        <circle cx="24" cy="24" r="6" stroke="#FEFAE0" strokeWidth="3"/>
        <circle cx="24" cy="24" r="2" fill="#FEFAE0"/>
      </svg>
    ),
  },
  {
    name: "Google Ads",
    svg: (
      <svg className="partner-spin" viewBox="0 0 48 48" fill="none" width={40} height={40} xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="30" width="8" height="8" rx="2" fill="#FEFAE0"/>
        <rect x="20" y="18" width="8" height="20" rx="2" fill="#FEFAE0"/>
        <rect x="30" y="10" width="8" height="28" rx="2" fill="#FEFAE0"/>
      </svg>
    ),
  },
];

export default function PartnerMarquee() {
  return (
    <div className="w-full overflow-hidden py-8">
      {/* Desktop/Tablet: Marquee */}
      <div className="relative hidden sm:block">
        <div className="marquee flex items-center gap-8" style={{ animation: 'marquee 30s linear infinite' }}>
          {[...partners, ...partners].map((partner, idx) => (
            <div
              key={partner.name + idx}
              className="flex flex-col items-center justify-center min-w-[140px] px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-sm"
            >
              {partner.svg}
              <span className="mt-2 font-bold text-[#FEFAE0] text-base md:text-lg text-center whitespace-nowrap" style={{ letterSpacing: 0.5 }}>{partner.name}</span>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee {
            width: 200%;
          }
          @keyframes partner-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .partner-spin {
            animation: partner-spin 8s linear infinite;
            display: block;
          }
        `}</style>
      </div>
      {/* Mobile: Grid */}
      <div className="sm:hidden grid grid-cols-2 gap-4 justify-items-center">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="flex flex-col items-center justify-center w-full px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm"
          >
            {partner.svg}
            <span className="mt-2 font-bold text-[#FEFAE0] text-base text-center whitespace-nowrap" style={{ letterSpacing: 0.5 }}>{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 