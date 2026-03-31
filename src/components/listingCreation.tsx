import { useState } from "react";
import { createListing } from "../lib/listings.ts";

const SKILL_OPTIONS = [
    "Fundraising", "Mentoring", "Graphic Design", 
    "Social Media", "Data Entry", "Bilingual", "Event Planning"
  ];

export default function ListingCreation() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [skillToAdd, setSkillToAdd] = useState("");

  async function createListingSubmit(formData: FormData) {
    const name = (formData.get("listing_name") as string).trim();
    const capacityRaw = formData.get("listing_capacity") as string;
    const description = (formData.get("listing_description") as string).trim();
    const date = formData.get("listing_date") as string;
    const duration = (formData.get("listing_duration") as string).trim();
    const category = formData.get("listing_category") as string;
    const skill = selectedSkills;
    const transport = formData.get("listing_transport") as string;

    // Validate required fields
    if (!name) {
      setErrorMessage("Listing name is required.");
      setStatus("error");
      return;
    }

    const capacity = Number.parseInt(capacityRaw, 10);
    if (Number.isNaN(capacity) || capacity <= 0) {
      setErrorMessage("Capacity must be a positive number.");
      setStatus("error");
      return;
    }

    if (!description) {
      setErrorMessage("Description is required.");
      setStatus("error");
      return;
    }

    if (!date) {
      setErrorMessage("Date is required.");
      setStatus("error");
      return;
    }

    if (!duration.trim()) {
      setErrorMessage("Duration is required.");
      setStatus("error");
      return;
    }

    if (!category) {
      setErrorMessage("Category is required.");
      setStatus("error");
      return;
    }

    if (!transport) {
      setErrorMessage("Transport is required.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await createListing(name, description, date, duration, capacity, category, skill, transport);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to create listing.");
      setStatus("error");
    }
  }

  function addSkill(skill: string) {
    const trimmed = skill.trim();
    if (!trimmed) return;
  
    setSelectedSkills((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
  }
  
  function removeSkill(skill: string) {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  }

  return (
    <form action={createListingSubmit}>
      <input type="text" name="listing_name" placeholder="Listing name" required />
      <input type="number" name="listing_capacity" placeholder="Listing capacity" min={1} required />
      <br />
      <textarea name="listing_description" rows={4} cols={80} required />
      <br />
      <input
        type="date"
        name="listing_date"
        defaultValue={new Date().toISOString().substring(0, 10)}
        required
      />
      <input type="text" name="listing_duration" placeholder="Listing duration" required />
      <br />
      <select name="listing_category" required>
        <option value="">Select a category</option>
        <option value="Animals">Animals</option>
        <option value="Arts">Arts</option>
        <option value="Community">Community</option>
        <option value="Education">Education</option>
        <option value="Environment">Environment</option>
        <option value="Health">Volunteer</option>
        <option value="Human Rights">Fellowship</option>
        <option value="Youth">Graduate School</option>
      </select>
      <div style={{ marginTop: "12px", marginBottom: "12px" }}>
  <label>Needed skills</label>
  <br />

  <select
    value={skillToAdd}
    onChange={(e) => setSkillToAdd(e.target.value)}
  >
    <option value="">Select a skill</option>
    {SKILL_OPTIONS.map((skill) => (
      <option key={skill} value={skill}>
        {skill}
      </option>
    ))}
  </select>

  <button
    type="button"
    onClick={() => {
      addSkill(skillToAdd);
      setSkillToAdd("");
    }}
    style={{ marginLeft: "8px" }}
  >
    Add skill
  </button>

  <br /><br />

  <input
    type="text"
    placeholder="Add custom skill"
    value={customSkill}
    onChange={(e) => setCustomSkill(e.target.value)}
  />

  <button
    type="button"
    onClick={() => {
      addSkill(customSkill);
      setCustomSkill("");
    }}
    style={{ marginLeft: "8px" }}
  >
    Add custom
  </button>

  <div style={{ marginTop: "12px" }}>
    {selectedSkills.map((skill) => (
      <span
        key={skill}
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "6px 10px",
          marginRight: "8px",
          marginBottom: "8px",
          borderRadius: "999px",
          background: "#eee",
          color: "black",
        }}
      >
        {skill}
        <button
          type="button"
          onClick={() => removeSkill(skill)}
          style={{
            marginLeft: "8px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </span>
    ))}
  </div>
</div>
      <select name="listing_transport" required>
        <option value="">Select transport</option>
        <option value="Bus">Bus</option>
        <option value="Car">Car</option>
        <option value="Walk">Walk</option>
        <option value="Remote">Remote</option>
      </select>
      <br />

      {status === "error" && <p style={{ color: "red" }}>{errorMessage}</p>}
      {status === "success" && <p style={{ color: "green" }}>Listing created successfully!</p>}

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Creating..." : "Create Listing"}
      </button>
    </form>
  );
}
