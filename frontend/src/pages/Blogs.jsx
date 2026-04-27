const ARTICLES = [
  {
    title: "How to Protect Yourself from Fake Product Scams in 2026",
    date: "15 March 2026",
    img: "https://picsum.photos/seed/scam1/400/250",
    category: "Safety",
    link: "https://www.consumer.ftc.gov/"
  },
  {
    title: "Government Tightens Rules Against Online Review Fraud",
    date: "02 April 2026",
    img: "https://picsum.photos/seed/scam2/400/250",
    category: "Policy",
    link: "https://www.india.gov.in/"
  },
  {
    title: "Fake Seller Detection Rising on E-commerce Platforms",
    date: "08 April 2026",
    img: "https://picsum.photos/seed/scam3/400/250",
    category: "Retail",
    link: "https://www.amazon.in/"
  },
  {
    title: "AI Systems Now Detect Fake Reviews Faster Than Humans",
    date: "19 March 2026",
    img: "https://picsum.photos/seed/scam4/400/250",
    category: "News",
    link: "https://openai.com/"
  },
  {
    title: "How AI Helps Catch Scam Networks Across India",
    date: "11 April 2026",
    img: "https://picsum.photos/seed/scam5/400/250",
    category: "AI & Crime",
    link: "https://www.cybercrime.gov.in/"
  },
  {
    title: "Digital Payment Fraud Cases Increase in 2026",
    date: "25 March 2026",
    img: "https://picsum.photos/seed/scam6/400/250",
    category: "Finance",
    link: "https://www.rbi.org.in/"
  },
  {
    title: "Consumers Report More Fake Product Listings in April 2026",
    date: "14 April 2026",
    img: "https://picsum.photos/seed/scam7/400/250",
    category: "Consumer",
    link: "https://www.flipkart.com/"
  },
  {
    title: "Users Share Experiences of Fake Review Scams in India",
    date: "28 March 2026",
    img: "https://picsum.photos/seed/scam8/400/250",
    category: "Survey",
    link: "https://www.quora.com/"
  },
  {
    title: "Global Scam Networks Using Fake Reviews Exposed",
    date: "05 April 2026",
    img: "https://picsum.photos/seed/scam9/400/250",
    category: "Global",
    link: "https://www.interpol.int/"
  }
];

export default function Blogs() {
  return (
    <main>
      <section
        className="section-white"
        style={{
          padding: "70px 0",
          minHeight: "85vh"
        }}
      >
        <div className="container">
          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              marginBottom: 6,
              color: "#111"
            }}
          >
            Latest News on "scams"
          </h2>

          <p
            style={{
              fontSize: 13,
              color: "#888",
              marginBottom: 36
            }}
          >
            Stay updated with the latest news and research about online scams and fake reviews.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 28
            }}
          >
            {ARTICLES.map(({ title, date, img, category, link }) => (
              <div
                key={title}
                style={{
                  border: "1px solid #e8e8e8",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#fff",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s, transform 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform =
                    "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform =
                    "translateY(0)";
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={img}
                    alt={title}
                    style={{
                      width: "100%",
                      height: 178,
                      objectFit: "cover",
                      display: "block"
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "#0284c7",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 20
                    }}
                  >
                    {category}
                  </span>
                </div>

                <div style={{ padding: "16px 18px 18px" }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: 1.55,
                      marginBottom: 10,
                      color: "#111"
                    }}
                  >
                    {title}
                  </p>

                  <p
                    style={{
                      fontSize: 12,
                      color: "#aaa",
                      marginBottom: 12
                    }}
                  >
                    {date}
                  </p>

                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 13,
                      color: "#0284c7",
                      fontWeight: 600,
                      textDecoration: "none"
                    }}
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}