import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, University, ChevronRight, LogIn } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(false);

  // Dane do rejestracji (Domyślnie MALE)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    universityName: 'AGH',
    gender: 'MALE',
    description: ''
  });

  const [loginEmail, setLoginEmail] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(async (response) => {
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("myUserId", user.id);
        alert("Zarejestrowano pomyślnie!");
        navigate('/profile');
      } else {
        alert("Błąd rejestracji! Email może być zajęty lub dane są błędne.");
      }
    })
    .catch(err => console.error(err));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/users/search?email=${loginEmail}`)
        .then(async (response) => {
            if (response.ok) {
                const user = await response.json();
                if(user) {
                    localStorage.setItem("myUserId", user.id);
                    alert("Witaj z powrotem, " + user.firstName + "!");
                    navigate('/profile');
                } else {
                    alert("Backend nie zwrócił użytkownika (null).");
                }
            } else {
                alert("Nie znaleziono takiego maila w bazie. Sprawdź pisownię lub zarejestruj się.");
            }
        })
        .catch(err => console.error(err));
  }

  return (
    <div style={{ marginTop: '-50px', padding: '20px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div style={{ marginTop: '40px', marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, color: '#6366f1' }}>UsosMatch</h1>
        <p style={{ color: '#888' }}>
            {isLoginMode ? "Wróć do gry" : "Stwórz profil, by znaleźć parę"}
        </p>
      </div>

      {/* ZAKŁADKI */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <button onClick={() => setIsLoginMode(false)} style={isLoginMode ? inactiveTab : activeTab}>Rejestracja</button>
          <button onClick={() => setIsLoginMode(true)} style={isLoginMode ? activeTab : inactiveTab}>Logowanie</button>
      </div>

      <div style={{
        background: 'rgba(255,255,255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        padding: '30px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}>

        {isLoginMode ? (
            /* --- LOGOWANIE --- */
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="input-group">
                    <Mail size={18} color="#6366f1" style={{ marginBottom: '5px' }}/>
                    <input
                        type="email" placeholder="Wpisz swój email..." required style={inputStyle}
                        value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                    />
                </div>
                <button type="submit" style={buttonStyle}>Zaloguj <LogIn size={20} /></button>
            </form>
        ) : (
            /* --- REJESTRACJA (Z PRZYWRÓCONĄ PŁCIĄ) --- */
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <input name="firstName" placeholder="Imię" value={formData.firstName} onChange={handleChange} required style={inputStyle}/>
                <input name="lastName" placeholder="Nazwisko" onChange={handleChange} required style={inputStyle}/>
                <input name="email" type="email" placeholder="Email studencki" onChange={handleChange} required style={inputStyle}/>

                {/* -- PRZYWRÓCONA SEKCJA PŁCI I UCZELNI -- */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        name="universityName"
                        placeholder="Uczelnia"
                        defaultValue="AGH"
                        onChange={handleChange}
                        style={{ ...inputStyle, flex: 2 }}
                    />
                    <select name="gender" onChange={handleChange} style={{ ...inputStyle, flex: 1, padding: '12px 5px' }}>
                        <option value="MALE">On</option>
                        <option value="FEMALE">Ona</option>
                        <option value="OTHER">Inne</option>
                    </select>
                </div>
                {/* -------------------------------------- */}

                <textarea name="description" placeholder="Napisz coś o sobie..." onChange={handleChange} style={{...inputStyle, fontFamily: 'inherit'}}/>

                <button type="submit" style={buttonStyle}>Stwórz Konto <ChevronRight size={20} /></button>
            </form>
        )}

      </div>
    </div>
  );
};

// --- Style ---
const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'rgba(255,255,255,0.8)', boxSizing: 'border-box' };
const buttonStyle = { padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const activeTab = { padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' };
const inactiveTab = { padding: '8px 16px', background: 'transparent', color: '#888', border: '1px solid #ccc', borderRadius: '20px', cursor: 'pointer' };

export default RegisterPage;