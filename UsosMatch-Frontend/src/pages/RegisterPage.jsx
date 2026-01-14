import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, University, ChevronRight, LogIn, Lock } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(false);

    // Dane do rejestracji
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        universityName: 'AGH',
        gender: 'MALE',
        description: ''
    });

    // Dane do logowania
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
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
        fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify(loginData)
        })
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
                    alert("Nie znaleziono takiego maila w bazie lub błędne hasło.");
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
                        <div style={inputGroupStyle}>
                            <Mail size={18} color="#6366f1" />
                            <input
                                name="email"
                                type="email"
                                placeholder="Wpisz swój email..."
                                required
                                style={inputStyle}
                                value={loginData.email}
                                onChange={handleLoginChange}
                            />
                        </div>
                        {/* Naprawione: Dodano pole hasła do logowania */}
                        <div style={inputGroupStyle}>
                            <Lock size={18} color="#6366f1" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Hasło..."
                                required
                                style={inputStyle}
                                value={loginData.password}
                                onChange={handleLoginChange}
                            />
                        </div>
                        <button type="submit" style={buttonStyle}>Zaloguj <LogIn size={20} /></button>
                    </form>
                ) : (
                    /* --- REJESTRACJA --- */
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                        <input name="firstName" placeholder="Imię" value={formData.firstName} onChange={handleChange} required style={basicInputStyle}/>
                        <input name="lastName" placeholder="Nazwisko" onChange={handleChange} required style={basicInputStyle}/>

                        <div style={inputGroupStyle}>
                            <Mail size={18} color="#6366f1" />
                            <input name="email" type="email" placeholder="Email studencki" onChange={handleChange} required style={inputStyle}/>
                        </div>

                        <div style={inputGroupStyle}>
                            <Lock size={18} color="#6366f1" />
                            <input name="password" type="password" placeholder="Stwórz hasło" onChange={handleChange} required style={inputStyle}/>
                        </div>

                        {/* -- SEKCJA PŁCI I UCZELNI -- */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                name="universityName"
                                placeholder="Uczelnia"
                                defaultValue="AGH"
                                onChange={handleChange}
                                style={{ ...basicInputStyle, flex: 2 }}
                            />
                            <select name="gender" onChange={handleChange} style={{ ...basicInputStyle, flex: 1, padding: '12px 5px' }}>
                                <option value="MALE">On</option>
                                <option value="FEMALE">Ona</option>
                                <option value="OTHER">Inne</option>
                            </select>
                        </div>

                        <textarea name="description" placeholder="Napisz coś o sobie..." onChange={handleChange} style={{...basicInputStyle, fontFamily: 'inherit'}}/>

                        <button type="submit" style={buttonStyle}>Stwórz Konto <ChevronRight size={20} /></button>
                    </form>
                )}

            </div>
        </div>
    );
};

// --- Style ---
// Naprawione style: basicInputStyle dla zwykłych pól, inputStyle dla pól z ikonką
const inputGroupStyle = { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.8)', padding: '0 12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '12px 0', border: 'none', outline: 'none', background: 'transparent' };
const basicInputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'rgba(255,255,255,0.8)', boxSizing: 'border-box' };

const buttonStyle = { padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const activeTab = { padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' };
const inactiveTab = { padding: '8px 16px', background: 'transparent', color: '#888', border: '1px solid #ccc', borderRadius: '20px', cursor: 'pointer' };

export default RegisterPage;