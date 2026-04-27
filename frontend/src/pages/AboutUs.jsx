export default function AboutUs() {
  const sections = [
    { title:"The Problem We're Solving", body:"Counterfeit products are a growing concern worldwide. They not only harm legitimate businesses but also pose serious risks to consumers. Fake electronics, pharmaceuticals, and luxury goods can be dangerous and often fail to meet safety standards. Our project aims to address this issue by using machine learning, image recognition, and other advanced techniques to quickly and accurately identify fake products." },
    { title:"Our Motivation", body:"We are passionate about creating a safer and more transparent marketplace for everyone. Our motivation stems from the desire to protect consumers from the dangers of counterfeit goods and to support businesses in maintaining their brand integrity." },
    { title:"Future Improvements and Feature Additions", badge:"Upcoming", body:"Our platform allows users to upload images or descriptions of products they suspect might be counterfeit. Using a combination of machine learning algorithms and a comprehensive database of genuine products, our system analyzes the input and provides a confidence score." },
  ];
  return (
    <main>
      <section className="section-mid" style={{ padding:"70px 0", minHeight:"80vh" }}>
        <div className="container" style={{ maxWidth:880 }}>
          <h2 style={{ fontSize:30, fontWeight:700, marginBottom:6 }}>About Fake Product Detection</h2>
          <div style={{ width:60, height:3, background:"#4ade80", marginBottom:32 }} />
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:15, lineHeight:1.85, marginBottom:48 }}>
            The Fake Product Detection project is designed to help consumers and businesses identify counterfeit products in the market. With the rise of online shopping and global trade, fake products have become a significant issue, leading to financial losses, brand damage, and even health risks.
          </p>
          {sections.map(({ title, badge, body }) => (
            <div key={title} style={{ marginBottom:40 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <h3 style={{ fontSize:19, fontWeight:700 }}>{title}</h3>
                {badge && <span style={{ background:"#1a6b3c", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 12px", borderRadius:20 }}>{badge}</span>}
              </div>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14, lineHeight:1.85 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
