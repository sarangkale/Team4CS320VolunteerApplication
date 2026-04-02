import {createListing} from "../lib/listings.ts";

export default function ListingCreation() {
    async function createListingSubmit(formData: FormData) {
        const name = formData.get("listing_name") as string;
        const capacity = Number.parseInt(formData.get("listing_capacity") as string);
        const description = formData.get("listing_description") as string;
        const date = formData.get("listing_date") as string;
        const duration = formData.get("listing_duration") as string;

        await createListing(name, capacity, description, date, duration);
    };
    return (
        <form action={createListingSubmit}>
            <input type="text" name="listing_name" placeholder="Listing name" /> <input type="number" name="listing_capacity" placeholder="Listing capacity" /> <br />
            <textarea name="listing_description" rows={4} cols={80} /> <br />
            <input type="date" name="listing_date" defaultValue={(new Date()).toISOString().substring(0, 10)} /> <input type="number" name="listing_duration" placeholder="Listing duration" /><br />
            <button type="submit">Create Listing</button>
        </form>
    );
};
