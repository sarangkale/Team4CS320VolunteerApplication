import { useState } from "react";
import { createListing } from "../lib/listings.ts";

const SKILL_OPTIONS = [
  "Fundraising",
  "Mentoring",
  "Graphic Design",
  "Social Media",
  "Data Entry",
  "Bilingual",
  "Event Planning",
];

export default function ListingCreation() {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

  async function createListingSubmit(formData: FormData) {
    setSuccessMessage("");
    setErrorMessage("");
    const name = formData.get("listing_name") as string;
    const capacity = Number.parseInt(formData.get("listing_capacity") as string);
    const description = formData.get("listing_description") as string;
    const date = formData.get("listing_date") as string;
    const duration = formData.get("listing_duration") as string;
    const category = formData.get("listing_category") as string;
    const transport = formData.get("listing_transport") as string;
    const street = formData.get("street") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zipCode = formData.get("zip_code") as string;

    const selectedSkills = formData.getAll("listing_skill") as string[];

    const result = await createListing(
      name,
      description,
      date,
      duration,
      capacity,
      category,
      selectedSkills,
      transport,
      street,
      city,
      state,
      zipCode
    );

    if (result.type === "success") {
        setSuccessMessage("Listing created successfully.");
      } else {
        setErrorMessage(
          typeof result.error === "string"
            ? result.error
            : result.error.msg
        );
      }
    }

  return (
    <form action={createListingSubmit}>
      <input
        type="text"
        name="listing_name"
        placeholder="Listing name"
      />
      <input
        type="number"
        name="listing_capacity"
        placeholder="Listing capacity"
      />
      <br />

      <textarea
        name="listing_description"
        rows={4}
        cols={80}
      />
      <br />

      <input
        type="date"
        name="listing_date"
        defaultValue={new Date().toISOString().substring(0, 10)}
      />
      <input
        type="text"
        name="listing_duration"
        placeholder="Listing duration"
      />
      <input 
        type="text" 
        name="street" 
        placeholder="Street address" 
        />
      <input type="text" 
        name="city" 
        placeholder="City"
        />
      <input 
        type="text" 
        name="state" 
        placeholder="State" 
      />
      <input 
        type="text"
        name="zip_code" 
        placeholder="ZIP code" 
        />
      <br />

      <select name="listing_category" defaultValue="">
        <option value="" disabled>
          Select a category
        </option>
        <option value="Animals">Animals</option>
        <option value="Arts">Arts</option>
        <option value="Community">Community</option>
        <option value="Education">Education</option>
        <option value="Environment">Environment</option>
        <option value="Volunteer">Volunteer</option>
        <option value="Fellowship">Fellowship</option>
        <option value="Graduate School">Graduate School</option>
      </select>
      <br />

      <label>Needed skills</label>
      <br />
      <select name="listing_skill" multiple size={SKILL_OPTIONS.length}>
        {SKILL_OPTIONS.map((skill) => (
          <option key={skill} value={skill}>
            {skill}
          </option>
        ))}
      </select>
      <br />

      <select name="listing_transport" defaultValue="">
        <option value="" disabled>
          Select transport
        </option>
        <option value="Bus">Bus</option>
        <option value="Car">Car</option>
        <option value="Walk">Walk</option>
        <option value="Remote">Remote</option>
      </select>
      <br />

      <button type="submit">Create Listing</button>

      {successMessage && (
        <p style={{ color: "green" }}>{successMessage}</p>
      )}

      {errorMessage && (
        <p style={{ color: "red" }}>{errorMessage}</p>
      )}
    </form>
  );
}
