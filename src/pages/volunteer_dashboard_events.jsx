import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

// GENERATED USING GITHUB COPILOT - NOT FINAL DESIGN OR IMPLEMENTATION, JUST A STARTING POINT FOR FRONTEND DEVELOPMENT.
const MOCK_EVENTS = [
	{
		id: 1,
		title: "Community Food Pantry Support",
		organization: "Amherst Care Collective",
		date: "Tue, Apr 28",
		time: "4:00 PM - 7:00 PM",
		location: "North Amherst Community Center",
		description: "Help sort and distribute weekly food boxes for local families.",
		slotsFilled: 9,
		slotsTotal: 14,
		category: "Community",
	},
	{
		id: 2,
		title: "Riverfront Cleanup Day",
		organization: "Pioneer Green Team",
		date: "Sat, May 2",
		time: "9:30 AM - 12:30 PM",
		location: "Hadley Riverwalk Entrance",
		description: "Join a morning cleanup focused on trail and shoreline restoration.",
		slotsFilled: 18,
		slotsTotal: 20,
		category: "Environment",
	},
	{
		id: 3,
		title: "Youth Coding Mentor Session",
		organization: "Valley Tech Access",
		date: "Thu, May 7",
		time: "5:30 PM - 7:30 PM",
		location: "Downtown Library Lab",
		description: "Mentor middle school students during beginner coding activities.",
		slotsFilled: 6,
		slotsTotal: 8,
		category: "Education",
	},
	{
		id: 4,
		title: "Senior Center Wellness Check-In",
		organization: "NeighborLink",
		date: "Mon, May 11",
		time: "10:00 AM - 1:00 PM",
		location: "Amherst Senior Center",
		description: "Support staff with guest check-ins, light setup, and activity transitions.",
		slotsFilled: 10,
		slotsTotal: 10,
		category: "Health",
	},
];

const CATEGORY_FILTERS = ["All", "Community", "Environment", "Education", "Health"];

