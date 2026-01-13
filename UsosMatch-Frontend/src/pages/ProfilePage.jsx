import { useState, useEffect } from 'react';
// 1. Dodaliśmy ikonę 'X' do importów
import { Calendar, Clock, Plus, UserCircle, X } from 'lucide-react';

const ProfilePage = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  const [day, setDay] = useState("MONDAY");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("09:30");

  const [addedSlots, setAddedSlots] = useState([]);

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
    const storedId = localStorage.getItem("myUserId");
    if (!storedId) {
        window.location.href = "/";
        return;
    }

    fetch('http://localhost:8080/api/users')
        .then(res => res.json())
        .then(users => {
            const me = users.find(u => u.id.toString() === storedId);
            if (me) {
                setUserId(storedId);
                setUserName(me.firstName);
                setAddedSlots(me.schedule || []);
            } else {
                localStorage.removeItem("myUserId");
                window.location.href = "/";
            }
        });
  }, []);

  // --- ZMIANA: Obsługa Dodawania z pobraniem ID z bazy ---
  const handleAddSlot = () => {
    const slotData = {
        dayOfWeek: day,
        startTime: start + ":00",
        endTime: end + ":00",
        freeTime: true
    };

    fetch(`http://localhost:8080/api/timeslots?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotData)
    })
    .then(async (res) => {
        if (res.ok) {
            // WAŻNE: Odbieramy obiekt z bazy, bo on ma ID potrzebne do usuwania!
            const savedSlot = await res.json();
            setAddedSlots([...addedSlots, savedSlot]);
        } else {
            const errorJson = await res.json().catch(() => ({}));
            const errorMsg = errorJson.message || "Błąd walidacji godzin.";
            alert("Nie udało się: " + errorMsg);
        }
    })
    .catch(err => console.error(err));
  };

  // --- NOWA FUNKCJA: Usuwanie ---
  const handleDeleteSlot = (slotId) => {
      // 1. Wysyłamy żądanie do Backend
      fetch(`http://localhost:8080/api/timeslots/${slotId}`, {
          method: 'DELETE'
      }).then(res => {
          if (res.ok) {
              // 2. Jeśli sukces, usuwamy klocek z ekranu (filtrujemy listę)
              const newSlots = addedSlots.filter(slot => slot.id !== slotId);
              setAddedSlots(newSlots);
          } else {
              alert("Błąd usuwania!");
          }
      });
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <UserCircle size={40} color="#6366f1" />
            <div>
                <h2 style={{ margin: 0 }}>Cześć, {userName || "..."}</h2>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Zarządzaj swoim grafikiem zajęć</p>
            </div>
        </div>
      </div>

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

      {/* --- ZMIANA: Wyświetlanie Chipa z ikoną X --- */}
      {addedSlots.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {addedSlots.map((slot) => (
                <div key={slot.id} style={chipStyle}>
                    <span style={{ fontWeight: 'bold' }}>{daysPl[slot.dayOfWeek]}</span>
                    <span> {slot.startTime.substring(0,5)} - {slot.endTime.substring(0,5)}</span>

                    {/* Przycisk Usuwania (X) */}
                    <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', marginLeft: '5px' }}
                    >
                        <X size={16} color="red" />
                    </button>
                </div>
            ))}
          </div>
      )}

    </div>
  );
};

// --- STYLE (Bez zmian) ---
const cardStyle = { background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.4)' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', fontSize: '13px', color: '#555', fontWeight: '600' };
const buttonStyle = { background: '#6366f1', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' };
const chipStyle = { background: '#e0e7ff', color: '#4338ca', padding: '8px 12px', borderRadius: '20px', fontSize: '13px', display: 'flex', gap: '5px', alignItems: 'center', border: '1px solid #c7d2fe' };

export default ProfilePage;