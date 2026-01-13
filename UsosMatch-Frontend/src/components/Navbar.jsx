import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { User, Flame, MessageCircle, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  // useLocation: To haczyk. Sprawia, że Navbar "budzi się" i przerysowuje
  // za każdym razem, gdy zmieniasz podstronę (URL).
  const location = useLocation();

  // Sprawdzamy status "na żywo"
  const isLoggedIn = !!localStorage.getItem("myUserId");

  // Funkcja Wylogowania
  const handleLogout = () => {
      if(window.confirm("Czy na pewno chcesz się wylogować?")) {
          // 1. Usuwamy dowód tożsamości
          localStorage.removeItem("myUserId");
          // 2. Przekierowujemy na stronę główną (Logowania)
          navigate('/');
      }
  };

  return (
    <nav style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',

      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',

      padding: '10px 30px',
      borderRadius: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      display: 'flex',
      gap: '40px',
      zIndex: 1000
    }}>

      {isLoggedIn ? (
        // --- OPCJA A: UŻYTKOWNIK ZALOGOWANY ---
        // Pokazujemy funkcje aplikacji
        <>
            {/* 1. Szukanie Pary */}
            <NavLink to="/match" style={({ isActive }) => ({ color: isActive ? '#6366f1' : '#888' })}>
                <Flame size={28} />
            </NavLink>

            {/* 2. Lista Par */}
            <NavLink to="/list" style={({ isActive }) => ({ color: isActive ? '#6366f1' : '#888' })}>
                <MessageCircle size={28} />
            </NavLink>

            {/* 3. Profil */}
            <NavLink to="/profile" style={({ isActive }) => ({ color: isActive ? '#6366f1' : '#888' })}>
                <User size={28} />
            </NavLink>

            {/* 4. Przycisk WYLOGUJ (czerwony przy kliknięciu, ale szary domyślnie) */}
            <div
                onClick={handleLogout}
                style={{ color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Wyloguj się"
            >
                <LogOut size={28} />
            </div>
        </>
      ) : (
        // --- OPCJA B: NIEZALOGOWANY ---
        // Pokazujemy tylko wejście
        <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#6366f1' : '#888' })}>
            <LogIn size={28} />
        </NavLink>
      )}

    </nav>
  );
};

export default Navbar;