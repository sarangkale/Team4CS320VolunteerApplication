import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

// Average speeds used for travel time estimates
const AVG_DRIVE_SPEED_MPH = 30;   // urban/suburban driving
const BUS_OVERHEAD_MINUTES = 15;  // wait + walk to stop overhead
const BUS_SPEED_MPH = 15;         // average bus speed incl. stops

function calculateDistanceMiles(lat1, lon1, lat2, lon2) {
	const toRad = (d) => (d * Math.PI) / 180;
	const R = 3958.8;
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatMinutes(mins) {
	const m = Math.round(mins);
	if (m < 60) return `${m} min`;
	const h = Math.floor(m / 60);
	const rem = m % 60;
	return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

const MOCK_EVENTS = [
	{
		id: 1,
		title: "Community Food Pantry Support",
		organization: "Amherst Care Collective",
		date: "Tue, Apr 28",
		time: "4:00 PM - 7:00 PM",
		location: "North Amherst Community Center",
		latitude: 42.4001,
		longitude: -72.5282,
		description: "Help sort and distribute weekly food boxes for local families.",
		slotsFilled: 9,
		slotsTotal: 14,
		category: "Community",
		skills: ["Event Planning", "Data Entry"],
		transport: ["Bus", "Walk"],
	},
	{
		id: 2,
		title: "Riverfront Cleanup Day",
		organization: "Pioneer Green Team",
		date: "Sat, May 2",
		time: "9:30 AM - 12:30 PM",
		location: "Hadley Riverwalk Entrance",
		latitude: 42.3626,
		longitude: -72.5716,
		description: "Join a morning cleanup focused on trail and shoreline restoration.",
		slotsFilled: 18,
		slotsTotal: 20,
		category: "Environment",
		skills: ["Fundraising"],
		transport: ["Car", "Walk"],
	},
	{
		id: 3,
		title: "Youth Coding Mentor Session",
		organization: "Valley Tech Access",
		date: "Thu, May 7",
		time: "5:30 PM - 7:30 PM",
		location: "Downtown Library Lab",
		latitude: 42.3732,
		longitude: -72.5199,
		description: "Mentor middle school students during beginner coding activities.",
		slotsFilled: 6,
		slotsTotal: 8,
		category: "Education",
		skills: ["Mentoring"],
		transport: ["Bus", "Car"],
	},
	{
		id: 4,
		title: "Senior Center Wellness Check-In",
		organization: "NeighborLink",
		date: "Mon, May 11",
		time: "10:00 AM - 1:00 PM",
		location: "Amherst Senior Center",
		latitude: 42.3755,
		longitude: -72.5218,
		description: "Support staff with guest check-ins, light setup, and activity transitions.",
		slotsFilled: 10,
		slotsTotal: 10,
		category: "Health",
		skills: ["Event Planning", "Bilingual"],
		transport: ["Bus", "Car", "Walk"],
	},
	{
		id: 5,
		title: "Animal Shelter Weekend Help",
		organization: "Valley Paws Rescue",
		date: "Sat, May 16",
		time: "10:00 AM - 2:00 PM",
		location: "Northampton Animal Shelter",
		latitude: 42.3251,
		longitude: -72.6412,
		description: "Assist with dog walking, cat socialization, and general shelter upkeep.",
		slotsFilled: 3,
		slotsTotal: 10,
		category: "Animals",
		skills: ["Mentoring"],
		transport: ["Car"],
	},
	{
		id: 6,
		title: "Community Mural Project",
		organization: "Springfield Arts Initiative",
		date: "Sun, May 18",
		time: "1:00 PM - 5:00 PM",
		location: "Main Street Plaza",
		latitude: 42.1015,
		longitude: -72.5898,
		description: "Help paint a neighborhood mural celebrating local heritage and culture.",
		slotsFilled: 5,
		slotsTotal: 12,
		category: "Arts",
		skills: ["Graphic Design", "Social Media"],
		transport: ["Bus", "Car", "Walk"],
	},
];

const CATEGORY_OPTIONS = ["Animals", "Arts", "Community", "Education", "Environment", "Health", "Human Rights", "Youth"];
const SKILL_OPTIONS = ["Fundraising", "Mentoring", "Graphic Design", "Social Media", "Data Entry", "Bilingual", "Event Planning"];
const TRANSPORT_OPTIONS = ["Bus", "Car", "Walk", "Remote"];

export default function VolunteerDashboardEvents() {
	const navigate = useNavigate();
	const [expandedEvent, setExpandedEvent] = useState(null);
	const [showFilters, setShowFilters] = useState(false);

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [selectedTransport, setSelectedTransport] = useState([]);

	// Geolocation state
	const [userLocation, setUserLocation] = useState(null);
	const [locationError, setLocationError] = useState("");
	const [locationLoading, setLocationLoading] = useState(false);
	const [showLocationConsent, setShowLocationConsent] = useState(false);

	function handleLocationButtonClick() {
		if (userLocation) {
			setUserLocation(null);
			setLocationError("");
			return;
		}
		setShowLocationConsent(true);
	}

	function confirmLocationAccess() {
		setShowLocationConsent(false);
		if (!navigator.geolocation) {
			setLocationError("Geolocation is not supported by this browser.");
			return;
		}
		setLocationLoading(true);
		setLocationError("");
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
				setLocationLoading(false);
			},
			(err) => {
				console.error(err);
				setLocationError("Unable to access your location. Please allow location access in your browser settings.");
				setLocationLoading(false);
			}
		);
	}

	function toggleArrayFilter(setter, value) {
		setter((prev) =>
			prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
		);
	}

	const [maxDistance, setMaxDistance] = useState(null);     // miles; null = any
	const [slotsAvailable, setSlotsAvailable] = useState(false); // true = only show events with open slots

	function clearAllFilters() {
		setSearchTerm("");
		setSelectedCategories([]);
		setSelectedSkills([]);
		setSelectedTransport([]);
		setMaxDistance(null);
		setSlotsAvailable(false);
	}

	const activeFilterCount = useMemo(() => {
		let count = 0;
		if (selectedCategories.length) count++;
		if (selectedSkills.length) count++;
		if (selectedTransport.length) count++;
		if (maxDistance != null) count++;
		if (slotsAvailable) count++;
		return count;
	}, [selectedCategories, selectedSkills, selectedTransport, maxDistance, slotsAvailable]);

	// Enrich events with distance + travel time estimates when location is known
	const enrichedEvents = useMemo(() => {
		return MOCK_EVENTS.map((event) => {
			if (!userLocation || event.latitude == null || event.longitude == null) {
				return { ...event, distance: null, driveMinutes: null, busMinutes: null };
			}
			const dist = calculateDistanceMiles(
				userLocation.latitude, userLocation.longitude,
				event.latitude, event.longitude
			);
			const driveMinutes = event.transport.includes("Car")
				? (dist / AVG_DRIVE_SPEED_MPH) * 60
				: null;
			const busMinutes = event.transport.includes("Bus")
				? (dist / BUS_SPEED_MPH) * 60 + BUS_OVERHEAD_MINUTES
				: null;
			return { ...event, distance: dist, driveMinutes, busMinutes };
		});
	}, [userLocation]);

	const visibleEvents = useMemo(() => {
		return enrichedEvents.filter((event) => {
			if (
				searchTerm &&
				!event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
				!event.organization.toLowerCase().includes(searchTerm.toLowerCase())
			) {
				return false;
			}
			if (selectedCategories.length && !selectedCategories.includes(event.category)) {
				return false;
			}
			if (selectedSkills.length && !selectedSkills.some((s) => event.skills.includes(s))) {
				return false;
			}
			if (selectedTransport.length && !selectedTransport.some((t) => event.transport.includes(t))) {
				return false;
			}
			if (maxDistance != null) {
				if (event.distance == null || event.distance > maxDistance) return false;
			}
			if (slotsAvailable && event.slotsFilled >= event.slotsTotal) {
				return false;
			}
			return true;
		});
	}, [enrichedEvents, searchTerm, selectedCategories, selectedSkills, selectedTransport, maxDistance, slotsAvailable]);

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
				.nav-btn:hover { background: var(--green-soft); transform: translateY(-1px); }
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
				.nav-btn-logout:hover { background: #3a4c0d; transform: translateY(-1px); }

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
				.tab-btn:not(.active):hover { background: rgba(255, 255, 255, 0.55); }

				/* Search + filter bar */
				.filter-bar {
					display: flex;
					gap: 10px;
					margin-bottom: 20px;
					flex-wrap: wrap;
					align-items: center;
				}
				.search-input {
					flex: 1;
					min-width: 220px;
					padding: 10px 16px;
					border-radius: var(--pill);
					border: 1.5px solid #ccc;
					background: var(--white);
					color: var(--text);
					font-size: 15px;
					outline: none;
					transition: border-color 0.2s;
				}
				.search-input:focus { border-color: var(--green-mid); }
				.filter-toggle-btn {
					background: var(--white);
					border: 1.5px solid #ccc;
					border-radius: var(--pill);
					padding: 10px 20px;
					font-size: 15px;
					font-weight: 500;
					cursor: pointer;
					transition: background 0.2s, border-color 0.2s;
					color: var(--text);
					white-space: nowrap;
				}
				.filter-toggle-btn:hover { background: #f0f0f0; }
				.filter-toggle-btn.has-filters {
					background: var(--green-dark);
					color: var(--white);
					border-color: var(--green-dark);
				}
				.filter-toggle-btn.has-filters:hover { background: #3a4c0d; }

				/* Filter drawer overlay */
				.filter-overlay {
					position: fixed;
					inset: 0;
					background: rgba(0,0,0,0.35);
					z-index: 100;
					display: flex;
					justify-content: flex-end;
				}
				.filter-drawer {
					width: 340px;
					max-width: 90vw;
					background: var(--white);
					height: 100%;
					overflow-y: auto;
					padding: 28px 24px 100px;
					display: flex;
					flex-direction: column;
					gap: 28px;
				}
				.filter-drawer-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
				.filter-drawer-title {
					font-size: 20px;
					font-weight: 700;
				}
				.filter-close-btn {
					background: none;
					border: none;
					font-size: 22px;
					cursor: pointer;
					color: var(--text-muted);
					line-height: 1;
					padding: 4px;
				}
				.filter-section-label {
					font-size: 13px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.5px;
					color: #555;
					margin-bottom: 12px;
				}
				.filter-chip-group {
					display: flex;
					flex-wrap: wrap;
					gap: 8px;
				}
				.filter-chip {
					border: 1.5px solid #ccc;
					border-radius: var(--pill);
					padding: 7px 14px;
					font-size: 14px;
					cursor: pointer;
					background: var(--white);
					color: var(--text);
					transition: background 0.15s, border-color 0.15s, color 0.15s;
				}
				.filter-chip:hover { background: #f0f0f0; }
				.filter-chip.active {
					background: var(--green-mid);
					border-color: var(--green-mid);
					color: var(--white);
				}
				.filter-chip.disabled,
				.filter-chip:disabled {
					opacity: 0.38;
					cursor: not-allowed;
					pointer-events: none;
				}
				.filter-distance-note {
					font-size: 12px;
					color: #aaa;
					margin-bottom: 10px;
					font-style: italic;
				}
				.filter-drawer-footer {
					position: sticky;
					bottom: 0;
					background: var(--white);
					padding: 16px 0 0;
					display: flex;
					gap: 10px;
					margin-top: auto;
				}
				.filter-footer-clear {
					flex: 1;
					padding: 12px;
					border-radius: 10px;
					border: 1.5px solid #ccc;
					background: var(--white);
					color: var(--text);
					font-size: 15px;
					font-weight: 500;
					cursor: pointer;
					transition: background 0.2s;
				}
				.filter-footer-clear:hover { background: #f0f0f0; }
				.filter-footer-apply {
					flex: 1;
					padding: 12px;
					border-radius: 10px;
					border: none;
					background: var(--green-dark);
					color: var(--white);
					font-size: 15px;
					font-weight: 600;
					cursor: pointer;
					transition: background 0.2s;
				}
				.filter-footer-apply:hover { background: #3a4c0d; }

				/* Active filter pills strip */
				.active-filters-strip {
					display: flex;
					flex-wrap: wrap;
					gap: 8px;
					margin-bottom: 16px;
				}
				.active-filter-pill {
					display: flex;
					align-items: center;
					gap: 6px;
					background: var(--green-soft);
					color: var(--green-dark);
					border-radius: var(--pill);
					padding: 5px 12px;
					font-size: 13px;
					font-weight: 500;
				}
				.active-filter-pill button {
					background: none;
					border: none;
					cursor: pointer;
					font-size: 14px;
					line-height: 1;
					color: var(--green-dark);
					padding: 0;
					display: flex;
					align-items: center;
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
				.event-title { font-size: 19px; font-weight: 600; }
				.event-org { font-size: 14px; color: var(--text-muted); }
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
				.event-desc { font-size: 14px; line-height: 1.45; color: #4e4e4e; }

				/* Travel time badges */
				.travel-badges {
					display: flex;
					flex-wrap: wrap;
					gap: 6px;
				}
				.travel-badge {
					display: inline-flex;
					align-items: center;
					gap: 5px;
					border-radius: var(--pill);
					padding: 4px 10px;
					font-size: 12px;
					font-weight: 600;
				}
				.travel-badge-car {
					background: #e8f0ff;
					color: #2a4db5;
					border: 1px solid #c5d3f7;
				}
				.travel-badge-bus {
					background: #fff4e0;
					color: #a05c00;
					border: 1px solid #f0d8a0;
				}
				.location-bar {
					display: flex;
					align-items: center;
					gap: 10px;
					margin-bottom: 16px;
					flex-wrap: wrap;
				}
				.location-btn {
					background: var(--white);
					border: 1.5px solid #ccc;
					border-radius: var(--pill);
					padding: 8px 18px;
					font-size: 14px;
					font-weight: 500;
					cursor: pointer;
					transition: background 0.2s, border-color 0.2s;
					color: var(--text);
					display: flex;
					align-items: center;
					gap: 6px;
					position: relative;
				}
				.location-btn:hover { background: #f0f0f0; }
				.location-btn.active {
					background: #e8f0ff;
					border-color: #c5d3f7;
					color: #2a4db5;
				}
				.location-btn:not(.active):hover::after {
					content: "Enable location access to find the distance between you and the listing location";
					position: absolute;
					bottom: calc(100% + 10px);
					left: 50%;
					transform: translateX(-50%);
					background: #1a1a1a;
					color: #fff;
					font-size: 12px;
					font-weight: 400;
					line-height: 1.45;
					padding: 8px 12px;
					border-radius: 8px;
					white-space: normal;
					width: 220px;
					text-align: center;
					pointer-events: none;
					z-index: 50;
					box-shadow: 0 4px 12px rgba(0,0,0,0.2);
				}
				.location-btn:not(.active):hover::before {
					content: "";
					position: absolute;
					bottom: calc(100% + 4px);
					left: 50%;
					transform: translateX(-50%);
					border: 6px solid transparent;
					border-top-color: #1a1a1a;
					pointer-events: none;
					z-index: 50;
				}
				/* Consent dialog */
				.consent-overlay {
					position: fixed;
					inset: 0;
					background: rgba(0,0,0,0.4);
					z-index: 300;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 24px;
				}
				.consent-dialog {
					background: var(--white);
					border-radius: 18px;
					padding: 28px 28px 24px;
					max-width: 400px;
					width: 100%;
					box-shadow: 0 8px 40px rgba(0,0,0,0.18);
					text-align: center;
				}
				.consent-icon {
					font-size: 36px;
					margin-bottom: 12px;
				}
				.consent-title {
					font-size: 18px;
					font-weight: 700;
					margin-bottom: 10px;
					color: var(--text);
				}
				.consent-body {
					font-size: 14px;
					line-height: 1.55;
					color: var(--text-muted);
					margin-bottom: 22px;
				}
				.consent-note {
					font-size: 12px;
					color: #aaa;
					margin-bottom: 20px;
				}
				.consent-actions {
					display: flex;
					gap: 10px;
				}
				.consent-deny {
					flex: 1;
					padding: 11px;
					border-radius: 10px;
					border: 1.5px solid #ccc;
					background: var(--white);
					color: var(--text);
					font-size: 14px;
					font-weight: 500;
					cursor: pointer;
					transition: background 0.2s;
				}
				.consent-deny:hover { background: #f0f0f0; }
				.consent-allow {
					flex: 1;
					padding: 11px;
					border-radius: 10px;
					border: none;
					background: var(--green-dark);
					color: var(--white);
					font-size: 14px;
					font-weight: 600;
					cursor: pointer;
					transition: background 0.2s;
				}
				.consent-allow:hover { background: #3a4c0d; }
				.location-text {
					font-size: 13px;
					color: var(--text-muted);
				}
				.location-error {
					font-size: 13px;
					color: #c0392b;
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
				.progress-fill { height: 100%; background: var(--green-mid); }

				.empty-state {
					background: var(--white);
					border-radius: 14px;
					padding: 28px;
					text-align: center;
					color: var(--text-muted);
				}

				/* Modal */
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
				.event-modal-title { font-size: 26px; font-weight: 700; margin-bottom: 18px; }
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
				.event-modal-value { font-size: 15px; color: #1a1a1a; line-height: 1.45; }
				.event-modal-actions {
					display: flex;
					justify-content: flex-end;
					gap: 10px;
					flex-wrap: wrap;
					margin-top: 8px;
				}
				.event-modal-back, .event-modal-apply {
					border: none;
					border-radius: var(--pill);
					padding: 11px 22px;
					font-size: 15px;
					font-weight: 600;
					cursor: pointer;
					transition: background 0.2s, transform 0.15s;
				}
				.event-modal-back { background: #d9d9d9; color: var(--text); }
				.event-modal-back:hover { background: #c6c6c6; transform: translateY(-1px); }
				.event-modal-apply { background: var(--green-dark); color: var(--white); }
				.event-modal-apply:hover { background: #3a4c0d; transform: translateY(-1px); }

				@media (max-width: 920px) {
					.nav { padding: 10px 16px; height: auto; flex-wrap: wrap; }
					.nav-site-name { font-size: 18px; }
					.nav-btn, .nav-btn-logout { padding: 10px 18px; font-size: 14px; }
					.heading { font-size: 30px; }
					.events-grid { grid-template-columns: 1fr; }
					.event-modal-grid { grid-template-columns: 1fr; }
				}
				@media (max-width: 620px) {
					.main { padding: 28px 16px 40px; }
					.section-top { flex-direction: column; align-items: flex-start; }
					.tabs { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
					.tab-btn { padding: 10px 14px; }
					.filter-bar { flex-direction: column; align-items: stretch; }
					.search-input { min-width: unset; }
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

				{/* Search + filter bar */}
				<div className="filter-bar">
					<input
						type="text"
						className="search-input"
						placeholder="Search events or organizations…"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<button
						type="button"
						className={`filter-toggle-btn${activeFilterCount > 0 ? " has-filters" : ""}`}
						onClick={() => setShowFilters(true)}
					>
						{activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filters"}
					</button>
				</div>

				{/* Location bar */}
				<div className="location-bar">
					<button
						type="button"
						className={`location-btn${userLocation ? " active" : ""}`}
						onClick={handleLocationButtonClick}
						disabled={locationLoading}
					>
						📍 {locationLoading ? "Detecting…" : userLocation ? "Location on" : "Use my location"}
					</button>
					{userLocation && (
						<span className="location-text">Travel times shown</span>
					)}
					{locationError && <span className="location-error">{locationError}</span>}
				</div>

				{/* Active filter pills */}
				{(selectedCategories.length > 0 || selectedSkills.length > 0 || selectedTransport.length > 0 || maxDistance != null || slotsAvailable) && (
					<div className="active-filters-strip">
						{selectedCategories.map((c) => (
							<span key={c} className="active-filter-pill">
								{c}
								<button onClick={() => toggleArrayFilter(setSelectedCategories, c)}>×</button>
							</span>
						))}
						{selectedSkills.map((s) => (
							<span key={s} className="active-filter-pill">
								{s}
								<button onClick={() => toggleArrayFilter(setSelectedSkills, s)}>×</button>
							</span>
						))}
						{selectedTransport.map((t) => (
							<span key={t} className="active-filter-pill">
								{t}
								<button onClick={() => toggleArrayFilter(setSelectedTransport, t)}>×</button>
							</span>
						))}
						{maxDistance != null && (
							<span className="active-filter-pill">
								Within {maxDistance} mi
								<button onClick={() => setMaxDistance(null)}>×</button>
							</span>
						)}
						{slotsAvailable && (
							<span className="active-filter-pill">
								Slots available
								<button onClick={() => setSlotsAvailable(false)}>×</button>
							</span>
						)}
					</div>
				)}

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
									{(event.driveMinutes != null || event.busMinutes != null) && (
										<div className="travel-badges">
											{event.driveMinutes != null && (
												<span className="travel-badge travel-badge-car">
													🚗 {formatMinutes(event.driveMinutes)} drive
												</span>
											)}
											{event.busMinutes != null && (
												<span className="travel-badge travel-badge-bus">
													🚌 ~{formatMinutes(event.busMinutes)} by bus
												</span>
											)}
										</div>
									)}
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
					<div className="empty-state">No events match your current filters.</div>
				)}
			</main>

			{/* Filter drawer */}
			{showFilters && (
				<div
					className="filter-overlay"
					onClick={(e) => { if (e.target === e.currentTarget) setShowFilters(false); }}
				>
					<div className="filter-drawer">
						<div className="filter-drawer-header">
							<span className="filter-drawer-title">Filters</span>
							<button className="filter-close-btn" onClick={() => setShowFilters(false)}>×</button>
						</div>

						<div>
							<p className="filter-section-label">Category</p>
							<div className="filter-chip-group">
								{CATEGORY_OPTIONS.map((opt) => (
									<button
										key={opt}
										type="button"
										className={`filter-chip${selectedCategories.includes(opt) ? " active" : ""}`}
										onClick={() => toggleArrayFilter(setSelectedCategories, opt)}
									>
										{opt}
									</button>
								))}
							</div>
						</div>

						<div>
							<p className="filter-section-label">Skill</p>
							<div className="filter-chip-group">
								{SKILL_OPTIONS.map((opt) => (
									<button
										key={opt}
										type="button"
										className={`filter-chip${selectedSkills.includes(opt) ? " active" : ""}`}
										onClick={() => toggleArrayFilter(setSelectedSkills, opt)}
									>
										{opt}
									</button>
								))}
							</div>
						</div>

						<div>
							<p className="filter-section-label">Transport</p>
							<div className="filter-chip-group">
								{TRANSPORT_OPTIONS.map((opt) => (
									<button
										key={opt}
										type="button"
										className={`filter-chip${selectedTransport.includes(opt) ? " active" : ""}`}
										onClick={() => toggleArrayFilter(setSelectedTransport, opt)}
									>
										{opt}
									</button>
								))}
							</div>
						</div>

						<div>
							<p className="filter-section-label">Distance</p>
							{!userLocation && (
								<p className="filter-distance-note">Enable location to filter by distance</p>
							)}
							<div className="filter-chip-group">
								{[5, 10, 25, 50].map((mi) => (
									<button
										key={mi}
										type="button"
										className={`filter-chip${maxDistance === mi ? " active" : ""}${!userLocation ? " disabled" : ""}`}
										onClick={() => userLocation && setMaxDistance(maxDistance === mi ? null : mi)}
										disabled={!userLocation}
									>
										Within {mi} mi
									</button>
								))}
							</div>
						</div>

						<div>
							<p className="filter-section-label">Availability</p>
							<button
								type="button"
								className={`filter-chip${slotsAvailable ? " active" : ""}`}
								onClick={() => setSlotsAvailable((v) => !v)}
							>
								Slots still available
							</button>
						</div>

						<div className="filter-drawer-footer">
							<button type="button" className="filter-footer-clear" onClick={clearAllFilters}>
								Clear all
							</button>
							<button type="button" className="filter-footer-apply" onClick={() => setShowFilters(false)}>
								Apply
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Location consent dialog */}
			{showLocationConsent && (
				<div className="consent-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowLocationConsent(false); }}>
					<div className="consent-dialog">
						<div className="consent-icon">📍</div>
						<div className="consent-title">Allow location access?</div>
						<p className="consent-body">
							This site would like to use your location to calculate the distance between you and each volunteer event, and show estimated travel times by car and bus.
						</p>
						<p className="consent-note">Your location is only used in your browser and is never stored or shared.</p>
						<div className="consent-actions">
							<button type="button" className="consent-deny" onClick={() => setShowLocationConsent(false)}>
								Not now
							</button>
							<button type="button" className="consent-allow" onClick={confirmLocationAccess}>
								Allow access
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Event detail modal */}
			{expandedEvent && (
				<div
					className="event-overlay"
					onClick={(e) => { if (e.target === e.currentTarget) setExpandedEvent(null); }}
				>
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
							<div className="event-modal-field">
								<span className="event-modal-label">Skills Needed</span>
								<div className="event-modal-value">{expandedEvent.skills.join(", ")}</div>
							</div>
							<div className="event-modal-field">
								<span className="event-modal-label">Transport</span>
								<div className="event-modal-value">{expandedEvent.transport.join(", ")}</div>
							</div>
							{expandedEvent.distance != null && (
								<div className="event-modal-field">
									<span className="event-modal-label">Distance</span>
									<div className="event-modal-value">{expandedEvent.distance.toFixed(1)} miles away</div>
								</div>
							)}
							{(expandedEvent.driveMinutes != null || expandedEvent.busMinutes != null) && (
								<div className="event-modal-field" style={{ gridColumn: expandedEvent.distance != null ? "auto" : "1 / -1" }}>
									<span className="event-modal-label">Travel Time</span>
									<div className="event-modal-value" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
										{expandedEvent.driveMinutes != null && (
											<span>🚗 {formatMinutes(expandedEvent.driveMinutes)} by car</span>
										)}
										{expandedEvent.busMinutes != null && (
											<span>🚌 ~{formatMinutes(expandedEvent.busMinutes)} by bus</span>
										)}
									</div>
								</div>
							)}
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