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
        padding: 12,
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
            marginBottom: 0,
          }}
        />

        <div style={{ color: COLORS.darkTeal, fontSize: 22, marginBottom: 48 }}>
          Confidence, one swing at a time.
        </div>

      <div style={{ marginTop: '24px', color: COLORS.darkTeal }}>
  
  <div style={{ fontSize: '18px' }}>
    Private · Simple · Yours
  </div>

  <p
  style={{
    maxWidth: '520px',
    margin: '0 auto',
    textAlign: 'center',
    fontSize: '18px',
    lineHeight: '1.6',
    fontWeight: '400'
  }}
>
  Blushing Birdie is an encouraging golf round tracker
  <br />
  designed especially for women golfers.
</p>

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
            fontSize: 14,
            border: `1px solid ${COLORS.mistyBlue}66`,
          }}
        >
          Launching Soon
        </div>
      </div>
    </div>
  );
}
