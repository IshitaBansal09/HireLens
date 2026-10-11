import React from "react"

// The match score as a camera aperture — HireLens bringing the candidate into focus.
// The ring fills to the score; the iris blades sit behind the number.
const ScoreDial = ({ score = 0, size = 168 }) => {
  const safe = Math.max(0, Math.min(100, Math.round(score)))
  const tier = safe >= 80 ? "high" : safe >= 60 ? "mid" : "low"
  const stroke = 9
  const r = (size - stroke) / 2 - 6
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (safe / 100) * circ

  // six iris blades
  const blades = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 * Math.PI) / 180
    const inner = r - 20
    const x1 = cx + Math.cos(a) * 8
    const y1 = cy + Math.sin(a) * 8
    const x2 = cx + Math.cos(a) * inner
    const y2 = cy + Math.sin(a) * inner
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
  })

  return (
    <div className={`dial dial--${tier}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <g className="dial__iris" strokeWidth="1" strokeLinecap="round">
          {blades}
        </g>
        <circle className="dial__track" cx={cx} cy={cy} r={r} strokeWidth={stroke} fill="none" />
        <circle
          className="dial__value"
          cx={cx}
          cy={cy}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ "--from": `${circ}px`, transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>
      <div className="dial__center">
        <span className="dial__num">{safe}</span>
        <span className="dial__pct">% match</span>
      </div>
    </div>
  )
}

export default ScoreDial
