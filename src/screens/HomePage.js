import { useRef, useEffect, useState } from 'react';
import { COLORS } from '../constants';
import logo from '../assets/images/Blushing_Birdie_Logo.png';
import { Link } from 'react-router-dom';
import { journalArticles } from '../data/journalArticles';
import screenHome from '../assets/images/screenHome.png';
import screenHole1 from '../assets/images/screenHole1.png';
import screenStats from '../assets/images/screenStats.png';
import screenExport from '../assets/images/screenExport.png';
import {
  DEFAULT_DESCRIPTION,
  organizationSchema,
  softwareApplicationSchema,
  usePageSeo,
  websiteSchema,
} from '../utils/seo';

const sectionWidth = {
  width: '100%',
  maxWidth: '1180px',
  margin: '0 auto',
  paddingLeft: '24px',
  paddingRight: '24px',
};

const navLinkStyle = {
  color: COLORS.darkTeal,
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: 600,
};
const mobileNavLinkStyle = {
  color: COLORS.darkTeal,
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: 600,
};
const footerLinkStyle = {
  color: COLORS.darkTeal,
  textDecoration: 'none',
  fontSize: '1.06rem',
  fontWeight: 600,
};
const sectionTitleStyle = {
  fontSize: '2rem',
  fontWeight: 700,
  color: COLORS.darkTeal,
  marginBottom: '12px',
};
const sectionTextStyle = {
  fontSize: '1.02rem',
  lineHeight: 1.7,
  color: '#35565A',
  maxWidth: '720px',
  margin: '0 auto',
};

const cardStyle = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '26px',
  border: '1px solid rgba(172,200,200,0.35)',
  boxShadow: '0 18px 40px rgba(16, 62, 67, 0.08)',
};
const sectionBaseStyle = {
  ...sectionWidth,
  paddingTop: '80px',
  paddingBottom: '80px',
  scrollMarginTop: '100px',
  textAlign: 'center',
};

const sectionGridStyle = {
  display: 'grid',
  gap: '20px',
  marginTop: '40px',
};

const featureSectionStyle = {
  padding: '72px 0',
};

const featureIntroStyle = {
  maxWidth: '680px',
  margin: '0 auto 14px',
  textAlign: 'center',
  fontSize: '1.02rem',
  lineHeight: 1.7,
  color: '#5f6f73',
};

const featureScrollStyle = {
  display: 'flex',
  overflowX: 'auto',
  gap: '24px',
  padding: '30px 16px 20px',
  scrollSnapType: 'x mandatory',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
};

const featureSlideStyle = {
  minWidth: '280px',
  maxWidth: '280px',
  flexShrink: 0,
  textAlign: 'center',
  scrollSnapAlign: 'center',
  transition: 'transform 0.35s ease, opacity 0.35s ease',
};

const featureImageStyle = {
  width: '100%',
  height: '520px',
  objectFit: 'cover',
  borderRadius: '28px',
  border: '1.5px solid rgba(31, 43, 45, 0.18)',
  boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
  background: '#ffffff',
  marginBottom: '18px',
};

const featureSlideTitleStyle = {
  fontSize: '1.05rem',
  fontWeight: 700,
  color: COLORS.darkTeal,
  marginBottom: '8px',
};

const featureSlideTextStyle = {
  fontSize: '0.92rem',
  lineHeight: 1.65,
  color: '#5f6f73',
  padding: '0 8px',
};

const featureDotsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  marginTop: '18px',
};

const featureDotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '999px',
  background: 'rgba(16, 62, 67, 0.18)',
  transition: 'all 0.3s ease',
};

const testimonialSectionStyle = {
  padding: '96px 0',
  background:
    'linear-gradient(180deg, rgba(255,249,245,1) 0%, rgba(244,168,185,0.08) 100%)',
};

