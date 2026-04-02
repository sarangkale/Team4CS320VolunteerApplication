import { useEffect, useState } from "react";
import "./application.css";
import { getAccountProfile, getCurrentUser, logout, type Account } from "../auth/auth";
import { AuthError, type UserResponse } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router";

function ApplicationNotLoggedInPage() {
    const [user, setUser] = useState({ data: { user: null }, error: new AuthError("") } as UserResponse);
    useEffect(() => {
        getCurrentUser().then(u => setUser(u));
    }, []);
    

    return (
        <>{user.data.user != null ? <ApplicationLoggedInPage eraseSession={() => setUser({ data: { user: null }, error: new AuthError("") })} /> : <>
            <h1> Application Page</h1>
            <center>
                <p>Not logged in!</p>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/login">Login</Link>
            </center>
            
         
            
        </>
        }</>
    );
}

function ApplicationLoggedInPage({ eraseSession }: { eraseSession: () => void }) {
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
        <h1>Application</h1>
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
        </center>
    </>;
}

export default ApplicationNotLoggedInPage;

