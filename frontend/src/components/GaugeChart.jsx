export default function GaugeChart({ fakePercent, label }) {
  const SIZE = 320;
  const CX = SIZE / 2;
  const CY = 170;
  const R = 120;
  const STROKE = 22;

  const genuinePercent = 100 - fakePercent;

  const isSafe = fakePercent < 40;
  const isWarning = fakePercent >= 40 && fakePercent < 65;

  const fakeColor =
    fakePercent >= 65 ? "#ef4444" : "#f59e0b";

  const labelColor =
    isSafe
      ? "#4ade80"
      : isWarning
      ? "#f59e0b"
      : "#ef4444";

  const displayPercent =
    label === "Genuine"
      ? genuinePercent
      : fakePercent;

  const degToXY = (deg) => ({
    x:
      CX +
      R *
        Math.cos(
          ((deg + 180) * Math.PI) / 180
        ),
    y:
      CY +
      R *
        Math.sin(
          ((deg + 180) * Math.PI) / 180
        ),
  });

  const arcPath = (startDeg, endDeg, color) => {
    if (
      Math.abs(endDeg - startDeg) < 0.5
    )
      return null;

    const s = degToXY(startDeg);
    const e = degToXY(endDeg);

    return (
      <path
        key={color + startDeg}
        d={`M ${s.x} ${s.y}
           A ${R} ${R} 0 0 1 ${e.x} ${e.y}`}
        fill="none"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="butt" // Changed here: "round" se "butt" kar diya for exact clean meeting point
        style={{
          transition: "all 1.2s ease"
        }}
      />
    );
  };

  /*
    NEEDLE SHOULD POINT EXACTLY
    WHERE GREEN + YELLOW MEET
  */

  const splitAngle = (genuinePercent / 100) * 180;

  const needleTip = degToXY(splitAngle);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <svg
        width={SIZE}
        height={230}
        viewBox={`0 0 ${SIZE} 230`}
      >
        {/* Background */}
        {arcPath(
          0,
          180,
          "rgba(255,255,255,0.08)"
        )}

        {/* Genuine */}
        {arcPath(
          0,
          splitAngle,
          "#4ade80"
        )}

        {/* Fake */}
        {arcPath(
          splitAngle,
          180,
          fakeColor
        )}

        {/* Needle */}
        <line
          x1={CX}
          y1={CY}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke="#ffffff"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle
          cx={CX}
          cy={CY}
          r={8}
          fill="#ffffff"
        />

        {/* ONE text only — no overlap */}
        <text
          x={CX}
          y={CY - 28}
          textAnchor="middle"
          fill={labelColor}
          style={{
            fontSize: 28,
            fontWeight: 800,
            fontFamily:
              "DM Sans, sans-serif"
          }}
        >
          {displayPercent.toFixed(1)}%
        </text>

        <text
          x={CX}
          y={CY - 4}
          textAnchor="middle"
          fill={labelColor}
          style={{
            fontSize: 15,
            fontWeight: 600,
            fontFamily:
              "DM Sans, sans-serif"
          }}
        >
          {label}
        </text>

        {/* Left label fixed */}
        <text
          x={35}
          y={CY + 20}
          textAnchor="start"
          fill="#4ade80"
          style={{
            fontSize: 12
          }}
        >
          Genuine
        </text>

        {/* Right label */}
        <text
          x={SIZE - 35}
          y={CY + 20}
          textAnchor="end"
          fill={fakeColor}
          style={{
            fontSize: 12
          }}
        >
          Fake
        </text>
      </svg>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginTop: 8,
          fontSize: 14
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#4ade80",
              display: "inline-block"
            }}
          />
          <span>
            Genuine:
            <strong
              style={{
                color: "#4ade80"
              }}
            >
              {" "}
              {genuinePercent.toFixed(1)}%
            </strong>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: fakeColor,
              display: "inline-block"
            }}
          />
          <span>
            Fake:
            <strong
              style={{
                color: fakeColor
              }}
            >
              {" "}
              {fakePercent.toFixed(1)}%
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}