const testimonialSubtextStyle = {
  fontSize: '1.02rem',
  lineHeight: 1.7,
  color: '#4E6A6E',
  maxWidth: '760px',
  margin: '0 auto',
};

const testimonialGridStyle = (isMobile) => ({
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
  gap: '24px',
  marginTop: '42px',
});

const testimonialCardStyle = (isMobile) => ({
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '24px',
  padding: isMobile ? '22px 18px' : '28px 24px',
  border: '1px solid rgba(172,200,200,0.32)',
  borderTop: '2px solid #edd1d7ff',
  boxShadow: '0 16px 40px rgba(16, 62, 67, 0.08)',
});

const testimonialMarkStyle = {
  fontSize: '2.2rem',
  lineHeight: 1,
  color: '#F4A8B9',
  fontWeight: 700,
  marginBottom: '1px',
  fontFamily: 'Georgia, serif',
};

const testimonialQuoteStyle = {
  fontSize: '1.02rem',
  lineHeight: 1.6,
  color: '#36565A',
  margin: 0,
};

const sectionStyle = {
  paddingTop: '60px',
  paddingBottom: '60px',
  background: 'linear-gradient(180deg, #FFF9F5 0%, #ffffff 100%)',
};

export default function HomePage() {
  usePageSeo({
    title: 'Blushing Birdie Golf Tracker for Women',
    description: DEFAULT_DESCRIPTION,
    path: '/',
    structuredData: [
      organizationSchema,
      websiteSchema,
      softwareApplicationSchema,
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is Blushing Birdie free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Blushing Birdie is free to use, with no subscriptions or hidden fees for the core golf round tracker.',
            },
          },
          {
            '@type': 'Question',
            name: 'Who is Blushing Birdie designed for?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Blushing Birdie is designed for women golfers and everyday recreational golfers who want simple, private, encouraging golf progress tracking.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where is Blushing Birdie data stored?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Rounds and stats are stored locally on your device by default. Optional account sync is only used if you choose to sign in.',
            },
          },
        ],
      },
    ],
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  const featuresScrollRef = useRef(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener('resize', handleResize);

  return () => window.removeEventListener('resize', handleResize);
}, []);

  useEffect(() => {
  if (!isMobile) return;

  const container = featuresScrollRef.current;
  if (!container) return;

  const handleScroll = () => {
    const children = Array.from(container.children);
    if (!children.length) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveFeatureIndex(closestIndex);
  };

  handleScroll();
  container.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    container.removeEventListener('scroll', handleScroll);
  };
}, [isMobile]);

 useEffect(() => {
  if (!isMobile) return;

  const container = featuresScrollRef.current;
  if (!container) return;

  const firstCard = container.children[0];
  if (!firstCard) return;

  requestAnimationFrame(() => {
    const left =
      firstCard.offsetLeft - (container.clientWidth - firstCard.clientWidth) / 2;

    container.scrollTo({
      left,
      behavior: 'auto',
    });
  });
}, [isMobile]);

