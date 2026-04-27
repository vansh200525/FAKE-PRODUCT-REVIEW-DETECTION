import GaugeChart from "./GaugeChart";

export default function ResultPanel({ result }) {
  if (!result) return null;

  let fakePercent = 0;
  let genuinePercent = 0;
  let totalReviews = 1;
  let fakeCount = 0;
  let sentiment = result.sentiment || "Neutral";
  let wordCount = result.features?.word_count ?? "—";
  let lexicalDiversity = result.features?.lexical_diversity ?? "—";

  // CASE 1 → Product URL Analysis
  if (result.total_reviews) {
    totalReviews = result.total_reviews;
    fakeCount = result.fake_count || 0;
    fakePercent = Number(result.fake_percentage || 0);
    genuinePercent = 100 - fakePercent;
  }

  // CASE 2 → Single Review Text Analysis
  else {
    fakePercent =
      result.label === "FAKE"
        ? Math.round((result.confidence || 0) * 100)
        : Math.round((1 - (result.confidence || 0)) * 100);

    genuinePercent = 100 - fakePercent;
    fakeCount = result.label === "FAKE" ? 1 : 0;
  }

  const gaugeLabel =
    fakePercent >= 65
      ? "Fake"
      : fakePercent >= 40
      ? "Likely Fake"
      : "Genuine";

  const fakeColor =
    fakePercent >= 65 ? "#ef4444" : "#f59e0b";

  const rows = [
    {
      key: "Total Reviews Analyzed",
      value: totalReviews
    },
    {
      key: "Fake Reviews Count",
      value: fakeCount
    },
    {
      key: "Fake Percentage",
      value: `${fakePercent}%`,
      color: fakeColor
    },
    {
      key: "Genuine Percentage",
      value: `${genuinePercent}%`,
      color: "#4ade80"
    },
    {
      key: "Sentiment",
      value: sentiment
    },
    {
      key: "Word Count",
      value: wordCount
    },
    {
      key: "Lexical Diversity",
      value: lexicalDiversity
    },
    {
      key: "Product Status",
      value: result.label,
      color:
        result.label === "FAKE"
          ? "#f87171"
          : "#4ade80"
    }
  ];

  return (
    <div
      style={{
        marginTop: 28,
        borderTop: "1px solid rgba(255,255,255,0.1)",
        paddingTop: 24
      }}
      className="fade-up"
    >
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 20,
          textAlign: "center",
          color: "#4ade80",
          textDecoration: "underline",
          textUnderlineOffset: 4
        }}
      >
        Analysis Result
      </h3>

      <div style={{ marginBottom: 24 }}>
        {rows.map(({ key, value, color }) => (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "7px 0",
              borderBottom:
                "1px solid rgba(255,255,255,0.06)",
              fontSize: 13
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.55)"
              }}
            >
              {key}:
            </span>

            <strong
              style={{
                color: color || "#fff"
              }}
            >
              {value}
            </strong>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "24px 0 8px"
        }}
      >
        <GaugeChart
          fakePercent={fakePercent}
          label={gaugeLabel}
        />
      </div>

      <p
        style={{
          marginTop: 20,
          fontSize: 12,
          color: "rgba(255,255,255,0.4)",
          lineHeight: 1.7,
          borderTop:
            "1px solid rgba(255,255,255,0.07)",
          paddingTop: 14
        }}
      >
        {result.label === "FAKE"
          ? "⚠️ Our model detected suspicious review patterns."
          : "✅ This review appears genuine based on natural language patterns."}
      </p>
    </div>
  );
}