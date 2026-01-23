import { useState, useEffect } from 'react';
import { User, GraduationCap, Quote, Check, X, CalendarClock, Flame, Ruler, Cake, Tag } from 'lucide-react';

const MatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    const storedIdString = localStorage.getItem("myUserId");
    if (!storedIdString) { window.location.href = "/"; return; }
    const idNum = parseInt(storedIdString);
    setMyId(idNum);

    fetch(`http://172.20.10.6:8080/api/matches/${idNum}`)
        .then(res => res.json())
        .then(data => {
            console.log("Pobrane matche:", data);
            // Sortujemy: Najpierw ci z najwyższym wynikiem!
            const sortedData = data.sort((a,b) => b.compabilityScore - a.compabilityScore);
            setMatches(sortedData);
            setLoading(false);
        })
        .catch(err => { console.error(err); setLoading(false); });
  }, []);

 const handleDecision = (decision) => {
       // Zabezpieczenie przed klikaniem w pustkę
       if (matches.length === 0 || !matches[currentIndex]) return;

       const currentMatch = matches[currentIndex];
       const matchId = currentMatch.id;
       const action = decision === "accept" ? "accept" : "reject";

       // LOGOWANIE DLA CIEBIE (Sprawdź w konsoli F12, czy myId nie jest puste!)
       console.log(`Akcja: ${action}, MatchID: ${matchId}, MojeID: ${myId}`);

       if (!myId) {
           alert("Błąd: Nie wiem kim jesteś (brak myId). Odśwież stronę.");
           return;
       }

       // --- KLUCZOWA NAPRAWA BŁĘDU ---
       // Dodajemy ?userId=${myId} do adresu URL
       fetch(`http://172.20.10.6:8080/api/matches/${matchId}/${action}?userId=${myId}`, {
           method: 'POST'
       }).then(res => {
           if (res.ok) {
               console.log("Sukces! Status zmieniony.");
           } else {
               console.error("Błąd Backend:", res.status);
           }
       });

       // Przesuwamy kartę wizualnie
       if (currentIndex < matches.length) {
           setCurrentIndex(prev => prev + 1);
       }
   };

  // --- Helper: Obliczanie wieku ---
  const calculateAge = (dateString) => {
      if (!dateString) return null;
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
  };

  // --- RENDEROWANIE (Bezpiecznik) ---
  if (!loading && (!matches || matches.length === 0 || currentIndex >= matches.length)) {
      return (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#666' }}>
              <Flame size={64} color="#ccc" style={{marginBottom: '20px'}}/>
              <h2>Brak nowych par w okolicy!</h2>
              <p>Zajrzyj później.</p>
          </div>
      );
  }

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Szukam najlepszych kandydatek/ów...</div>;

  const currentMatch = matches[currentIndex];
  let candidate = currentMatch.user1.id === myId ? currentMatch.user2 : currentMatch.user1;

  if (!candidate) return <div>Błąd danych matcha</div>;

  const score = currentMatch.compabilityScore;
  const age = calculateAge(candidate.dateOfBirth);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px', paddingBottom: '100px' }}>

      {/* KARTA GLÓWNA */}
      <div style={cardStyle}>

        {/* NAGŁÓWEK: AVATAR + SCORE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow:'0 4px 10px rgba(0,0,0,0.1)' }}>
                <User size={40} color="#4338ca" />
            </div>

            <div style={{ background: score > 50 ? '#dcfce7' : '#ffedd5', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', color: score > 50 ? '#166534' : '#c2410c', fontSize:'14px', border: score > 50 ? '1px solid #86efac' : '1px solid #fdba74' }}>
                {score}% Zgodności
            </div>
        </div>

        {/* DANE OSOBOWE */}
        <div style={{marginTop: '15px'}}>
            <h2 style={{ margin: '0 0 5px 0' }}>{candidate.firstName} {candidate.lastName}</h2>

            {/* TAGI: Wiek | Wzrost | Uczelnia */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom:'15px' }}>
                {age && (
                    <span style={pillStyle}>
                        <Cake size={14}/> {age} lat
                    </span>
                )}
                {candidate.height > 0 && (
                    <span style={pillStyle}>
                        <Ruler size={14}/> {candidate.height} cm
                    </span>
                )}
                <span style={pillStyle}>
                    <GraduationCap size={14}/> {candidate.universityName}
                </span>
            </div>
        </div>

        {/* CYTAT / OPIS */}
        {candidate.description && (
            <div style={{ display:'flex', gap:'10px', fontStyle: 'italic', color: '#555', background:'rgba(255,255,255,0.5)', padding:'10px', borderRadius:'12px', border:'1px solid rgba(0,0,0,0.05)' }}>
                <Quote size={20} color="#6366f1" style={{minWidth:'20px'}}/>
                <span style={{fontSize:'14px'}}>"{candidate.description}"</span>
            </div>
        )}

        {/* --- PASJE (HOBBY) --- */}
        {candidate.interests && candidate.interests.length > 0 && (
            <div style={{ marginTop: '20px' }}>
                <div style={{fontSize:'12px', fontWeight:'bold', color:'#888', textTransform:'uppercase', marginBottom:'5px', display:'flex', gap:'5px', alignItems:'center'}}>
                    <Tag size={12}/> Lubi:
                </div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'6px'}}>
                    {candidate.interests.map(i => (
                        <span key={i.id} style={hobbyChip}>
                            {i.name}
                        </span>
                    ))}
                </div>
            </div>
        )}

        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)' }} />

        {/* CZAS */}
        <div style={{background:'#f3f4f6', padding:'10px', borderRadius:'15px'}}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 5px 0', fontSize:'14px' }}>
                <CalendarClock size={18}/>
                Wspólny Czas:
            </h4>
            <p style={{ fontSize: '13px', color: '#666', margin:0 }}>
               System wykrył nakładające się okienka w planie zajęć. Pasujecie czasowo!
            </p>
        </div>

        {/* PRZYCISKI AKCJI */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
            <button onClick={() => handleDecision("reject")} style={rejectBtn}><X size={32} /></button>
            <button onClick={() => handleDecision("accept")} style={acceptBtn}><Check size={32} /> Zaproś</button>
        </div>

      </div>
    </div>
  );
};

// --- NOWOCZESNE STYLE ---
const cardStyle = {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.9)', // Mniej prześwitująca karta dla czytelności
    backdropFilter: 'blur(20px)',
    borderRadius: '30px',
    padding: '25px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)', // Fioletowa poświata
    border: '1px solid white',
    animation: 'fadeIn 0.4s ease-out'
};

const pillStyle = {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    background: '#fff', border: '1px solid #e5e7eb',
    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight:'600', color: '#374151'
};

const hobbyChip = {
    background: '#e0e7ff', color: '#4338ca',
    padding: '4px 10px', borderRadius: '8px',
    fontSize: '12px', fontWeight: '500'
};

const rejectBtn = {
    width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #ef4444',
    background: 'white', color: '#ef4444', display:'flex', justifyContent:'center', alignItems:'center', cursor:'pointer', transition:'0.1s'
};

const acceptBtn = {
    flex: 1, height: '60px', borderRadius: '50px', border: 'none',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white', fontSize:'18px', fontWeight:'bold', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', cursor:'pointer',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
};

export default MatchingPage;