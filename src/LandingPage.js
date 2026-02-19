import logo from "./assets/images/Blushing_Birdie_Logo.png";

const COLORS = {
  blush: "#F4A8B9",
  mistyBlue: "#ACC8C8",
  cream: "#FDF8F6",
  darkTeal: "#103E43",
  charcoal: "#1F2B2D",
};

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${COLORS.cream} 0%, ${COLORS.cream} 65%, ${COLORS.blush}12 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div style={{ maxWidth: 720 }}>
        <img
          src={logo}
          alt="Blushing Birdie"
          style={{
            width: 320,
            maxWidth: "80vw",
            height: "auto",
            marginBottom: 18,
          }}
        />

        <div style={{ color: COLORS.darkTeal, fontSize: 22, marginBottom: 10 }}>
          Confidence, one swing at a time.
        </div>

        <div
          style={{
            color: COLORS.charcoal,
            opacity: 0.85,
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          Progress Over Perfection.
          <br />
          <span style={{ color: COLORS.darkTeal, fontWeight: 700 }}>
            Launching soon.
          </span>
        </div>

        <div
          style={{
            marginTop: 22,
            display: "inline-flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 14px",
            borderRadius: 999,
            backgroundColor: `${COLORS.mistyBlue}33`,
            color: COLORS.darkTeal,
            fontSize: 13,
            border: `1px solid ${COLORS.mistyBlue}66`,
          }}
        >
          No accounts • No tracking • Just you
        </div>
      </div>
    </div>
  );
}
