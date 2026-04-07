import { useState } from "react";

const UPCOMING_EVENTS = [
  {
    id: 1,
    org: "Volunteer Org #1",
    date: "January 01, 2026   11:30 AM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    hours: "XX hrs",
  },
  {
    id: 2,
    org: "Volunteer Org #2",
    date: "January 01, 2026   11:30 AM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    hours: "XX hrs",
  },
  {
    id: 3,
    org: "Volunteer Org #3",
    date: "January 01, 2026   11:30 AM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    hours: "XX hrs",
  },
];

const HISTORY_EVENTS = [
  {
    id: 1,
    org: "Volunteer Org #1",
    date: "January 01, 2026   11:30 AM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    hours: "XX hrs",
  },
  {
    id: 2,
    org: "Volunteer Org #2",
    date: "January 01, 2026   11:30 AM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    hours: "XX hrs",
  },
  {
    id: 3,
    org: "Volunteer Org #3",
    date: "January 01, 2026   11:30 AM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    hours: "XX hrs",
  },
];

const TOTAL_HOURS = "XX";

function EventCard({ org, date, description, hours }) {
  return (
    <div style={styles.eventCard}>
      <div style={styles.eventTop}>
        <span style={styles.eventOrg}>{org}</span>
        <span style={styles.eventDate}>{date}</span>
      </div>
      <div style={styles.eventBottom}>
        <span style={styles.eventDesc}>{description}</span>
        <span style={styles.eventHours}>{hours}</span>
      </div>
    </div>
  );
}

export default function ActivityDashboard() {
  const [activeTab, setActiveTab] = useState("activity");
  const [overlay, setOverlay] = useState(null);

  const overlayInfo = {
    logout: { title: "Log Out", msg: "You would be logged out and redirected to the login page." },
    profile: { title: "My Profile", msg: "This would navigate to your profile page." },
    events: { title: "View All Events", msg: "This would navigate to the events listing page." },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #ebebeb; min-height: 100vh; color: #1a1a1a; }
      `}</style>

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>logo</div>
        <span style={styles.navSiteName}>Website name</span>
        <button style={styles.navBtn} onClick={() => setOverlay("profile")}>My profile</button>
        <button style={styles.navBtn} onClick={() => setOverlay("events")}>View all events</button>
        <button style={styles.navBtnLogout} onClick={() => setOverlay("logout")}>Log out</button>
      </nav>

      {/* MAIN */}
      <div style={styles.main}>
        <h1 style={styles.greeting}>HELLO JOHN!</h1>

        {/* TABS */}
        <div style={styles.tabs}>
          <button
            style={activeTab === "profile" ? styles.tabActive : styles.tabInactive}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            style={activeTab === "activity" ? styles.tabActive : styles.tabInactive}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </button>
        </div>

        {/* UPCOMING SECTION */}
        <div style={styles.section}>
          <div style={styles.cardWrapper}>
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>Upcoming</span>
              </div>
              <div style={styles.eventList}>
                {UPCOMING_EVENTS.map((e) => (
                  <EventCard key={e.id} {...e} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* VOLUNTEER HISTORY SECTION */}
        <div style={styles.section}>
          <div style={styles.cardWrapper}>
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>Volunteer History</span>
                <span style={styles.totalHours}>Total number of hours: {TOTAL_HOURS}</span>
              </div>
              <div style={styles.eventList}>
                {HISTORY_EVENTS.map((e) => (
                  <EventCard key={e.id} {...e} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      {overlay && (
        <div
          style={styles.overlayBg}
          onClick={(e) => { if (e.target === e.currentTarget) setOverlay(null); }}
        >
          <div style={styles.overlayCard}>
            <h2 style={styles.overlayTitle}>{overlayInfo[overlay]?.title}</h2>
            <p style={styles.overlayMsg}>{overlayInfo[overlay]?.msg}</p>
            <button style={styles.overlayClose} onClick={() => setOverlay(null)}>Go back</button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  nav: {
    background: "#D9D9D9",
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
    height: 88,
    gap: 14,
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  navLogo: {
    background: "#485C11",
    color: "white",
    borderRadius: 9999,
    width: 82,
    height: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
    cursor: "pointer",
    flexShrink: 0,
  },
  navSiteName: {
    fontWeight: 700,
    fontSize: 21,
    marginRight: "auto",
  },
  navBtn: {
    background: "white",
    border: "none",
    borderRadius: 9999,
    padding: "13px 26px",
    fontSize: 16,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    color: "#485C11",
    cursor: "pointer",
  },
  navBtnLogout: {
    background: "#485C11",
    color: "white",
    border: "none",
    borderRadius: 9999,
    padding: "13px 26px",
    fontSize: 16,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
  },
  main: {
    maxWidth: 1140,
    margin: "0 auto",
    padding: "32px 24px 60px",
  },
  greeting: {
    fontSize: 40,
    fontWeight: 700,
    marginBottom: 22,
  },
  tabs: {
    background: "#D9D9D9",
    borderRadius: 9999,
    padding: 6,
    display: "inline-flex",
    gap: 4,
    marginBottom: 28,
  },
  tabActive: {
    background: "white",
    border: "none",
    borderRadius: 9999,
    padding: "10px 28px",
    fontSize: 16,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    color: "#1a1a1a",
    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
  },
  tabInactive: {
    background: "transparent",
    border: "none",
    borderRadius: 9999,
    padding: "10px 28px",
    fontSize: 16,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    cursor: "pointer",
    color: "#1a1a1a",
  },
  section: {
    marginBottom: 28,
  },
  cardWrapper: {
    background: "#D9D9D9",
    borderRadius: 20,
    padding: 12,
  },
  card: {
    background: "white",
    borderRadius: 14,
    padding: "24px 28px 28px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 400,
  },
  totalHours: {
    fontSize: 18,
    fontWeight: 400,
    color: "#333",
  },
  eventList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  eventCard: {
    background: "#D9D9D9",
    borderRadius: 15,
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  eventTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eventOrg: {
    fontSize: 18,
    fontWeight: 600,
  },
  eventDate: {
    fontSize: 17,
    fontWeight: 500,
    color: "#222",
  },
  eventBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  eventDesc: {
    fontSize: 15,
    fontWeight: 400,
    color: "#333",
    flex: 1,
    lineHeight: 1.5,
  },
  eventHours: {
    fontSize: 18,
    fontWeight: 600,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  overlayBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.42)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayCard: {
    background: "white",
    borderRadius: 20,
    padding: "44px 52px",
    textAlign: "center",
    maxWidth: 400,
    width: "90%",
    boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
  },
  overlayTitle: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
  },
  overlayMsg: {
    color: "#666",
    marginBottom: 26,
    fontSize: 15,
  },
  overlayClose: {
    background: "#485C11",
    color: "white",
    border: "none",
    borderRadius: 9999,
    padding: "12px 30px",
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
  },
};