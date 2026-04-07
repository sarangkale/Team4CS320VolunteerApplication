import { Link, useNavigate } from "react-router";
import { getCurrentUser, getAccountProfile, logout, type Account } from "../auth/auth";
import { useEffect, useState } from "react";
import { AuthError, type UserResponse } from "@supabase/supabase-js";
import ListingCreation from "../components/listingCreation.tsx";
import ListingsDisplay from "../components/listingsDisplay.tsx";

function LoggedInDashbaord({ eraseSession }: { eraseSession: () => void }) {
    const navigate = useNavigate();

    const [currentProfile, setCurrentProfile] = useState(null as Account | null);

    useEffect(() => {
        getAccountProfile().then(profile => {
            if (profile.type == "success") {
                setCurrentProfile(profile.data);
            }
        })
    }, [])

    return <>
        <h1>Dashboard (will become org dashboard)</h1>
        <center>
            <table cellSpacing="50em">
                <tbody>
                    <tr>
                        <td><Link to="/">Home</Link></td>
                        <td><Link to="/login">Login</Link></td>
                        <td><button onClick={async (_) => {
                            await logout();
                            eraseSession();
                            navigate("/");
                        }}>Sign out</button></td>
                    </tr>
                </tbody>
            </table>
            <table>
                {currentProfile && 
                    <tbody>
                        {Object.keys(currentProfile.profile).map(key => <tr key={key}><td>{key}: {(currentProfile.profile as any)[key]}</td></tr>)}
                    </tbody>}
            </table>
        </center>
        {currentProfile?.role === "Organization" ? <ListingCreation /> : <ListingsDisplay /> }
    </>;
}

function DashboardPage() {
    const [user, setUser] = useState({ data: { user: null }, error: new AuthError("") } as UserResponse);
    useEffect(() => {
        getCurrentUser().then(u => setUser(u));
    }, []);

    return (
        <>{user.data.user != null ? <LoggedInDashbaord eraseSession={() => setUser({ data: { user: null }, error: new AuthError("") })} /> : <>
            <p>No session</p>
            <Link to="/login">Login</Link>
        </>
        }</>
    );
}

export default DashboardPage;
