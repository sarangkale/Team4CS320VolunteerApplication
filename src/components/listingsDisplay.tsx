import { useEffect, useMemo, useState } from "react";
import {
  retrieveListings,
  type ListingData,
  type ListingFilters,
} from "../lib/listings";

const CATEGORY_OPTIONS = [
  "Animals", "Arts", "Community", "Education", 
  "Environment", "Health", "Human Rights", "Youth"
];

const SKILL_OPTIONS = [
  "Fundraising", "Mentoring", "Graphic Design", 
  "Social Media", "Data Entry", "Bilingual", "Event Planning"
];

const TRANSPORT_OPTIONS = ["Bus", "Car", "Walk", "Remote"];

const PAGE_SIZE = 10;

export default function ListingsDisplay() {
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [skillToAdd, setSkillToAdd] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

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
        setListings(result.data);
        setHasMore(result.data.length === PAGE_SIZE);
      } else {
        setError(result.error.message);
      }

      setLoading(false);
    }

    loadListings();
  }, [filters, page]);

  // Reset to page 0 whenever filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories?.length) count++;
    if (filters.skill?.length) count++;
    if (filters.transport?.length) count++;
    return count;
  }, [filters]);

  function toggleArrayFilter(
    key: keyof Pick<ListingFilters, "categories" | "skill" | "transport">,
    value: string
  ) {
    setFilters((prev) => {
      const current = prev[key] ?? [];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists ? current.filter((item) => item !== value) : [...current, value],
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

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search listings or organizations"
          value={filters.searchTerm ?? ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
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
      </div>

      {/* Backdrop — closes drawer on outside click */}
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
                style={{ display: "block", marginBottom: "12px", textAlign: "left", color: "black" }}
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
                style={{ display: "block", marginBottom: "12px", textAlign: "left", color: "black" }}
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
                style={{ display: "block", marginBottom: "12px", textAlign: "left", color: "black" }}
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
            </div>
          ))}

          <div style={{ display: "flex", gap: "12px", marginTop: "16px", alignItems: "center" }}>
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
