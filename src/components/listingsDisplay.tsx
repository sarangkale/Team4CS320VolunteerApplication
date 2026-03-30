import { useEffect, useState } from "react";
import { retrieveListings, updateListingApplicant, type ListingData } from "../lib/listings";
import { supabase } from "../lib/supabase";

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
                    Object.keys(listing)
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