export default function VolunteerDashboardEvents() {
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [expandedEvent, setExpandedEvent] = useState(null);

	const visibleEvents = useMemo(() => {
		if (selectedCategory === "All") return MOCK_EVENTS;
		return MOCK_EVENTS.filter((event) => event.category === selectedCategory);
	}, [selectedCategory]);

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
				*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
				:root {
					--green-dark: #485C11;
					--green-mid: #8E9B77;
					--green-soft: #c5d09c;
					--bg-gray: #ebebeb;
					--panel-gray: #d9d9d9;
					--text: #1a1a1a;
					--text-muted: #686868;
					--white: #ffffff;
					--pill: 9999px;
				}
				body {
					font-family: 'DM Sans', sans-serif;
					background: var(--bg-gray);
					min-height: 100vh;
					color: var(--text);
				}
				button, input {
					font-family: 'DM Sans', sans-serif;
				}

				.nav {
					background: var(--panel-gray);
					display: flex;
					align-items: center;
					padding: 0 32px;
					height: 88px;
					gap: 14px;
					position: sticky;
					top: 0;
					z-index: 20;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
				}
				.nav-logo {
					background: var(--green-dark);
					color: var(--white);
					border-radius: var(--pill);
					width: 82px;
					height: 70px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: 700;
					font-size: 18px;
					flex-shrink: 0;
				}
				.nav-site-name {
					font-weight: 700;
					font-size: 21px;
					margin-right: auto;
				}
				.nav-btn {
					background: var(--white);
					color: var(--green-dark);
					border: none;
					border-radius: var(--pill);
					padding: 13px 26px;
					font-size: 16px;
					font-weight: 500;
					cursor: pointer;
					transition: background 0.2s, transform 0.15s;
				}
				.nav-btn:hover {
					background: var(--green-soft);
					transform: translateY(-1px);
				}
				.nav-btn-logout {
					background: var(--green-dark);
					color: var(--white);
					border: none;
					border-radius: var(--pill);
					padding: 13px 26px;
					font-size: 16px;
					font-weight: 500;
					cursor: pointer;
					transition: background 0.2s, transform 0.15s;
				}
				.nav-btn-logout:hover {
					background: #3a4c0d;
					transform: translateY(-1px);
				}

				.main {
					max-width: 1140px;
					margin: 0 auto;
					padding: 36px 24px 60px;
				}
				.heading {
					font-size: 40px;
					font-weight: 700;
					margin-bottom: 24px;
				}

				.section-top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 16px;
					margin-bottom: 20px;
				}
				.tabs {
					background: var(--panel-gray);
					border-radius: var(--pill);
					padding: 6px;
					display: inline-flex;
					gap: 4px;
				}
				.tab-btn {
					background: transparent;
					border: none;
					border-radius: var(--pill);
					padding: 10px 28px;
					font-size: 16px;
					font-weight: 400;
					cursor: pointer;
					transition: background 0.2s;
					color: var(--text);
				}
				.tab-btn.active {
					background: var(--white);
					font-weight: 500;
					box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
				}
				.tab-btn:not(.active):hover {
					background: rgba(255, 255, 255, 0.55);
				}

				.filters {
					display: flex;
					flex-wrap: wrap;
					gap: 8px;
					margin-bottom: 20px;
				}
				.filter-btn {
					border: none;
					border-radius: var(--pill);
					padding: 8px 16px;
					font-size: 14px;
					cursor: pointer;
					background: #d4d4d4;
					color: var(--text);
					transition: background 0.2s;
				}
				.filter-btn:hover {
					background: #c6c6c6;
				}
				.filter-btn.active {
					background: var(--green-mid);
					color: var(--white);
				}

				.events-grid {
					display: grid;
					grid-template-columns: repeat(2, minmax(0, 1fr));
					gap: 16px;
				}
				.event-card {
					background: var(--white);
					border-radius: 14px;
					padding: 18px;
					box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
					display: flex;
					flex-direction: column;
					gap: 10px;
					cursor: pointer;
					transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
				}
				.event-card:hover {
					background: #f3f3f3;
					transform: translateY(-1px);
					box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
				}
				.event-header {
					display: flex;
					justify-content: space-between;
					gap: 10px;
					align-items: flex-start;
				}
				.event-title {
					font-size: 19px;
					font-weight: 600;
				}
				.event-org {
					font-size: 14px;
					color: var(--text-muted);
				}
				.event-tag {
					background: #f1f4ea;
					border: 1px solid #d8e0c2;
					color: var(--green-dark);
					font-size: 12px;
					font-weight: 600;
					padding: 5px 10px;
					border-radius: var(--pill);
					white-space: nowrap;
				}
				.event-meta {
					display: flex;
					flex-wrap: wrap;
					gap: 7px;
					font-size: 14px;
					color: #404040;
				}
				.event-desc {
					font-size: 14px;
					line-height: 1.45;
					color: #4e4e4e;
				}
				.progress-row {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 13px;
					color: #474747;
				}
				.progress-track {
					height: 8px;
					border-radius: 999px;
					background: #e1e1e1;
					overflow: hidden;
				}
				.progress-fill {
					height: 100%;
					background: var(--green-mid);
				}

				.empty-state {
					background: var(--white);
					border-radius: 14px;
					padding: 28px;
					text-align: center;
					color: var(--text-muted);
				}
				.event-overlay {
					position: fixed;
					inset: 0;
					background: rgba(0, 0, 0, 0.45);
					z-index: 200;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 24px;
				}
				.event-modal {
					width: 100%;
					max-width: 680px;
					background: var(--white);
					border-radius: 20px;
					box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
					padding: 30px 32px;
				}
				.event-modal-title {
					font-size: 26px;
					font-weight: 700;
					margin-bottom: 18px;
				}
				.event-modal-grid {
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 14px;
					margin-bottom: 18px;
				}
				.event-modal-field {
					background: #f3f3f3;
					border-radius: 12px;
					padding: 12px 14px;
				}
				.event-modal-label {
					display: block;
					font-size: 12px;
					font-weight: 700;
					letter-spacing: 0.4px;
					text-transform: uppercase;
					color: #666;
					margin-bottom: 4px;
				}
				.event-modal-value {
					font-size: 15px;
					color: #1a1a1a;
					line-height: 1.45;
				}
				.event-modal-actions {
					display: flex;
					justify-content: flex-end;
					gap: 10px;
					flex-wrap: wrap;
					margin-top: 8px;
				}
				.event-modal-back,
				.event-modal-apply {
					border: none;
					border-radius: var(--pill);
					padding: 11px 22px;
					font-size: 15px;
					font-weight: 600;
					cursor: pointer;
					transition: background 0.2s, transform 0.15s;
				}
				.event-modal-back {
					background: #d9d9d9;
					color: var(--text);
				}
				.event-modal-back:hover {
					background: #c6c6c6;
					transform: translateY(-1px);
				}
				.event-modal-apply {
					background: var(--green-dark);
					color: var(--white);
				}
				.event-modal-apply:hover {
					background: #3a4c0d;
					transform: translateY(-1px);
				}

				@media (max-width: 920px) {
					.nav {
						padding: 10px 16px;
						height: auto;
						flex-wrap: wrap;
					}
					.nav-site-name {
						font-size: 18px;
					}
					.nav-btn,
					.nav-btn-logout {
						padding: 10px 18px;
						font-size: 14px;
					}
					.heading {
						font-size: 30px;
					}
					.events-grid {
						grid-template-columns: 1fr;
					}
					.event-modal-grid {
						grid-template-columns: 1fr;
					}
				}

				@media (max-width: 620px) {
					.main {
						padding: 28px 16px 40px;
					}
					.section-top {
						flex-direction: column;
						align-items: flex-start;
					}
					.tabs {
						width: 100%;
						display: grid;
						grid-template-columns: 1fr 1fr;
					}
					.tab-btn {
						padding: 10px 14px;
					}
				}
			`}</style>

			<nav className="nav">
				<div className="nav-logo">logo</div>
				<span className="nav-site-name">Website name</span>
				<button className="nav-btn" onClick={() => navigate("/volunteer_dashboard/profile")}>My profile</button>
				<button className="nav-btn" onClick={() => navigate("/volunteer_dashboard/events")}>View all events</button>
				<button className="nav-btn-logout" onClick={() => navigate("/login")}>Log out</button>
			</nav>

			<main className="main">
				<h1 className="heading">HELLO JOHN!</h1>

				<div className="section-top">
					<div className="tabs">
						<button className="tab-btn" onClick={() => navigate("/volunteer_dashboard/profile")}>Profile</button>
						<button className="tab-btn active" onClick={() => navigate("/volunteer_dashboard/events")}>Events</button>
					</div>
				</div>

				<div className="filters">
					{CATEGORY_FILTERS.map((category) => (
						<button
							key={category}
							type="button"
							className={`filter-btn${selectedCategory === category ? " active" : ""}`}
							onClick={() => setSelectedCategory(category)}
						>
							{category}
						</button>
					))}
				</div>

				{visibleEvents.length > 0 ? (
					<div className="events-grid">
						{visibleEvents.map((event) => {
							const fillPercent = Math.min(100, Math.round((event.slotsFilled / event.slotsTotal) * 100));

							return (
								<article key={event.id} className="event-card" onClick={() => setExpandedEvent(event)}>
									<div className="event-header">
										<div>
											<h2 className="event-title">{event.title}</h2>
											<p className="event-org">{event.organization}</p>
										</div>
										<span className="event-tag">{event.category}</span>
									</div>

									<div className="event-meta">
										<span>{event.date}</span>
										<span>•</span>
										<span>{event.time}</span>
										<span>•</span>
										<span>{event.location}</span>
									</div>

									<p className="event-desc">{event.description}</p>

									<div className="progress-row">
										<span>Volunteer slots</span>
										<span>{event.slotsFilled}/{event.slotsTotal}</span>
									</div>
									<div className="progress-track">
										<div className="progress-fill" style={{ width: `${fillPercent}%` }} />
									</div>
								</article>
							);
						})}
					</div>
				) : (
					<div className="empty-state">No events found for this category right now.</div>
				)}
			</main>

			{expandedEvent && (
				<div className="event-overlay" onClick={(e) => { if (e.target === e.currentTarget) setExpandedEvent(null); }}>
					<div className="event-modal">
						<div className="event-modal-title">{expandedEvent.title}</div>
						<div className="event-modal-grid">
							<div className="event-modal-field">
								<span className="event-modal-label">Organization</span>
								<div className="event-modal-value">{expandedEvent.organization}</div>
							</div>
							<div className="event-modal-field">
								<span className="event-modal-label">Category</span>
								<div className="event-modal-value">{expandedEvent.category}</div>
							</div>
							<div className="event-modal-field">
								<span className="event-modal-label">Date &amp; Time</span>
								<div className="event-modal-value">{expandedEvent.date} {expandedEvent.time}</div>
							</div>
							<div className="event-modal-field">
								<span className="event-modal-label">Location</span>
								<div className="event-modal-value">{expandedEvent.location}</div>
							</div>
							<div className="event-modal-field" style={{ gridColumn: "1 / -1" }}>
								<span className="event-modal-label">Description</span>
								<div className="event-modal-value">{expandedEvent.description}</div>
							</div>
							<div className="event-modal-field" style={{ gridColumn: "1 / -1" }}>
								<span className="event-modal-label">Volunteer Slots</span>
								<div className="event-modal-value">{expandedEvent.slotsFilled}/{expandedEvent.slotsTotal} filled</div>
							</div>
						</div>
						<div className="event-modal-actions">
							<button type="button" className="event-modal-back" onClick={() => setExpandedEvent(null)}>
								Back
							</button>
							<button type="button" className="event-modal-apply" onClick={() => {}}>
								Apply
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

