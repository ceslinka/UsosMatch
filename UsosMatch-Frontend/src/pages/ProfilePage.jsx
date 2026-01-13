import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, UserCircle } from 'lucide-react';

const ProfilePage = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(""); // Imię studenta

  // Formularz dodawania czasu
  const [day, setDay] = useState("MONDAY");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("09:30");

  // Lista wizualna dodanych slotów (dla tej sesji)
  const [addedSlots, setAddedSlots] = useState([]);

  // Tłumaczenie na polski
  const daysPl = {
    MONDAY: "Poniedziałek",
    TUESDAY: "Wtorek",
    WEDNESDAY: "Środa",
    THURSDAY: "Czwartek",
    FRIDAY: "Piątek",
    SATURDAY: "Sobota",
    SUNDAY: "Niedziela"
  };

  useEffect(() => {
    // 1. Sprawdzamy, czy w przeglądarce jest zapisane ID po rejestracji
    const storedId = localStorage.getItem("myUserId");

    if (!storedId) {
        // Jeśli nie ma ID -> wracamy na start
        window.location.href = "/";
        return;
    }

    // 2. Weryfikacja tożsamości z Backendem
    // Sprawdzamy, czy user o takim ID nadal istnieje w bazie (np. po restarcie serwera)
    fetch('http://localhost:8080/api/users')
        .then(res => res.json())
        .then(users => {
            // Szukamy siebie na liście
            // (storedId to string, u.id to liczba, dlatego .toString())
            const me = users.find(u => u.id.toString() === storedId);

            if (me) {
                // SUKCES: User istnieje w Javie
                setUserId(storedId);
                setUserName(me.firstName);
            } else {
                // BŁĄD: Mamy ID, ale nie ma go w bazie (np. restart serwera)
                alert("Twoja sesja wygasła (restart serwera). Zarejestruj się ponownie.");
                localStorage.removeItem("myUserId");
                window.location.href = "/";
            }
        })
        .catch(err => {
            console.error("Błąd połączenia z Javą:", err);
        });
  }, []);

  const handleAddSlot = () => {
    // Formatowanie godziny do standardu HH:mm:ss
    const slotData = {
        dayOfWeek: day,
        startTime: start + ":00",
        endTime: end + ":00",
        freeTime: true
    };

    // Strzał do Javy (TimeSlotController)
    fetch(`http://localhost:8080/api/timeslots?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotData)
    })
    .then(async (res) => {
        if (res.ok) {
            // Sukces - aktualizujemy listę i czyścimy/informujemy
            setAddedSlots([...addedSlots, slotData]);
            alert("Dodano pomyślnie!");
        } else {
            // Obsługa błędu logicznego (Kolizja, Złe godziny)
            // Pobieramy treść błędu wysłaną przez Javę (np. "Kolizja! Masz już zajęcia...")
            try {
                const errorJson = await res.json();
                // Spring Boot zazwyczaj zwraca treść błędu w polu "message" lub "error"
                const errorMsg = errorJson.message || "Sprawdź poprawność godzin (duplikat lub start > koniec)";
                alert("Błąd dodawania: " + errorMsg);
            } catch (e) {
                alert("Błąd dodawania! Sprawdź, czy godziny się nie nakładają.");
            }
        }
    })
    .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* 1. Nagłówek z imieniem */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <UserCircle size={40} color="#6366f1" />
            <div>
                <h2 style={{ margin: 0 }}>Cześć, {userName || "..."}</h2>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Zarządzaj swoim grafikiem zajęć</p>
            </div>
        </div>
      </div>

      {/* 2. Panel dodawania */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

            <label style={labelStyle}><Calendar size={16}/> Wybierz Dzień</label>
            <select style={inputStyle} value={day} onChange={e => setDay(e.target.value)}>
                {Object.keys(daysPl).map(d => (
                    <option key={d} value={d}>{daysPl[d]}</option>
                ))}
            </select>

            <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}><Clock size={16}/> Od</label>
                    <input type="time" style={inputStyle} value={start} onChange={e => setStart(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}><Clock size={16}/> Do</label>
                    <input type="time" style={inputStyle} value={end} onChange={e => setEnd(e.target.value)} />
                </div>
            </div>

            <button onClick={handleAddSlot} style={buttonStyle}>
                <Plus size={20} /> Dodaj Okienko
            </button>
        </div>
      </div>

      {/* 3. Podgląd dodanych slotów */}
      {addedSlots.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {addedSlots.map((slot, index) => (
                <div key={index} style={chipStyle}>
                    <span style={{ fontWeight: 'bold' }}>{daysPl[slot.dayOfWeek]}</span>
                    <span> {slot.startTime.substring(0,5)} - {slot.endTime.substring(0,5)}</span>
                </div>
            ))}
          </div>
      )}

    </div>
  );
};

// --- STYLE (Glassmorphism + Clean UI) ---
const cardStyle = {
    background: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    border: '1px solid rgba(255,255,255,0.4)'
};

const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box'
};

const labelStyle = {
    display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', fontSize: '13px', color: '#555', fontWeight: '600'
};

const buttonStyle = {
    background: '#6366f1', color: 'white', border: 'none', padding: '14px', borderRadius: '12px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px'
};

const chipStyle = {
    background: '#e0e7ff', color: '#4338ca', padding: '8px 12px', borderRadius: '20px',
    fontSize: '13px', display: 'flex', gap: '5px', alignItems: 'center', border: '1px solid #c7d2fe'
};

export default ProfilePage;