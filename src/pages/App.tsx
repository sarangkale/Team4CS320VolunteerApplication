import './App.css'
import { Link } from 'react-router'

function App() {    
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

            {/* Nav */}
            <nav className="flex justify-between items-center px-6 py-4 bg-white">
                <div className="bg-[#4a6332] text-white rounded-full w-[62px] h-[62px] flex items-center justify-center text-xs font-bold font-sans">
                    logo
                </div>
                <Link
                    to="/login"
                    className="bg-[#4a6332] text-white py-2.5 px-7 rounded-lg no-underline font-sans font-medium text-[15px]"
                >
                    Log in
                </Link>
            </nav>

            {/* Main card */}
            <main className="mx-4 mb-8 bg-[#e8e8e8] rounded-2xl overflow-hidden">

                {/* Hero */}
                <section style={{ padding: 'clamp(40px, 8vw, 80px) clamp(20px, 6vw, 60px)' }}>
                    <h1
                        className="font-black m-0 leading-[1.1] text-[#111111]"
                        style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)', fontFamily: "'Georgia', serif" }}
                    >
                        Volunteering Made Easy.
                    </h1>
                </section>

                {/* Two-column green banner */}
                <section
                    className="bg-[#7a8f5f] grid gap-8 font-sans"
                    style={{
                        padding: 'clamp(28px, 5vw, 48px) clamp(20px, 6vw, 60px)',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    }}
                >
                    <div>
                        <h2
                            className="font-extrabold mt-0 mb-4 text-[#111]"
                            style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}
                        >
                            For volunteers
                        </h2>
                        <ul
                            className="m-0 pl-5 text-[#111] leading-[1.8]"
                            style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
                        >
                            <li>Find volunteering opportunities near you</li>
                            <li>Filter based on your needs</li>
                            <li>View all your completed hours in one spot</li>
                        </ul>
                    </div>
                    <div>
                        <h2
                            className="font-extrabold mt-0 mb-4 text-[#111]"
                            style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}
                        >
                            For organizations
                        </h2>
                        <ul
                            className="m-0 pl-5 text-[#111] leading-[1.8]"
                            style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
                        >
                            <li>Post opportunities for any situation</li>
                            <li>View and choose the applicants that best suit your situation</li>
                        </ul>
                    </div>
                </section>

                {/* CTA */}
                <section
                    className="flex flex-wrap items-center gap-6"
                    style={{ padding: 'clamp(32px, 6vw, 60px) clamp(20px, 6vw, 60px)' }}
                >
                    <div style={{ flex: '1 1 280px' }}>
                        <h2
                            className="font-black m-0 mb-7 text-[#111]"
                            style={{ fontSize: 'clamp(1.6rem, 5vw, 2.8rem)', fontFamily: "'Georgia', serif" }}
                        >
                            Don't wait -- join today!
                        </h2>
                        <Link
                            to="/signup"
                            className="inline-block bg-[#3a5220] text-white py-4 px-9 rounded-[50px] no-underline font-sans font-bold"
                            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}
                        >
                            Start now!
                        </Link>
                    </div>

                    {/* Hands image */}
                    <div className="flex justify-center" style={{ flex: '1 1 200px' }}>
                        <img
                            src="/src/assets/LandingPageHands.png"
                            alt="Diverse hands raised with hearts"
                            className="w-full max-w-[700px] object-contain"
                        />
                    </div>
                </section>

            </main>
        </div>
    )
}

export default App
