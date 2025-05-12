import * as React from "react";

const ConfettiSVG = () => (
  <svg width="100vw" height="100vh" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}>
    {/* Simple SVG confetti dots and shapes */}
    <circle cx="20%" cy="30%" r="8" fill="#F59E42" />
    <circle cx="50%" cy="20%" r="10" fill="#0EA5E9" />
    <circle cx="80%" cy="40%" r="7" fill="#10B981" />
    <rect x="30%" y="60%" width="12" height="12" fill="#D946EF" transform="rotate(15 30 60)" />
    <rect x="70%" y="70%" width="10" height="10" fill="#FDE68A" transform="rotate(-10 70 70)" />
    <circle cx="60%" cy="80%" r="6" fill="#F97316" />
    <circle cx="40%" cy="75%" r="9" fill="#8B5CF6" />
    {/* Add more shapes for a festive look */}
  </svg>
);

const Sparkles = () => (
  <svg className="congrats-sparkles" width="320" height="120" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -60%)', pointerEvents: 'none', zIndex: 10001 }}>
    <g>
      <circle cx="40" cy="30" r="4" fill="#fff" opacity="0.8">
        <animate attributeName="r" values="4;7;4" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="280" cy="40" r="3" fill="#ffe985" opacity="0.7">
        <animate attributeName="r" values="3;6;3" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="160" cy="10" r="5" fill="#42e695" opacity="0.7">
        <animate attributeName="r" values="5;8;5" dur="1.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="80" r="3" fill="#ff6ec4" opacity="0.7">
        <animate attributeName="r" values="3;6;3" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="220" cy="100" r="4" fill="#7873f5" opacity="0.7">
        <animate attributeName="r" values="4;7;4" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </g>
  </svg>
);

const rainbowGradient = {
  background: 'linear-gradient(270deg, #ff6ec4, #7873f5, #42e695, #ffe985, #ff6ec4)',
  backgroundSize: '200% 200%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'rainbow-move 2s linear infinite, pulse 1.2s infinite',
};

const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes rainbow-move {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
@media (max-width: 600px) {
  .congrats-text {
    font-size: 1.2rem !important;
    line-height: 1.7rem !important;
    padding: 0.5rem 1rem !important;
    text-align: center !important;
    font-weight: 700 !important;
    border-radius: 1.5rem !important;
    margin: 0 auto !important;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,0.08);
    background: rgba(255,255,255,0.05);
  }
  .congrats-sparkles {
    width: 120px !important;
    height: 40px !important;
    left: 50% !important;
    top: 44% !important;
    transform: translate(-50%, -60%) !important;
  }
}
@media (prefers-color-scheme: dark) {
  .congrats-overlay {
    background: #000 !important;
  }
}
`;
document.head.appendChild(styleSheet);

const CongratsAnimation = ({ show, onClose }: { show: boolean; onClose?: () => void }) => {
  if (!show) return null;
  return (
    <>
      <ConfettiSVG />
      <Sparkles />
      <div
        className="congrats-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          flexDirection: 'column',
        }}
        onClick={onClose}
        onTouchStart={onClose}
        title="Click or tap to continue"
      >
        <div
          className="congrats-text text-5xl font-bold animate-bounce select-none"
          style={rainbowGradient}
        >
          {"Congrats! One step closer to Greatness"}
        </div>
      </div>
    </>
  );
};

export default CongratsAnimation; 