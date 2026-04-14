'use client';

const ICONS = [
  { name: 'Instagram', gradient: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z', shadow: '#e6683c' },
  { name: 'YouTube', gradient: 'linear-gradient(45deg, #FF0000, #cc0000)', path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z', shadow: '#FF0000' },
  { name: 'X', gradient: 'linear-gradient(45deg, #1a1a2e, #555577)', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', shadow: '#666688' },
  { name: 'LinkedIn', gradient: 'linear-gradient(45deg, #0A66C2, #004182)', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', shadow: '#0A66C2' },
  { name: 'Facebook', gradient: 'linear-gradient(45deg, #1877F2, #0d5dc7)', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', shadow: '#1877F2' },
  { name: 'Snapchat', gradient: 'linear-gradient(45deg, #FFFC00, #f5d800)', path: 'M12.166 0C6.852 0 4.703 3.494 4.703 6.708v2.19c0 .249-.17.27-.444.347-.717.166-1.2.289-1.2.844 0 .398.283.628.783.788.617.194 1.456.335 1.812.888.148.23.116.557-.107 1.08-.566 1.324-1.627 2.984-3.2 3.58-.362.137-.547.364-.547.693 0 .635.791.886 1.49 1.13.8.279 1.024.446 1.122.782.055.193.02.418.145.627.261.436.753.488 1.283.488.606 0 1.36-.176 2.48.437C8.072 21.563 9.813 24 12.166 24c2.335 0 4.07-2.423 5.626-3.408 1.14-.621 1.908-.437 2.508-.437.498 0 .974-.04 1.24-.488.125-.209.087-.434.143-.627.098-.336.321-.503 1.122-.782.698-.244 1.49-.495 1.49-1.13 0-.33-.186-.556-.548-.693-1.573-.596-2.634-2.256-3.2-3.58-.222-.523-.255-.85-.107-1.08.356-.553 1.2-.694 1.813-.888.5-.16.783-.39.783-.788 0-.555-.485-.678-1.201-.844-.273-.078-.444-.098-.444-.348v-2.19C21.391 3.487 19.268 0 12.166 0z', shadow: '#f5d800' },
];

type SocialPosition = {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  size: number;
  delay: number;
  dur: number;
};

// Dedicated positions for desktop layout
const DESKTOP_POSITIONS: SocialPosition[] = [
  { left: '3%', top: '15%', size: 52, delay: 0, dur: 5 },
  { right: '5%', top: '10%', size: 48, delay: 0.6, dur: 4.5 },
  { left: '7%', bottom: '18%', size: 44, delay: 1.2, dur: 5.5 },
  { right: '3%', bottom: '25%', size: 40, delay: 0.3, dur: 4 },
  { left: '18%', top: '5%', size: 38, delay: 0.9, dur: 6 },
  { right: '15%', bottom: '10%', size: 46, delay: 1.5, dur: 4.8 },
  { right: '25%', top: '8%', size: 36, delay: 0.4, dur: 5.2 },
];

// Mobile positions: show all account icons in compact, edge-safe spots
const MOBILE_POSITIONS: SocialPosition[] = [
  { left: '2.5%', top: '16%', size: 44, delay: 0, dur: 4.8 },
  { right: '2.5%', top: '13%', size: 42, delay: 0.4, dur: 4.4 },
  { left: '6%', top: '40%', size: 36, delay: 0.8, dur: 5.2 },
  { right: '5%', top: '46%', size: 34, delay: 1.2, dur: 4.1 },
  { left: '8%', bottom: '26%', size: 32, delay: 0.3, dur: 5.6 },
  { right: '8%', bottom: '22%', size: 36, delay: 1.4, dur: 4.6 },
  { right: '18%', top: '20%', size: 30, delay: 0.6, dur: 5 },
];

function SocialIcon({ icon, pos }: { icon: (typeof ICONS)[number]; pos: SocialPosition }) {
  const { size, delay, dur, ...posStyle } = pos;
  return (
    <div
      key={icon.name}
      className="absolute z-0 pointer-events-none"
      style={{
        ...posStyle,
        animation: `socialFloat ${dur}s ease-in-out ${delay}s infinite`,
        filter: `drop-shadow(0 8px 20px ${icon.shadow}44)`,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          background: icon.gradient,
          borderRadius: '22%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 10px 30px ${icon.shadow}33, inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.15)`,
          transform: 'perspective(500px) rotateX(8deg) rotateY(-5deg)',
          transition: 'transform 0.3s',
        }}
      >
        <svg width={Number(size) * 0.48} height={Number(size) * 0.48} viewBox="0 0 24 24" fill="white">
          <path d={icon.path} />
        </svg>
      </div>
    </div>
  );
}

export default function FloatingSocialIcons() {
  return (
    <>
      <div className="hidden md:block" aria-hidden>
        {ICONS.map((icon, i) => (
          <SocialIcon key={`${icon.name}-desktop`} icon={icon} pos={DESKTOP_POSITIONS[i % DESKTOP_POSITIONS.length]} />
        ))}
      </div>

      <div className="md:hidden" aria-hidden>
        {ICONS.map((icon, i) => (
          <SocialIcon key={`${icon.name}-mobile`} icon={icon} pos={MOBILE_POSITIONS[i % MOBILE_POSITIONS.length]} />
        ))}
      </div>

      <style>{`
        @keyframes socialFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.65; }
          25% { transform: translateY(-16px) rotate(3deg); opacity: 0.85; }
          50% { transform: translateY(-6px) rotate(-2deg); opacity: 1; }
          75% { transform: translateY(-20px) rotate(4deg); opacity: 0.75; }
        }
      `}</style>
    </>
  );
}
