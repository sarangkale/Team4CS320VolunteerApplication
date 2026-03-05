import { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link } from 'react-router'
import '../lib/supabase';
import { supabase } from '../lib/supabase'

interface profiles{
    id: number;
    name: string;
    university: string;
    role: string;
    created_at: Date;
}

interface organization {
    org_id: number;
    email: string;
    password_hash: string;
    org_name: string;
    bio: string;
    website: string;
    all_listings: string[];
}

function App() {
  const [count, setCount] = useState(0)
  const [profiles, setProfiles] = useState<profiles[]> ([]);
  const [organizations, setOrganizations] = useState<organization[]> ([]);

  useEffect(() => {
        const fetchData = async () => {
            const { data: prof_data, error: prof_error } = await supabase
                .from("profiles")
                .select();
            const { data: orgData, error: orgError } = await supabase
                .from("organization") // Use your actual table name here
                .select();            
            if (prof_error || orgError) {
                console.error("Error fetching:", prof_error || orgError);
                return;
            }
            setProfiles(prof_data || []);
            setOrganizations(orgData || []);
        };

        fetchData();
    }, []);

    const addTestOrg = async () => {
        const newName = `Test Org ${organizations.length + 1}`;
        
        // We only send the fields that are likely required or not null
        const { data, error } = await supabase
            .from("organization")
            .insert([
                { 
                    org_name: newName, 
                    email: `test${organizations.length}@example.com`,
                    bio: "This is a test organization generated via button."
                }
            ])
            .select();

        if (error) {
            console.error("Insert failed:", error.message);
        } else if (data) {
            // Update local state so the UI reflects the change immediately
            setOrganizations([...organizations, data[0]]);
        }
    };

    return (
        <>
            <center>
                <table cellSpacing="50em">
                    <tr>
                        <td><Link to="/dashboard">Dashboard</Link></td>
                        <td><Link to="/login">Login</Link></td>
                    </tr>
                </table>
            </center>
            <div>
                <a href="https://vite.dev" target="_blank" rel="noopener">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noopener">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                {/* BUTTON TO INSERT TEST DATA */}
                <button onClick={addTestOrg} style={{ backgroundColor: '#646cff' }}>
                    Add Test Organization
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <h3>Profiles and Organizations test</h3>
            <ul>
                {profiles.map((profile) => (
                    <li key={profile.id}>{profile.name}</li>
                ))}
                {organizations.map((organization) => (
                    <li key={organization.org_id}>{organization.org_name}</li>
                ))}
            </ul>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
