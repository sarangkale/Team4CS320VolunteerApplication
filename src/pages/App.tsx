import './App.css'
import { Link } from 'react-router'

function App() {    
    return (
        <div style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            minHeight: '100vh',
            backgroundColor: '#ffffff',
        }}>
            {/* Nav */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                backgroundColor: '#ffffff',
            }}>
                <div style={{
                    backgroundColor: '#4a6332',
                    color: 'white',
                    borderRadius: '50%',
                    width: '52px',
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'sans-serif',
                }}>
                    logo
                </div>
                <Link to="/login" style={{
                    backgroundColor: '#4a6332',
                    color: 'white',
                    padding: '10px 28px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontFamily: 'sans-serif',
                    fontWeight: '500',
                    fontSize: '15px',
                }}>
                    Log in
                </Link>
            </nav>

            {/* Main card */}
            <main style={{
                margin: '0 16px 32px',
                backgroundColor: '#e8e8e8',
                borderRadius: '16px',
                overflow: 'hidden',
            }}>
                {/* Hero */}
                <section style={{
                    padding: 'clamp(40px, 8vw, 80px) clamp(20px, 6vw, 60px)',
                }}>
                    <h1 style={{
                        fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
                        fontWeight: '900',
                        margin: '0',
                        lineHeight: '1.1',
                        color: '#111111',
                        fontFamily: "'Georgia', serif",
                    }}>
                        Volunteering Made Easy.
                    </h1>
                </section>

                {/* Two-column green banner */}
                <section style={{
                    backgroundColor: '#7a8f5f',
                    padding: 'clamp(28px, 5vw, 48px) clamp(20px, 6vw, 60px)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '32px',
                }}>
                    <div>
                        <h2 style={{
                            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                            fontWeight: '800',
                            marginTop: '0',
                            marginBottom: '16px',
                            color: '#111',
                            fontFamily: 'sans-serif',
                        }}>
                            For volunteers
                        </h2>
                        <ul style={{
                            margin: '0',
                            paddingLeft: '20px',
                            color: '#111',
                            lineHeight: '1.8',
                            fontFamily: 'sans-serif',
                            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                        }}>
                            <li>Find volunteering opportunities near you</li>
                            <li>Filter based on your needs</li>
                            <li>View all your completed hours in one spot</li>
                        </ul>
                    </div>
                    <div>
                        <h2 style={{
                            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                            fontWeight: '800',
                            marginTop: '0',
                            marginBottom: '16px',
                            color: '#111',
                            fontFamily: 'sans-serif',
                        }}>
                            For organizations
                        </h2>
                        <ul style={{
                            margin: '0',
                            paddingLeft: '20px',
                            color: '#111',
                            lineHeight: '1.8',
                            fontFamily: 'sans-serif',
                            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                        }}>
                            <li>Post opportunities for any situation</li>
                            <li>View and choose the applicants that best suit your situation</li>
                        </ul>
                    </div>
                </section>

                {/* CTA */}
                <section style={{
                    padding: 'clamp(32px, 6vw, 60px) clamp(20px, 6vw, 60px)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '24px',
                }}>
                    <div style={{ flex: '1 1 280px' }}>
                        <h2 style={{
                            fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
                            fontWeight: '900',
                            margin: '0 0 28px',
                            color: '#111',
                            fontFamily: "'Georgia', serif",
                        }}>
                            Don't wait -- join today!
                        </h2>
                        <Link to="/signup" style={{
                            display: 'inline-block',
                            backgroundColor: '#3a5220',
                            color: 'white',
                            padding: '16px 36px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontFamily: 'sans-serif',
                            fontWeight: '700',
                            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                        }}>
                            Start now!
                        </Link>
                    </div>

                    {/* Hands image */}
                    <div style={{ flex: '1 1 200px', display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/src/assets/LandingPageHands.png"
                            alt="Diverse hands raised with hearts"
                            style={{ width: '100%', maxWidth: '700px', objectFit: 'contain' }}
                        />
                    </div>
                </section>
            </main>
        </div>
    )
}

export default App
