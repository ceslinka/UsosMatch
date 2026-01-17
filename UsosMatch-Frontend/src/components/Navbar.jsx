import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { User, Flame, MessageCircle, LogIn, LogOut, AlertTriangle } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  // useLocation: To haczyk. Sprawia, że Navbar "budzi się" i przerysowuje
  // za każdym razem, gdy zmieniasz podstronę (URL).
  const location = useLocation();

  // Stan dla okienka wylogowania (Czy pokazać?)
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // 1. Zmieniamy funkcję kliknięcia (zamiast window.confirm, pokazujemy nasz modal)
    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    // 2. Właściwa funkcja, która wykonuje się dopiero po potwierdzeniu "TAK"
    const performLogout = () => {
        localStorage.removeItem("myUserId");
        setShowLogoutModal(false); // Zamykamy okno
        navigate('/');
    };

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
      <>
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
            {/* Zmieniamy onClick na nową funkcję otwierającą okno */}
            <div
                onClick={handleLogoutClick}
                style={{ color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
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
    {showLogoutModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', // Przyciemnienie
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 9999, animation: 'fadeIn 0.2s'
                }} onClick={() => setShowLogoutModal(false)}> {/* Kliknięcie w tło zamyka */}

                    <div style={{
                        background: 'white', padding: '30px', borderRadius: '24px',
                        textAlign: 'center', maxWidth: '300px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        animation: 'scaleUp 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' // Efekt sprężynki
                    }} onClick={(e) => e.stopPropagation()}>

                        <div style={{margin: '0 auto 15px auto', width:'50px', height:'50px', background:'#fee2e2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <AlertTriangle size={24} color="#ef4444"/>
                        </div>

                        <h3 style={{margin: '0 0 10px 0', color: '#1f2937'}}>Wylogować się?</h3>
                        <p style={{margin: '0 0 25px 0', color: '#6b7280', fontSize: '14px'}}>
                            Będziesz musiał zalogować się ponownie, aby zobaczyć swoje pary.
                        </p>

                        <div style={{display: 'flex', gap: '10px'}}>
                            <button onClick={() => setShowLogoutModal(false)} style={{flex: 1, padding: '12px', border: '1px solid #e5e7eb', background: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color:'#374151'}}>
                                Anuluj
                            </button>
                            <button onClick={performLogout} style={{flex: 1, padding: '12px', border: 'none', background: '#ef4444', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color:'white'}}>
                                Wyloguj
                            </button>
                        </div>
                    </div>
                </div>
              )}
          </>
  );
};

export default Navbar;