// 👇 ADD THIS HERE
const handleSubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString(),
    });

    if (!response.ok) {
      throw new Error(`Signup failed with status ${response.status}`);
    }

    setSubmitted(true);
    form.reset();
  } catch (error) {
    console.error('Form submission error:', error);
  }
};

  const featureSlides = [
  {
    image: screenHome,
    title: 'Start here',
    text: 'A calm, simple home for your game — nothing extra, nothing confusing.',
  },
  {
    image: screenHole1,
    title: 'Log your round',
    text: 'Track each hole in seconds with a flow that feels natural and easy.',
  },
  {
    image: screenStats,
    title: 'See your progress',
    text: 'Clear, helpful insights — designed to support your experience, not interrupt it.',
  },
  {
    image: screenExport,
    title: 'Keep your rounds',
    text: 'Your rounds stay yours — simple to view, export, and back up when you choose.',
  },
];

  const testimonialItems = [
  {
    id: 1,
    quote:
      'I’ve tried a few golf apps before, but this is the first one that actually feels simple. I just track my round and move on.',
    name: 'Jennifer',
  },
  {
    id: 2,
    quote:
      'The stats are just enough to be helpful without getting in the way.',
    name: 'Kristin',
  },
  {
    id: 3,
    quote:
      'I love that I can play 9 holes and still log it without it feeling incomplete. That alone makes me want to keep using it.',
    name: 'Michelle',
  },
];

  const faqItems = [
  {
    id: 'free',
    question: 'Is the app free? Do I need an account?',
    answer:
      'Blushing Birdie is completely free to use.\n\nThere are no subscriptions or hidden fees, and you do not need an account to log rounds, view stats, or use the core app.\n\nYou can open the app and start right away. If you want account sync later, signing in is optional.',
  },
  {
    id: 'phone',
    question: 'Can I use it on my phone while I’m on the course?',
    answer:
      'Yes. Blushing Birdie is designed to work right on your phone while you play, so it’s easy to log your round as you go.',
  },
  {
    id: 'holes',
    question: 'Do I have to play a full 18 holes?',
    answer:
      'Not at all. Whether you play 3 holes, 9 holes, or a full round—it all counts. The app is designed to fit the way you actually play.',
  },
  {
    id: 'stats',
    question: 'What stats does it track?',
    answer:
      'Blushing Birdie focuses on simple, meaningful stats like fairways hit, putts, and overall progress—without getting in the way of your game.',
  },
  {
    id: 'handicap',
    question: 'What is an “Unofficial Handicap”?',
    answer:
      'Your Unofficial Handicap is a simple way to track your personal progress over time—without the pressure of official scoring systems.\n\nIt’s designed to give you a general sense of how you’re improving, round by round.\n\nYour handicap will appear after you’ve played:\n\n• At least 3 full rounds (18 holes)\n\n• 6 nine-hole rounds\n\nRounds are included when course rating and slope have been entered, helping your handicap reflect the difficulty of the course.\n\nThis helps ensure your number reflects a more accurate picture of your game.\n\nPartial rounds are not included in the calculation. You can still log and enjoy them, but your handicap is based only on completed rounds.\n\nThis is not an official USGA/GHIN handicap—just a personal, encouraging way to see your progress, one swing at a time. 🖤',
  },
  {
    id: 'privacy',
    question: 'Where is my data stored? Is it private?',
    answer:
      'Your rounds and stats are stored locally on your device by default.\n\nYou do not need an account for local mode. Account sync is optional and only used if you choose to sign in.\n\nBlushing Birdie does not sell your golf data. Your information stays in your control.',
  },
  {
    id: 'export-import',
    question: 'How do I export, import, or switch devices?',
    answer:
      'You can export your rounds at any time as a CSV file—a simple spreadsheet format you can open in Excel, Google Sheets, or Numbers.\n\nExporting allows you to keep a personal backup of your data and makes it easy to move your rounds to a new device.\n\nYou can also create an optional account for sync. Rounds and courses you save while signed in can load when you sign in on another device.\n\nIf you switch phones or your browser storage is cleared, you can import a previously saved file or load your account data to get your rounds and stats back.',
  },
  {
    id: 'install',
    question: 'How do I add it to my Home Screen?',
    answer:
      'On iPhone: Open the app in Safari, tap the Share icon, then choose “Add to Home Screen.”\n\nOn Android: Open the app in Chrome, tap the menu (three dots), then select “Add to Home Screen.”',
  },
];

const [openItems, setOpenItems] = useState([
  'free',
  'account',
  'storage',
  'phone',
]);

