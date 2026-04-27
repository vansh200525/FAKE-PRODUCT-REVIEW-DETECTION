import { useState } from "react";

export default function Contacts() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [sent, setSent] = useState(false);

  // UPDATED HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      if (response.ok) {
        setSent(true);

        setForm({
          name: "",
          email: "",
          message: ""
        });

        setTimeout(() => {
          setSent(false);
        }, 5000);
      } else {
        alert("Failed to save feedback");
      }
    } catch (error) {
      console.log(error);
      alert("Backend connection failed");
    }
  };

  return (
    <main>
      <section
        className="section-offwhite"
        style={{
          padding: "70px 0",
          minHeight: "80vh"
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              alignItems: "start"
            }}
          >
            {/* Map + address */}
            <div>
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  marginBottom: 20,
                  border: "1px solid #ddd"
                }}
              >
                <iframe
                  title="map"
                  src="https://maps.google.com/maps?q=Graphic%20Era%20Hill%20University,%20Clement%20Town,%20Dehradun&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="300"
                  style={{
                    border: 0,
                    display: "block"
                  }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div
                style={{
                  background: "#0d2018",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "20px 24px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 6
                    }}
                  >
                    ADDRESS
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      lineHeight: 1.7
                    }}
                  >
                    GRAPHIC ERA HILL UNIVERSITY,
                    CLEMENT TOWN,
                    DEHRADUN - 248002,
                    UTTARAKHAND, INDIA
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 6
                    }}
                  >
                    EMAIL
                  </p>

                  <p style={{ fontSize: 13 }}>
                    example123@gmail.com
                  </p>

                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.4)",
                      marginTop: 12,
                      marginBottom: 6
                    }}
                  >
                    PHONE
                  </p>

                  <p style={{ fontSize: 13 }}>
                    7906678966
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback form */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 14,
                padding: 32
              }}
            >
              <h3
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#111"
                }}
              >
                Share Your Feedback
              </h3>

              <p
                style={{
                  fontSize: 13,
                  color: "#888",
                  marginBottom: 28
                }}
              >
                Your feedback helps us improve and provide a better experience
                for you! 🔥
              </p>

              {sent && (
                <div
                  style={{
                    background: "#dcfce7",
                    border: "1px solid #86efac",
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 20,
                    color: "#166534",
                    fontSize: 13
                  }}
                >
                  ✅ Feedback sent successfully! Thank you.
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16
                }}
              >
                {[
                  ["name", "Name", "text"],
                  ["email", "Email", "email"]
                ].map(([k, l, t]) => (
                  <div key={k}>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#555",
                        display: "block",
                        marginBottom: 6
                      }}
                    >
                      {l}
                    </label>

                    <input
                      className="input-light"
                      type={t}
                      value={form[k]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [k]: e.target.value
                        })
                      }
                      placeholder={l}
                      required
                    />
                  </div>
                ))}

                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#555",
                      display: "block",
                      marginBottom: 6
                    }}
                  >
                    Message
                  </label>

                  <textarea
                    className="input-light"
                    value={form.message}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        message: e.target.value
                      })
                    }
                    placeholder="Write your message..."
                    rows={4}
                    required
                    style={{
                      resize: "none"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    justifyContent: "center"
                  }}
                >
                  Submit Feedback
                </button>

                <p
                  style={{
                    fontSize: 11,
                    color: "#bbb",
                    textAlign: "center"
                  }}
                >
                  Your feedback helps us improve and provide a better experience.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}