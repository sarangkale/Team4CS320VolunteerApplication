import { Link, useNavigate } from "react-router";
import { getCurrentUser, getUserProfile, logout, type UserProfile } from "../auth/auth";
import { useEffect, useState } from "react";
import { AuthError, type UserResponse } from "@supabase/supabase-js";

function LoggedInDashbaord({ eraseSession }: { eraseSession: () => void }) {
    const navigate = useNavigate();

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
                            eraseSession();
                            navigate("/");
                        }}>Sign out</button></td>
                    </tr>
                </tbody>
            </table>
            <table>
                {userProfile.map((profile, i) =>
                    <tbody key={i}>
                        {Object.keys(profile).map(key => <tr>{key}: {(profile as any)[key]}</tr>)}
                    </tbody>)}
            </table>
        </center>
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