const toggleItem = (id) => {
  setOpenItems((prev) =>
    prev.includes(id)
      ? prev.filter((item) => item !== id)
      : [...prev, id]
  );
};

  return (
    <div
      style={{
        background:
          `linear-gradient(180deg,
            ${COLORS.cream} 0%,
            #FFFDFC 20%,
            #FFF6F8 45%,
            ${COLORS.cream} 70%,
            #FFF9F5 100%)`,
        minHeight: '100vh',
      }}
    > 
      <div id="top"></div>

               {/* NAV */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: '#FFFFFF',
          borderBottom: '1px solid rgba(16, 62, 67, 0.08)',
        }}
>
        <div
          style={{
            ...sectionWidth,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '14px',
            paddingBottom: '14px',
            position: 'relative',
          }}
        >
          <a
          href="#top"
          style={{
            textDecoration: 'none',
            display: 'inline-block',
          }}
          aria-label="Back to top"
        >
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: isMobile ? '1.9rem' : '2rem',
              color: COLORS.darkTeal,
              lineHeight: 1.05,
              cursor: 'pointer',
            }}
          >
            Blushing Birdie
          </div>
        </a>

          {isMobile ? (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <span
                style={{
                  width: '28px',
                  height: '3px',
                  background: COLORS.darkTeal,
                  borderRadius: '999px',
                  display: 'block',
                }}
              />
              <span
                style={{
                  width: '28px',
                  height: '3px',
                  background: COLORS.darkTeal,
                  borderRadius: '999px',
                  display: 'block',
                }}
              />
              <span
                style={{
                  width: '28px',
                  height: '3px',
                  background: COLORS.darkTeal,
                  borderRadius: '999px',
                  display: 'block',
                }}
              />
            </button>
          ) : (
            <nav style={{ display: 'flex', gap: '22px' }}>
              <a href="#features" style={navLinkStyle}>Features</a>
              <a href="#reviews" style={navLinkStyle}>Reviews</a>
              <a href="#faq" style={navLinkStyle}>FAQ</a>
              <a href="#shop" style={navLinkStyle}>Birdie Shop</a>
              <a href="#journal" style={{ ...navLinkStyle, fontStyle: 'italic' }}>
                Blushing Birdie Journal
              </a>
            </nav>
          )}

          {isMobile && menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: '24px',
                marginTop: '10px',
                background: COLORS.cream,
                border: `1px solid ${COLORS.mistyBlue}`,
                borderRadius: '18px',
                boxShadow: '0 12px 30px rgba(16, 62, 67, 0.10)',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                minWidth: '220px',
              }}
            >
              <a href="#features" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#reviews" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Reviews</a>
              <a href="#faq" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>FAQ</a>
              <a href="#shop" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Birdie Shop</a>
              <a href="#journal" style={{ ...mobileNavLinkStyle, fontStyle: 'italic' }} onClick={() => setMenuOpen(false)}>
                Blushing Birdie Journal
              </a>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          ...sectionWidth,
          paddingTop: '40px',
          paddingBottom: '20px',
          textAlign: 'center',
        }}
      >
        <img
          src={logo}
          alt="Blushing Birdie"
          style={{
            width: 'min(400px, 88vw)',
            marginBottom: '0px',
          }}
        />

       <div
  style={{
    fontSize: '24px',
    color: COLORS.blush,
    letterSpacing: '0.5px',
    marginTop: '0px',
    marginBottom: '40px',
    fontWeight: 500,
    lineHeight: 0.9,
  }}
>
 <>
  Confidence,
  <span className="mobileTaglineBreak">
    <br />
  </span>
  <span className="mobileTaglineSpacing">
    one swing at a time.
  </span>
