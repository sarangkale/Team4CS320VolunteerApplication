import { useEffect, useState } from "react";
import { retrieveListings, type ListingData } from "../lib/listings";

export default function ListingsDisplay() {
    function chunk<T>(arr: T[], chunkSize: number): T[][] {
        const chunks = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }

        return chunks;
    }

    const [listings, setListings] = useState([] as ListingData[]);
    useEffect(() => {
        retrieveListings(0, 10).then(
            newListings => {
                if (newListings.type == "success") { setListings(newListings.data) }
            }
        );
    }, []);

    return (
        <table>
            {chunk(listings, 5).map((listingChunk, i)=> {
                const individualListings = listingChunk.map(listing => <td style={{backgroundColor: "#151515", padding: "1em", borderRadius: "0.5em"}}>{
                    Object.keys(listing)
                        .filter(key => key != "listing_id" && key != "org_id")
                        .map(key => {const val = (listing as any)[key]; if (val) return <p key={`${listing.listing_id}-${key}`}>{key}: {val}</p>})
                }</td>);
                return <tr key={i}>{individualListings}</tr>;
            })}
        </table>
    )
}
