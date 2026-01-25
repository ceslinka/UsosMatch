import InfoModal from '../components/InfoModal';
// 1. POPRAWKA: Scalone importy (raz useRef, raz useState itd.)
import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Plus, UserCircle, X, Save, Ruler, Tag, FileText, Upload } from 'lucide-react';

const ProfilePage = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  // 2. POPRAWKA: useRef przeniesiony DO ŚRODKA komponentu
  const fileInputRef = useRef(null);

  const [details, setDetails] = useState({
      height: '',
      dateOfBirth: '',
      description: ''
  });

  const [modal, setModal] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const showModal = (type, title, message) => {
      setModal({ isOpen: true, type, title, message });
  };

  const [availableInterests, setAvailableInterests] = useState([]);
  const [selectedInterestIds, setSelectedInterestIds] = useState([]);

  const [day, setDay] = useState("MONDAY");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("09:30");
  const [addedSlots, setAddedSlots] = useState([]);

  const daysPl = { MONDAY: "Poniedziałek", TUESDAY: "Wtorek", WEDNESDAY: "Środa", THURSDAY: "Czwartek", FRIDAY: "Piątek", SATURDAY: "Sobota", SUNDAY: "Niedziela" };

  useEffect(() => {
    const storedId = localStorage.getItem("myUserId");
    if (!storedId) { window.location.href = "/"; return; } // gwarancja że niezalogowany użytkownik wyleci na stronę startową
    setUserId(storedId);

    fetch('http://localhost:8080/api/interests')
        .then(res => res.json())
        .then(data => setAvailableInterests(data))
        .catch(err => console.error("Błąd hobby:", err));

    fetch('http://localhost:8080/api/users')
        .then(res => res.json())
        .then(users => {
            const me = users.find(u => u.id.toString() === storedId);
            if (me) {
                setUserName(me.firstName);
                setDetails({
                    height: me.height || '',
                    dateOfBirth: me.dateOfBirth || '',
                    description: me.description || ''
                });
                if (me.interests) {
                    const ids = me.interests.map(i => i.id);
                    setSelectedInterestIds(ids);
                }
                setAddedSlots(me.schedule || []);
            } else {
                localStorage.removeItem("myUserId");
                window.location.href = "/";
            }
        });
  }, []);

  const handleSaveProfile = () => {
      // Walidacja Wzrostu
      const heightVal = parseInt(details.height);
      if (details.height && (heightVal < 140 || heightVal > 240)) {
          showModal('error', 'Błędny wzrost', 'Wzrost musi mieścić się w przedziale 140 - 240 cm.');
          return;
      }

      // Walidacja Daty Urodzenia
      if (details.dateOfBirth) {
          const year = parseInt(details.dateOfBirth.split('-')[0]);
          if (year < 1960 || year > 2007) {
              showModal('error', 'Błędna data', 'Rok urodzenia musi być pomiędzy 1960 a 2007.');
              return;
          }
      }

      const payload = {
          height: heightVal || 0,
          dateOfBirth: details.dateOfBirth,
          description: details.description,
          interests: selectedInterestIds.map(id => ({ id: id }))
      };

      fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      })
      .then(async res => {
          if (res.ok) {
              showModal('success', 'Zapisano!', 'Twój profil został zaktualizowany.');
          } else {
              const errorText = await res.text();
              showModal('error', 'Błąd Zapisu', errorText || "Nie udało się zapisać zmian.");
          }
      });
  };

  const toggleInterest = (id) => {
      if (selectedInterestIds.includes(id)) {
          setSelectedInterestIds(selectedInterestIds.filter(i => i !== id));
      } else {
          setSelectedInterestIds([...selectedInterestIds, id]);
      }
  };

  const handleAddSlot = () => {
    const slotData = { dayOfWeek: day, startTime: start + ":00", endTime: end + ":00", freeTime: true };

    fetch(`http://localhost:8080/api/timeslots?userId=${userId}`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(slotData)
    }).then(async res => {
        if(res.ok) {
            const s = await res.json();
            setAddedSlots([...addedSlots, s]);
        }
        else {
            const errorJson = await res.json().catch(() => ({}));
            const errorMsg = errorJson.message || "Błąd dodawania czasu! Sprawdź kolizje.";
            showModal('time', 'Kolizja w grafiku!', errorMsg);
        }
    });
  };

  const handleDeleteSlot = (id) => {
      fetch(`http://localhost:8080/api/timeslots/${id}`, { method: 'DELETE' })
        .then(res => { if(res.ok) setAddedSlots(addedSlots.filter(s => s.id !== id)); });
  };

  // Funkcje obsługi pliku
  const triggerFileInput = () => {
        fileInputRef.current.click();
  };

  const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);

        console.log("Wysyłam plik...");

        fetch('http://localhost:8080/api/timeslots/upload', {
            method: 'POST',
            body: formData
        })
        .then(async res => {
            if (res.ok) {
                showModal('success', 'Import Udany!', 'Plan z USOSa został przetworzony. Strona zostanie odświeżona.');
                setTimeout(() => window.location.reload(), 2000);
            } else {
                const text = await res.text();
                showModal('error', 'Błąd importu', 'Sprawdź czy to poprawny plik .ics');
            }
        })
        .catch(err => showModal('error', 'Błąd sieci', 'Błąd wysyłania pliku.'));
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto', padding: '20px', paddingBottom: '120px' }}>

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* NAGŁÓWEK */}
        <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <UserCircle size={48} color="#6366f1" />
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px' }}>Cześć, {userName}!</h1>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Twoja wizytówka w UsosMatch</p>
                </div>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* LEWA KOLUMNA: O Tobie */}
            <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ ...cardStyle, height: '100%' }}>
                    <h3 style={{ margin: '0 0 15px 0', borderBottom:'1px solid #eee', paddingBottom:'10px', color:'#333' }}>
                        👤 O Tobie
                    </h3>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}><Ruler size={14}/> Wzrost (cm)</label>
                            <input
                                type="number"
                                min="140" max="240"
                                placeholder="140-240"
                                style={inputStyle}
                                value={details.height}
                                onChange={e => setDetails({...details, height: e.target.value})}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}><Calendar size={14}/> Data Ur.</label>
                            <input
                                type="date"
                                min="1960-01-01"
                                max="2007-12-31"
                                style={inputStyle}
                                value={details.dateOfBirth}
                                onChange={e => setDetails({...details, dateOfBirth: e.target.value})}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom:'15px' }}>
                        <label style={labelStyle}><FileText size={14}/> Opis (Bio)</label>
                        <textarea
                            placeholder="Napisz, kogo szukasz..."
                            style={{...inputStyle, height: '80px', fontFamily: 'inherit'}}
                            value={details.description} onChange={e => setDetails({...details, description: e.target.value})}
                        />
                    </div>

                    <label style={labelStyle}><Tag size={14}/> Twoje Pasje</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', minHeight: '50px' }}>
                        {availableInterests.map(interest => {
                            const isActive = selectedInterestIds.includes(interest.id);
                            return (
                                <div
                                    key={interest.id}
                                    onClick={() => toggleInterest(interest.id)}
                                    style={{
                                        ...chipBase,
                                        background: isActive ? '#6366f1' : 'white',
                                        color: isActive ? 'white' : '#555',
                                        borderColor: isActive ? '#6366f1' : '#ddd',
                                        boxShadow: isActive ? '0 4px 10px rgba(99, 102, 241, 0.3)' : 'none'
                                    }}
                                >
                                    {interest.name}
                                </div>
                            )
                        })}
                    </div>

                    <button onClick={handleSaveProfile} style={{ ...buttonStyle, background: '#10b981', marginTop: 'auto' }}>
                        <Save size={18}/> Zapisz Profil
                    </button>
                </div>
            </div>

            {/* PRAWA KOLUMNA: Grafik */}
            <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ ...cardStyle, height: '100%' }}>
                    <h3 style={{ margin: '0 0 15px 0', borderBottom:'1px solid #eee', paddingBottom:'10px', color:'#333' }}>
                        📅 Twój Grafik
                    </h3>

                    {/* Sekcja IMPORT */}
                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                        <label style={labelStyle}>📥 Importuj z USOS (plik .ics)</label>
                        <p style={{fontSize: '11px', color: '#888', marginTop: 0}}>
                            System wyznaczy wolne godziny (10:00 - 22:00) na podstawie Twoich zajęć.
                        </p>

                        <input
                            type="file"
                            accept=".ics"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />

                        <button onClick={triggerFileInput} style={{...buttonStyle, background: 'white', color: '#6366f1', border: '1px dashed #6366f1'}}>
                            <Upload size={18} /> Wgraj plik iCalendar
                        </button>
                    </div>

                    {/* Sekcja DODAJ RĘCZNIE */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={labelStyle}>Dodaj termin dostępności:</label>
                        <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
                            <select style={{...inputStyle, flex:2}} value={day} onChange={e => setDay(e.target.value)}>
                                {Object.keys(daysPl).map(d => <option key={d} value={d}>{daysPl[d]}</option>)}
                            </select>
                            <input type="time" style={{...inputStyle, flex:1.5}} value={start} onChange={e => setStart(e.target.value)} />
                            <input type="time" style={{...inputStyle, flex:1.5}} value={end} onChange={e => setEnd(e.target.value)} />
                        </div>
                        <button onClick={handleAddSlot} style={buttonStyle}>
                            <Plus size={18} /> Dodaj czas
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #eee' }}>
                        {addedSlots.length === 0 && <span style={{fontSize:'13px', color:'#999', fontStyle:'italic'}}>Brak dodanych godzin...</span>}
                        {addedSlots.map((slot) => (
                            <div key={slot.id} style={timeSlotChip}>
                                <b>{daysPl[slot.dayOfWeek]}</b> {slot.startTime.substring(0,5)}-{slot.endTime.substring(0,5)}
                                <button onClick={() => handleDeleteSlot(slot.id)} style={{background:'none', border:'none', cursor:'pointer', padding:'0 0 0 5px', display:'flex'}}><X size={14} color="red"/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
      </div>

      <InfoModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ ...modal, isOpen: false })}
          type={modal.type}
          title={modal.title}
          message={modal.message}
      />

    </div>
  );
};

// Style
const cardStyle = { background: 'rgba(255, 255, 255, 0.9)', borderRadius: '24px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid white' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '14px', outline: 'none', boxSizing:'border-box', transition:'border-color 0.2s' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '12px', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase' };
const buttonStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#6366f1', color: 'white', fontWeight: 'bold', fontSize:'15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'transform 0.1s' };
const chipBase = { padding: '8px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', border: '1px solid', transition: '0.2s' };
const timeSlotChip = { background: '#e0e7ff', color: '#3730a3', padding: '8px 14px', borderRadius: '16px', fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center', border: '1px solid #c7d2fe' };

export default ProfilePage;