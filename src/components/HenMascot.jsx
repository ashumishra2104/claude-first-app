import styled, { keyframes, css } from 'styled-components';

const bodyBob = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-7px); }
`;

const excitedBounce = keyframes`
  0%   { transform: translateY(0px) scale(1) rotate(0deg); }
  18%  { transform: translateY(-16px) scale(1.12) rotate(-6deg); }
  36%  { transform: translateY(-6px) scale(0.93) rotate(4deg); }
  55%  { transform: translateY(-13px) scale(1.07) rotate(-3deg); }
  75%  { transform: translateY(-2px) scale(0.97) rotate(1deg); }
  100% { transform: translateY(0px) scale(1) rotate(0deg); }
`;

const Wrapper = styled.div`
  display: inline-flex;
  filter: drop-shadow(0 4px 12px rgba(109, 40, 217, 0.28));
  animation: ${({ $excited }) =>
    $excited
      ? css`${excitedBounce} 0.72s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
      : css`${bodyBob} 2.8s ease-in-out infinite`};
`;

const SVG_STYLES = `
  @keyframes tailWagKf {
    0%, 100% { transform: rotate(0deg); }
    30%      { transform: rotate(-14deg); }
    70%      { transform: rotate(9deg); }
  }
  @keyframes blinkKf {
    0%, 90%, 100% { transform: scaleY(0); }
    94%           { transform: scaleY(1); }
  }
  @keyframes clipBobKf {
    0%, 100% { transform: rotate(0deg); }
    50%      { transform: rotate(-5deg); }
  }
  @keyframes combBobKf {
    0%, 100% { transform: translateY(0px); }
    50%      { transform: translateY(-3px); }
  }
  .h-tail {
    transform-box: fill-box;
    transform-origin: 100% 50%;
    animation: tailWagKf 2.4s ease-in-out infinite;
  }
  .h-lid {
    transform-box: fill-box;
    transform-origin: 50% 50%;
    animation: blinkKf 4s ease-in-out infinite;
  }
  .h-clip {
    transform-box: fill-box;
    transform-origin: 50% 0%;
    animation: clipBobKf 3.4s ease-in-out infinite 0.4s;
  }
  .h-comb {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    animation: combBobKf 2.8s ease-in-out infinite;
  }
`;

export default function HenMascot({ size = 80, excited = false }) {
  const h = Math.round(size * 158 / 148);
  return (
    <Wrapper $excited={excited}>
      <svg viewBox="0 0 148 158" width={size} height={h} style={{ overflow: 'visible' }}>
        <defs><style>{SVG_STYLES}</style></defs>

        {/* ── TAIL FEATHERS (left side, waggy) ─────────────────── */}
        <g className="h-tail">
          <ellipse cx="20" cy="82" rx="19" ry="7.5" transform="rotate(-42 20 82)" fill="#92400E"/>
          <ellipse cx="15" cy="100" rx="22" ry="8"   fill="#B45309"/>
          <ellipse cx="20" cy="118" rx="18" ry="7"   transform="rotate(32 20 118)" fill="#92400E"/>
        </g>

        {/* ── BODY ──────────────────────────────────────────────── */}
        <ellipse cx="72" cy="102" rx="53" ry="36" fill="#D97706"/>

        {/* ── BELLY ─────────────────────────────────────────────── */}
        <ellipse cx="76" cy="108" rx="32" ry="24" fill="#FEF3C7"/>

        {/* ── WING ──────────────────────────────────────────────── */}
        <ellipse cx="62" cy="97" rx="43" ry="24" transform="rotate(-7 62 97)" fill="#B45309"/>
        {/* Wing highlight */}
        <ellipse cx="55" cy="90" rx="22" ry="10" transform="rotate(-10 55 90)" fill="#D97706" opacity="0.4"/>

        {/* ── HEAD ──────────────────────────────────────────────── */}
        <circle cx="110" cy="53" r="29" fill="#D97706"/>

        {/* ── COMB (wiggles separately) ─────────────────────────── */}
        <g className="h-comb">
          <ellipse cx="97"  cy="26" rx="8"  ry="12" fill="#EF4444"/>
          <ellipse cx="110" cy="21" rx="9"  ry="13" fill="#F87171"/>
          <ellipse cx="123" cy="26" rx="8"  ry="11" fill="#EF4444"/>
        </g>

        {/* ── WATTLE ────────────────────────────────────────────── */}
        <ellipse cx="135" cy="67" rx="6" ry="10" fill="#EF4444"/>

        {/* ── BEAK ──────────────────────────────────────────────── */}
        <polygon points="132,48 132,60 147,54" fill="#F59E0B"/>
        {/* Beak highlight */}
        <polygon points="132,48 132,54 144,51" fill="#FCD34D" opacity="0.6"/>

        {/* ── EYE ───────────────────────────────────────────────── */}
        <circle cx="101" cy="51" r="9"  fill="#1E1B4B"/>
        <circle cx="98"  cy="48" r="3"  fill="white"/>
        <circle cx="104" cy="54" r="1.5" fill="#374151" opacity="0.5"/>

        {/* ── GLASSES (one visible lens + temple) ───────────────── */}
        <rect x="91" y="44" width="20" height="15" rx="3.5"
              fill="rgba(255,255,255,0.15)" stroke="#374151" strokeWidth="2"/>
        <line x1="111" y1="51" x2="132" y2="47"
              stroke="#374151" strokeWidth="2" strokeLinecap="round"/>

        {/* ── EYELID (blink animation) ───────────────────────────── */}
        <ellipse className="h-lid" cx="101" cy="51" rx="9" ry="9" fill="#D97706"/>

        {/* ── CLIPBOARD (gently bobs) ───────────────────────────── */}
        <g className="h-clip">
          {/* Shadow */}
          <rect x="79" y="95" width="36" height="44" rx="4"
                fill="rgba(0,0,0,0.08)" transform="translate(2,3)"/>
          {/* Board */}
          <rect x="79" y="95" width="36" height="44" rx="4"
                fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1.5"/>
          {/* Clip at top */}
          <rect x="91" y="91" width="12" height="7" rx="2.5" fill="#9CA3AF"/>
          <rect x="93" y="92" width="8"  height="4" rx="1.5" fill="#6B7280"/>
          {/* Header band */}
          <rect x="79" y="95" width="36" height="10" rx="4" fill="#7C3AED" opacity="0.15"/>
          {/* Ruled lines */}
          <line x1="83" y1="113" x2="111" y2="113" stroke="#E5E7EB" strokeWidth="1.5"/>
          <line x1="83" y1="121" x2="111" y2="121" stroke="#E5E7EB" strokeWidth="1.5"/>
          <line x1="83" y1="129" x2="105" y2="129" stroke="#E5E7EB" strokeWidth="1.5"/>
          {/* Green checkmarks */}
          <polyline points="83,112 86,116 93,108"
                    stroke="#059669" strokeWidth="2.2" fill="none"
                    strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="83,120 86,124 93,116"
                    stroke="#059669" strokeWidth="2.2" fill="none"
                    strokeLinecap="round" strokeLinejoin="round"/>
          {/* Pending item (no checkmark yet) */}
          <circle cx="85" cy="129" r="2.5" fill="none" stroke="#D1D5DB" strokeWidth="1.5"/>
        </g>

        {/* ── LEGS ──────────────────────────────────────────────── */}
        <rect x="57" y="136" width="9" height="18" rx="3.5" fill="#F59E0B"/>
        <rect x="78" y="136" width="9" height="18" rx="3.5" fill="#F59E0B"/>

        {/* ── FEET ──────────────────────────────────────────────── */}
        {/* Left foot */}
        <line x1="47" y1="154" x2="67" y2="154"
              stroke="#F59E0B" strokeWidth="4" strokeLinecap="round"/>
        <line x1="43" y1="150" x2="48" y2="154"
              stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="67" y1="154" x2="69" y2="149"
              stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
        {/* Right foot */}
        <line x1="76" y1="154" x2="96" y2="154"
              stroke="#F59E0B" strokeWidth="4" strokeLinecap="round"/>
        <line x1="72" y1="150" x2="77" y2="154"
              stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="96" y1="154" x2="98" y2="149"
              stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </Wrapper>
  );
}