</>
</div>
        <h1
          style={{
            fontSize: 'clamp(2rem, 3.6vw, 2.8rem)',
            lineHeight: 1.15,
            color: COLORS.darkTeal,
            marginBottom: '18px',
          }}
        >
          A simple, private golf tracker for women.
        </h1>

        <p
          style={{
            fontSize: '1.08rem',
            lineHeight: 1.8,
            maxWidth: '680px',
            margin: '0 auto 30px auto',
            color: '#35565A',
          }}
        >
          Blushing Birdie helps you track your rounds, reflect on your
          progress, and enjoy the game without pressure. Everything stays on
          your device — simple, personal, and completely yours.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '80px'}}>
          <Link
            to="/app"
            style={{
              background: COLORS.darkTeal,
              color: COLORS.cream,
              padding: '14px 28px',
              borderRadius: '16px',
              textDecoration: 'none',
              fontWeight: 700,
              display: 'inline-block',
            }}
          >
            Try the App
          </Link>

          <a
            href="#features"
            style={{
              background: COLORS.mistyBlue,
              color: COLORS.darkTeal,
              padding: '14px 28px',
              borderRadius: '16px',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            See the Features
          </a>
        </div>
      </section>

{/* FEATURES */}
<section id="features" style={featureSectionStyle}>
  <div style={sectionWidth}>
    <h2 style={{ ...sectionTitleStyle, textAlign: 'center' }}>
      A simple flow, from start to finish
    </h2>

    <p style={featureIntroStyle}>
      See how Blushing Birdie moves with you — from opening the app, to logging a round,
      to viewing your progress over time.
    </p>

    {isMobile ? (
      <>
        <div
          ref={featuresScrollRef}
          className="hide-scrollbar"
          style={featureScrollStyle}
        >
          {featureSlides.map((slide, index) => {
            const isActive = index === activeFeatureIndex;

            return (
              <div
                key={slide.title}
                style={{
                  ...featureSlideStyle,
                  transform: isActive ? 'scale(1)' : 'scale(0.94)',
                  opacity: isActive ? 1 : 0.72,
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={featureImageStyle}
                />
                <h3 style={featureSlideTitleStyle}>{slide.title}</h3>
                <p style={featureSlideTextStyle}>{slide.text}</p>
              </div>
            );
          })}
        </div>

        <div style={featureDotsStyle}>
          {featureSlides.map((_, index) => (
            <span
              key={index}
              style={{
                ...featureDotStyle,
                width: index === activeFeatureIndex ? '22px' : '8px',
                background:
                  index === activeFeatureIndex
                    ? COLORS.blush
                    : 'rgba(16, 62, 67, 0.18)',
              }}
            />
          ))}
        </div>
      </>
    ) : (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '28px',
          marginTop: '36px',
          alignItems: 'start',
        }}
      >
        {featureSlides.map((slide) => (
          <div
            key={slide.title}
            style={{
              textAlign: 'center',
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                ...featureImageStyle,
                height: '520px',
                marginBottom: '18px',
              }}
            />
            <h3 style={featureSlideTitleStyle}>{slide.title}</h3>
            <p style={featureSlideTextStyle}>{slide.text}</p>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

    {/* REVIEWS */}
<section id="reviews" style={testimonialSectionStyle}>
  <div style={sectionWidth}>
    <div style={{ textAlign: 'center' }}>
      <h2 style={sectionTitleStyle}>What Women Love About Blushing Birdie</h2>
      <p style={testimonialSubtextStyle}>
        Designed for everyday golfers who want to enjoy the game and build
        confidence along the way.
      </p>
    </div>

    <div style={testimonialGridStyle(isMobile)}>
      {testimonialItems.map((item) => (
        <div key={item.id} style={testimonialCardStyle(isMobile)}>
          <div style={testimonialMarkStyle}>“</div>
          <p style={testimonialQuoteStyle}>{item.quote}</p>
          <p
            style={{
              marginTop: '14px',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: COLORS.darkTeal,
            }}
          >
            — {item.name}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

   {/* FAQ */}
<section id="faq" style={sectionBaseStyle}>
  <h2 style={sectionTitleStyle}>Frequently Asked Questions</h2>

  <div style={{ display: 'grid', gap: '14px', marginTop: '30px' }}>
    {faqItems.map((item, index) => {
      const isOpen = openItems.includes(item.id);

      return (
        <div
          key={item.id}
          style={{
            ...cardStyle,
            padding: '18px 20px',
            textAlign: 'left',
            cursor: 'pointer',
            borderTop:
              index !== 0
                ? '1px solid rgba(16, 62, 67, 0.08)'
                : 'none',
          }}
          onClick={() => toggleItem(item.id)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{item.question}</strong>
            <span>{isOpen ? '−' : '+'}</span>
          </div>

         {isOpen && (
          <div
            style={{
              marginTop: '12px',
              color: '#5F7C7F',
              lineHeight: 1.6,
              fontSize: '0.95rem',
            }}
          >
            {item.answer.split('\n\n').map((block, i) => {
              if (block.includes('•')) {
                const lines = block
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean);

                return (
                  <ul
                    key={i}
                    style={{
                      margin: '8px 0',
                      paddingLeft: '20px',
                    }}
                  >
                    {lines.map((line, idx) => (
                      <li
                        key={idx}
                        style={{
                          marginBottom: '6px',
                        }}
                      >
                        {line.replace('• ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p
                  key={i}
                  style={{
                    margin: '8px 0',
                  }}
                >
                  {block}
                </p>
              );
            })}
          </div>
        )}
        </div>
      );
    })}
  </div>
</section>

     {/* BIRDIE SHOP */}
<section id="shop" style={sectionStyle}>
  <div style={sectionWidth}>
    <div style={{ textAlign: 'center' }}>
      <h2 style={sectionTitleStyle}>Birdie Shop</h2>
      <p style={sectionTextStyle}>
        A thoughtful collection of pieces designed to bring confidence and
        ease to your game.
      </p>
    </div>

    <div
      style={{
        marginTop: '28px',
        background: 'rgba(255,255,255,0.82)',
        border: '1px solid rgba(16, 62, 67, 0.08)',
        borderRadius: '28px',
        padding: '30px 24px',
        textAlign: 'center',
        boxShadow: '0 12px 30px rgba(16, 62, 67, 0.06)',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '1.15rem',
          fontWeight: 500,
          color: COLORS.charcoal,
        }}
      >
        Birdie Shop — Coming Soon
      </p>
    </div>
  </div>
</section>

     {/* JOURNAL */}
<section id="journal" style={sectionBaseStyle}>
  <div style={{ ...sectionWidth, textAlign: 'center' }}>
    <p
      style={{
        fontSize: '0.78rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: COLORS.blush,
        fontWeight: 700,
        marginBottom: '10px',
      }}
    >
      Editorial
    </p>

    <h2
  style={{
    ...sectionTitleStyle,
    fontFamily: "'Playfair Display', serif",
    fontStyle: 'italic',
    fontWeight: 515, // 👈 lighter
    letterSpacing: '0.02em',
    marginBottom: '14px',
  }}
>
  the birdie journal
</h2>

    <p
      style={{
        ...sectionTextStyle,
        maxWidth: '760px',
        margin: '0 auto 36px',
        lineHeight: 1.7,
      }}
    >
      Thoughtful notes, simple encouragement, and everyday reflections for women
      who love the&nbsp;game.
    </p>

    <div
  style={{
    ...sectionGridStyle,
    alignItems: 'stretch',
  }}
>
  {journalArticles.slice(0, 3).map((article) => (
    <Link
      key={article.slug}
      to={`/journal/${article.slug}`}
      style={{
        textDecoration: 'none',
        display: 'flex',
      }}
    >
      <div
        style={{
          ...cardStyle,
          padding: '26px',
          textAlign: 'left',
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: COLORS.blush,
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            {article.category}
          </p>

          <h3
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.45,
              color: COLORS.darkTeal,
              marginBottom: '12px',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {article.title}
          </h3>

          <p
            style={{
              fontSize: '0.96rem',
              lineHeight: 1.7,
              color: '#4f6365',
              margin: 0,
            }}
          >
            {article.excerpt}
          </p>
        </div>
      </div>
    </Link>
  ))}
</div>

    <div style={{ marginTop: '28px' }}>
  <Link
    to="/journal"
    style={{
      display: 'inline-block',
      background: COLORS.darkTeal,
      color: COLORS.cream,
      padding: '14px 28px',
      borderRadius: '999px',
      textDecoration: 'none',
      fontWeight: 700,
      fontSize: '0.95rem',
    }}
  >
    view the birdie journal
  </Link>
</div>

  </div>
</section>

     {/* EMAIL */}
<section
  id="contact"
  style={{
    ...sectionBaseStyle,
    paddingBottom: '80px',
  }}
>
  <div style={{ ...cardStyle, padding: '60px 40px', textAlign: 'center' }}>
    <h3 style={{ color: COLORS.darkTeal, marginBottom: '12px' }}>
      Stay in the Loop
    </h3>

    <p style={{ color: '#5F7C7F', marginBottom: '24px' }}>
      Journal updates, thoughtful notes, and a few lovely things along the way.
    </p>

    {submitted ? (
      <p
        style={{
          marginTop: '10px',
          color: COLORS.darkTeal,
          fontSize: '0.95rem',
          fontWeight: 500,
        }}
      >
        Thank you for signing up 💕
      </p>
    ) : (
      <form
        name="email-signup"
        method="POST"
        data-netlify="true"
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginTop: '10px',
        }}
      >
        <input type="hidden" name="form-name" value="email-signup" />

        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          style={{
            padding: '14px 20px',
            borderRadius: '16px',
            border: '1px solid #ccc',
            minWidth: '230px',
            maxWidth: '290px',
            width: '100%',
          }}
        />

        <button
          type="submit"
          style={{
            padding: '14px 26px',
            borderRadius: '16px',
            background: COLORS.darkTeal,
            color: COLORS.cream,
            border: '1px solid rgba(0,0,0,0.15)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Sign Up
        </button>
      </form>
    )}
  </div>
</section>

{/* FINAL CTA */}
<section
  style={{
    padding: '80px 20px',
    textAlign: 'center',
  }}
>
  <h2
    style={{
      fontSize: isMobile ? '28px' : '34px',
      color: COLORS.darkTeal,
      marginBottom: '16px',
      lineHeight: 1.2,
    }}
  >
    Ready to see your game differently?
  </h2>

  <p
    style={{
      maxWidth: '520px',
      margin: '0 auto 28px',
      color: COLORS.charcoal,
      lineHeight: 1.6,
    }}
  >
    No pressure. No account required. Just your game.
  </p>

  <a
    href="/app"
    onClick={() => {
      if (window.gtag) {
        window.gtag('event', 'bottom_try_app_click');
      }
    }}
    style={{
      display: 'inline-block',
      backgroundColor: COLORS.darkTeal,
      color: COLORS.cream,
      padding: '16px 28px',
      borderRadius: '999px',
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: '16px',
    }}
  >
    Try the App
  </a>
</section>

     {/* FOOTER */}
<footer
  style={{
    textAlign: 'center',
    paddingTop: '14px',
    paddingBottom: '36px',
    color: '#5F7C7F',
  }}
>
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap',
      marginBottom: '22px',
    }}
  >
    <Link to="/app" style={footerLinkStyle}>
      Try the App
    </Link>
    <span>•</span>
    <Link to="/journal" style={footerLinkStyle}>
      Journal
    </Link>
    <span>•</span>
    <Link to="/our-story" style={footerLinkStyle}>
      Our Story
    </Link>
    <span>•</span>
    <Link to="/privacy" style={footerLinkStyle}>
      Privacy
    </Link>
    <span>•</span>
    <a href="#contact" style={footerLinkStyle}>
      Contact
    </a>
  </div>
  © 2026 Blushing Birdie
</footer>
    </div>
  );
}
