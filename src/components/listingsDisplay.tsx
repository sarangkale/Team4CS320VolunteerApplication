import { useEffect, useMemo, useState } from "react";
import {
  retrieveListings,
  updateListingApplicant,
  type ListingData,
  type ListingFilters,
} from "../lib/listings";

const CATEGORY_OPTIONS = [
  "Animals",
  "Arts",
  "Community",
  "Education",
  "Environment",
  "Health",
  "Human Rights",
  "Youth",
];

const SKILL_OPTIONS = [
  "Fundraising",
  "Mentoring",
  "Graphic Design",
  "Social Media",
  "Data Entry",
  "Bilingual",
  "Event Planning",
];

const TRANSPORT_OPTIONS = ["Bus", "Car", "Walk", "Remote"];

const PAGE_SIZE = 10;

function calculateDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const R = 3958.8;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ListingsDisplay() {
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [locationError, setLocationError] = useState("");
  const [maxDistance, setMaxDistance] = useState<number | null>(null);

  const [filters, setFilters] = useState<ListingFilters>({
    searchTerm: "",
    categories: [],
    skill: [],
    transport: [],
  });

  useEffect(() => {
    async function loadListings() {
      setLoading(true);
      setError("");

      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;
      const result = await retrieveListings(start, end, filters);

      if (result.type === "success") {
        let updatedListings = result.data.map((listing) => {
          if (
            userLocation &&
            listing.latitude != null &&
            listing.longitude != null
          ) {
            const distance = calculateDistanceMiles(
              userLocation.latitude,
              userLocation.longitude,
              listing.latitude,
              listing.longitude
            );

            return {
              ...listing,
              distance,
            };
          }

          return {
            ...listing,
            distance: null,
          };
        });

        if (userLocation) {
          updatedListings = updatedListings.sort((a, b) => {
            if (a.distance == null) return 1;
            if (b.distance == null) return -1;
            return a.distance - b.distance;
          });
        }

        if (maxDistance != null) {
          updatedListings = updatedListings.filter(
            (listing) =>
              listing.distance != null && listing.distance <= maxDistance
          );
        }

        setListings(updatedListings);
        setHasMore(result.data.length === PAGE_SIZE);
      } else {
        setError(result.error.message);
      }

      setLoading(false);
    }

    loadListings();
  }, [filters, page, userLocation, maxDistance]);

  useEffect(() => {
    setPage(0);
  }, [filters, maxDistance]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories?.length) count++;
    if (filters.skill?.length) count++;
    if (filters.transport?.length) count++;
    if (maxDistance != null) count++;
    return count;
  }, [filters, maxDistance]);

  function toggleArrayFilter(
    key: keyof Pick<ListingFilters, "categories" | "skill" | "transport">,
    value: string
  ) {
    setFilters((prev) => {
      const current = prev[key] ?? [];
      const exists = current.includes(value);

      return {
        ...prev,
        [key]: exists
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  }

  function clearAllFilters() {
    setFilters((prev) => ({
      ...prev,
      categories: [],
      skill: [],
      transport: [],
    }));
    setMaxDistance(null);
  }

  function requestUserLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError("");
      },
      (error) => {
        console.error(error);
        setLocationError("Unable to access your location.");
      }
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#0b0b0b",
        minHeight: "100vh",
        padding: "24px",
        color: "white",
      }}
    >
      <h2>Volunteer Opportunities</h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search listings or organizations"
          value={filters.searchTerm ?? ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              searchTerm: e.target.value,
            }))
          }
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #555",
            background: "#1a1a1a",
            color: "white",
            minWidth: "320px",
          }}
        />

        <button
          onClick={() => setShowFilters(true)}
          style={{
            padding: "10px 16px",
            borderRadius: "999px",
            border: "1px solid #ccc",
            background: "white",
            color: "black",
            cursor: "pointer",
          }}
        >
          Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
        </button>

        <button
          onClick={requestUserLocation}
          style={{
            padding: "10px 16px",
            borderRadius: "999px",
            border: "1px solid #ccc",
            background: "white",
            color: "black",
            cursor: "pointer",
          }}
        >
          Use my location
        </button>
      </div>

      {userLocation && (
        <p>
          Your location: {userLocation.latitude.toFixed(4)},{" "}
          {userLocation.longitude.toFixed(4)}
        </p>
      )}

      {locationError && <p style={{ color: "red" }}>{locationError}</p>}

      {showFilters && (
        <div
          onClick={() => setShowFilters(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 999,
          }}
        />
      )}

      {showFilters && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "380px",
            height: "100vh",
            background: "white",
            color: "black",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
            padding: "24px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ margin: 0, color: "black" }}>
              Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
            </h2>
            <button
              onClick={() => setShowFilters(false)}
              style={{
                border: "1px solid #ccc",
                borderRadius: "999px",
                width: "40px",
                height: "40px",
                background: "white",
                color: "black",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "black" }}>Category</h3>
            {CATEGORY_OPTIONS.map((option) => (
              <label
                key={option}
                style={{
                  display: "block",
                  marginBottom: "12px",
                  textAlign: "left",
                  color: "black",
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(option) ?? false}
                  onChange={() => toggleArrayFilter("categories", option)}
                />{" "}
                {option}
              </label>
            ))}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "black" }}>Skill</h3>
            {SKILL_OPTIONS.map((option) => (
              <label
                key={option}
                style={{
                  display: "block",
                  marginBottom: "12px",
                  textAlign: "left",
                  color: "black",
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.skill?.includes(option) ?? false}
                  onChange={() => toggleArrayFilter("skill", option)}
                />{" "}
                {option}
              </label>
            ))}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "black" }}>Transport</h3>
            {TRANSPORT_OPTIONS.map((option) => (
              <label
                key={option}
                style={{
                  display: "block",
                  marginBottom: "12px",
                  textAlign: "left",
                  color: "black",
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.transport?.includes(option) ?? false}
                  onChange={() => toggleArrayFilter("transport", option)}
                />{" "}
                {option}
              </label>
            ))}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "black" }}>Distance</h3>
            <select
              value={maxDistance ?? ""}
              onChange={(e) =>
                setMaxDistance(e.target.value ? Number(e.target.value) : null)
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Any distance</option>
              <option value="5">Within 5 miles</option>
              <option value="10">Within 10 miles</option>
              <option value="25">Within 25 miles</option>
              <option value="50">Within 50 miles</option>
            </select>
          </div>

          <div
            style={{
              position: "sticky",
              bottom: 0,
              background: "white",
              paddingTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <button
              onClick={clearAllFilters}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                background: "white",
                color: "black",
                cursor: "pointer",
              }}
            >
              Clear all
            </button>

            <button
              onClick={() => setShowFilters(false)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "#0b3b2e",
                color: "white",
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading listings...</p>
      ) : error ? (
        <p>{error}</p>
      ) : listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <>
          {listings.map((listing) => (
            <div
              key={listing.listing_id}
              style={{
                backgroundColor: "#151515",
                color: "white",
                padding: "16px",
                marginBottom: "16px",
                borderRadius: "8px",
                textAlign: "left",
              }}
            >
              <p><strong>Name:</strong> {listing.listing_name}</p>
              <p><strong>Organization:</strong> {listing.org_name}</p>
              <p><strong>Description:</strong> {listing.description}</p>
              <p><strong>Date:</strong> {listing.listing_date}</p>
              <p><strong>Duration:</strong> {listing.duration}</p>
              <p><strong>Capacity:</strong> {listing.capacity}</p>
              <p><strong>Category:</strong> {listing.categories}</p>
              <p><strong>Needed Skill:</strong> {listing.needed_skill?.join(", ")}</p>
              <p><strong>Transport:</strong> {listing.transport}</p>
              <p>
                <strong>Address:</strong> {listing.street}, {listing.city},{" "}
                {listing.state} {listing.zip_code}
              </p>
              <p>
                <strong>Distance:</strong>{" "}
                {listing.distance != null
                  ? `${listing.distance.toFixed(2)} miles`
                  : "Unknown"}
              </p>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "16px",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                color: "white",
                background: "transparent",
                border: "1px solid #555",
                borderRadius: "8px",
                padding: "8px 16px",
                cursor: page === 0 ? "not-allowed" : "pointer",
                opacity: page === 0 ? 0.4 : 1,
              }}
            >
              Previous
            </button>
            <span>Page {page + 1}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              style={{
                color: "white",
                background: "transparent",
                border: "1px solid #555",
                borderRadius: "8px",
                padding: "8px 16px",
                cursor: !hasMore ? "not-allowed" : "pointer",
                opacity: !hasMore ? 0.4 : 1,
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
    const [listings, setListings] = useState([] as ListingData[]);
    useEffect(() => {
        retrieveListings(0, 10).then(
            newListings => {
                if (newListings.type == "success") { setListings(newListings.data) }
            }
        );
    }, []);

    const handleApplyClick = async (listingId: string | null | undefined) => {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user || listingId == undefined) {
            console.error("Authentication error or no user logged in:", error);
            alert("No valid username was provided. Please log in to apply for listings.");
            return;
        }

        const applicantIdentifier = user.user_metadata?.username || user.email;

        if (!applicantIdentifier) {
            console.error("Could not find a username or email for this user.");
            return;
        }
        console.log(`Sending application for ${applicantIdentifier} to listing ${listingId}...`);
        const result = await updateListingApplicant(listingId, applicantIdentifier);
        
        if (result.type === "success") {
            console.log(`Successfully logged application!`);
            alert("Application sent.");
        } else {
            console.error("Failed to update database:", result.error);
        }
    };

    return (
        <table>
            {chunk(listings, 5).map((listingChunk, i)=> {
                const individualListings = listingChunk.map(listing => <td style={{backgroundColor: "#151515", padding: "1em", borderRadius: "0.5em"}}>{
                    (console.log(listing), Object.keys(listing)
                        .filter(key => key != "listing_id" && key != "org_id")
                        .map(key => 
                            {const val = (listing as any)[key]; if (val) return <p key={`${listing.listing_id}-${key}`}>{key}: {val}</p>
                    })
                }
                    <button 
                        id={`apply-btn-${listing.listing_id}`} 
                        className="apply-button"
                        onClick={() => handleApplyClick(listing.listing_id)}
                    >
                        Apply!
                    </button>
                </td>);
                
                return <tr key={i}>{individualListings}</tr>;
            })}
        </table>
    )
}
