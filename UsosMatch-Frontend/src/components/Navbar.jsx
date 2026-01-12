import { Link } from "react-router-dom";

function Navbar() {
    // Prosty styl, żeby wyglądało czytelnie
    const navStyle = {
        background: "#2c3e50",
        padding: "1rem",
        display: "flex",
        gap: "20px",
        color: "white"
    };

    const linkStyle = {
        color: "white",
        textDecoration: "none",
        fontWeight: "bold"
    };

    return (
        <nav style={navStyle}>
            <span style={{ color: "#27ae60", fontSize: "1.2rem" }}>USOS Match</span>

            {/* Linki zamiast tagów <a>, żeby nie przeładowywać strony */}
            <Link to="/" style={linkStyle}>Rejestracja</Link>
            <Link to="/profile" style={linkStyle}>Mój Profil</Link>
            <Link to="/match" style={linkStyle}>Szukaj Pary</Link>
            <Link to="/list" style={linkStyle}>Moje Matche</Link>
        </nav>
    );
}

export default Navbar;