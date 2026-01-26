import { useState } from 'react'; // pudełka na pamięć
import { useNavigate } from 'react-router-dom';
import { Mail, ChevronRight, LogIn, Lock } from 'lucide-react';
// IMPORT MODALA
import InfoModal from '../components/InfoModal';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(false); //czy jesteśmy w trybie logowania? false - rejestracja
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState(''); //zapamiętujemy login i hasło

  // CONFIG MODALA
  const [modal, setModal] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const showModal = (type, title, message) => setModal({ isOpen: true, type, title, message });

  // DANE REJESTRACJI
  const defaultFormData = {
    firstName: '', lastName: '', email: '', password: '', universityName: 'AGH', gender: 'MALE', description: ''
  };
  const [formData, setFormData] = useState(defaultFormData); // dane rejestracji trzymamy w jednym obiekcie

// pakujemy informację o kliknięciu w paczkę e
// (...formData) robimy kopię wszystkiego co jest w formularzu do tej pory
//
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Przełączanie zakładek np z logowania do rejstracji
  const switchMode = (toLogin) => {
      setIsLoginMode(toLogin);
      // Czyścimy wszystko, żeby dane nie skakały między polami!
      setFormData(defaultFormData);
      setLoginEmail('');
      setLoginPassword('');
  };

  // --- LOGOWANIE ---
  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword })
    })
    .then(async (response) => {
        if (response.ok) { //backend potwierdził że dane są ok
            const user = await response.json();
            localStorage.setItem("myUserId", user.id);
            navigate('/profile');
        } else {
            showModal('login', 'Błąd logowania', 'Nieprawidłowy email lub hasło.');
        }
    })
    .catch(() => showModal('error', 'Błąd sieci', 'Brak połączenia z serwerem.'));
  };

  // --- REJESTRACJA (Z POPRAWKĄ JSON) ---
  const handleRegister = (e) => {
    e.preventDefault(); // blokujemy odświeżanie strony, aby nie utracić danych

    if(!formData.password || formData.password.length < 3) {
        showModal('error', 'Słabe hasło', 'Hasło musi mieć minimum 3 znaki!');
        return;
    }

    fetch('http://localhost:8080/api/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    })
    .then(async (res) => {
      if (res.ok) { // użytkownik stworzony
        const user = await res.json();
        localStorage.setItem("myUserId", user.id); // automatyczne logowanie po rejestracji
        navigate('/profile'); // przekierowujemy do profile
      } else {
        // Próbujemy odczytać odpowiedź jako JSON, żeby wyciągnąć pole "message"
        try {
            const errorJson = await res.json();
            // Jeśli backend wysłał {"message": "Email zajęty"}, to bierzemy to.
            // Jeśli nie ma pola message, to bierzemy ogólny błąd.
            const cleanMessage = errorJson.message || "Wystąpił błąd po stronie serwera.";
            showModal('error', 'Ups!', cleanMessage);
        } catch (parseError) {
            // Jeśli to nie był JSON, tylko zwykły tekst
            showModal('error', 'Ups!', "Błąd rejestracji (nieznany).");
        }
      }
    })
    .catch(() => showModal('error', 'Błąd sieci', 'Serwer nie odpowiada.'));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>

      {/* Przełącznik Zakładek */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', zIndex: 10 }}>
          {/* Używamy nowej funkcji switchMode do czyszczenia pól */}
          <button onClick={() => switchMode(false)} style={!isLoginMode ? activeTab : inactiveTab}>Rejestracja</button>
          <button onClick={() => switchMode(true)} style={isLoginMode ? activeTab : inactiveTab}>Logowanie</button>
      </div>

      <div style={formContainerStyle}>
        <h2 style={{ textAlign:'center', color: '#6366f1', marginTop:0 }}>{isLoginMode ? "Witaj ponownie" : "Załóż Profil"}</h2>

        {isLoginMode ? (
            /* --- FORMULARZ LOGOWANIA --- */
            <form onSubmit={handleLogin} style={formStyle}>
                <div style={inputGroupStyle}>
                    <Mail size={18} color="#6366f1"/>
                    <input type="email" placeholder="Email..." required style={inputStyle} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
                <div style={inputGroupStyle}>
                    <Lock size={18} color="#6366f1"/>
                    <input type="password" placeholder="Hasło..." required style={inputStyle} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
                <button type="submit" style={mainButtonStyle}>Zaloguj się <LogIn size={20}/></button>
            </form>
        ) : (
            /* --- FORMULARZ REJESTRACJI --- */
            <form onSubmit={handleRegister} style={formStyle}>
                <div style={{display:'flex', gap:'10px'}}>
                    {/* Dodajemy autoComplete="off", żeby przeglądarka nie głupiała przy zmianie kart */}
                    <input name="firstName" placeholder="Imię" onChange={handleChange} value={formData.firstName} required style={inputStyle} autoComplete="off"/>
                    <input name="lastName" placeholder="Nazwisko" onChange={handleChange} value={formData.lastName} required style={inputStyle} autoComplete="off"/>
                </div>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} value={formData.email} required style={inputStyle} autoComplete="off"/>
                <input name="password" type="password" placeholder="Hasło (min. 3 znaki)" onChange={handleChange} value={formData.password} required style={{...inputStyle, border:'1px solid #6366f1'}} />
                <div style={{display:'flex', gap:'10px'}}>
                    <input name="universityName" defaultValue="AGH" onChange={handleChange} style={{...inputStyle, flex:2}} />
                    <select name="gender" onChange={handleChange} style={{...inputStyle, flex:1, padding:'10px 5px'}}><option value="MALE">On</option><option value="FEMALE">Ona</option></select>
                </div>
                <textarea name="description" placeholder="Opis..." onChange={handleChange} value={formData.description} style={{...inputStyle, fontFamily:'inherit', height:'60px'}} />
                <button type="submit" style={mainButtonStyle}>Stwórz Konto <ChevronRight size={20}/></button>
            </form>
        )}
      </div>

      <InfoModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ ...modal, isOpen: false })}
          type={modal.type} title={modal.title} message={modal.message}
      />

    </div>
  );
};

// --- STYLES (Bez zmian - grafika taka sama) ---
const formContainerStyle = { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'};
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontSize: '14px', background: '#f9fafb', boxSizing:'border-box' };
const inputGroupStyle = { display: 'flex', alignItems: 'center', gap: '10px', background: '#f9fafb', border: '1px solid #ddd', borderRadius: '12px', padding: '0 10px' };
const mainButtonStyle = { padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '-10px' };
const activeTab = { padding: '10px 20px', borderRadius: '30px', border: 'none', background: '#6366f1', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)' };
const inactiveTab = { padding: '10px 20px', borderRadius: '30px', border: '1px solid #ccc', background: 'transparent', color: '#666', cursor: 'pointer' };

export default RegisterPage;