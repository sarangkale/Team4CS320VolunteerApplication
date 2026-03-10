import { Link } from "react-router";
import { getCurrentUser, getUserProfile, logout, type UserProfile } from "../auth/auth";
import { useEffect, useState } from "react";
import { AuthError, type UserResponse } from "@supabase/supabase-js";

function LoggedInDashbaord() {
    const [userProfile, setUserProfile] = useState([] as UserProfile[]);
    useEffect(() => {
        getUserProfile().then(profile => {
            console.log(profile);
            if (profile.data) {
                setUserProfile(profile.data);
            }
        })
    }, [])

    return <>
        <h1>Dashboard</h1>
        <center>
            <table cellSpacing="50em">
                <tbody>
                    <tr>
                        <td><Link to="/">Home</Link></td>
                        <td><Link to="/login">Login</Link></td>
                        <td><button onClick={async (_) => {
                            await logout();
                            console.log(await getCurrentUser());
                        }}>Sign out</button></td>
                    </tr>
                </tbody>
            </table>
            {userProfile.map(profile => <p key={profile.user_id}>email: {profile.email} | name: {profile.first_name} {profile.last_name}</p>)}
        </center>
    </>;
}

function DashboardPage() {
    const [user, setUser] = useState({ data: { user: null }, error: new AuthError("") } as UserResponse);
    useEffect(() => {
        getCurrentUser().then(u => setUser(u));
    }, []);

    return (
        <>{user.data.user != null ? <LoggedInDashbaord /> : <>
            <p>No session</p>
            <Link to="/login">Login</Link>
        </>
        }</>
    );
}

export default DashboardPage;
