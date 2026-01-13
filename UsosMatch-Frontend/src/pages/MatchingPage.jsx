import { useState, useEffect } from 'react';
import { User, GraduationCap, Quote, Check, X, CalendarClock, Flame } from 'lucide-react';

const MatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState(null); // Przechowujemy SWOJE ID

  useEffect(() => {
    // 1. Pobieramy swoje ID z pamięci (string -> number)
    const storedIdString = localStorage.getItem("myUserId");
    if (!storedIdString) {
        window.location.href = "/";
        return;
    }
    const idNum = parseInt(storedIdString); // Zamieniamy "1" na 1 (liczba)
    setMyId(idNum);

    // 2. Pobieramy matche
    fetch(`http://localhost:8080/api/matches/${idNum}`)
        .then(res => res.json())
        .then(data => {
            console.log("Pobrane matche:", data);
            setMatches(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Błąd Backendu:", err);
            setLoading(false);
        });
  }, []);

  const handleDecision = (decision) => {
      if (currentIndex < matches.length) {
          setCurrentIndex(prev => prev + 1);
      }
  };

  // --- BEZPIECZEŃSTWO PRZED PUSTĄ LISTĄ ---
  if (!loading && (!matches || matches.length === 0 || currentIndex >= matches.length)) {
      return (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#666' }}>
              <Flame size={64} color="#ccc" style={{marginBottom: '20px'}}/>
              <h2>Brak nowych par w okolicy!</h2>
              <p>Zajrzyj później.</p>
          </div>
      );
  }

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Ładowanie algorytmu...</div>;

  const currentMatch = matches[currentIndex];

  // ============================================================
  // 🔥 FIX NAPRAWCZY: Określanie kto jest "Tym Drugim"
  // ============================================================

  let candidate = null;

  // Sprawdź czy my jesteśmy User1
  if (currentMatch.user1.id === myId) {
      candidate = currentMatch.user2;
  } else {
      candidate = currentMatch.user1;
  }

  // BARDZO WAŻNE: Sprawdź czy kandydat w ogóle istnieje (żeby nie było białego ekranu)
  if (!candidate) {
      return <div>Błąd danych matcha (Brak partnera w obiekcie)</div>;
  }
  // ============================================================

  const score = currentMatch.compabilityScore;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px', paddingBottom: '100px' }}>

      {/* KARTA */}
      <div style={cardStyle}>

        {/* Nagłówek */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '80px', height: '80px', background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={40} color="#4338ca" />
            </div>

            <div style={{ background: score > 50 ? '#dcfce7' : '#ffedd5', padding: '10px 15px', borderRadius: '20px', fontWeight: 'bold', color: score > 50 ? '#166534' : '#c2410c' }}>
                {score}% Zgodności
            </div>
        </div>

        {/* Dane Tekstowe - TU MOGŁO SIĘ SYPAĆ */}
        <h2 style={{ marginTop: '20px', marginBottom: '5px' }}>{candidate.firstName || "Anonim"} {candidate.lastName || ""}</h2>

        <div style={infoRow}>
            <GraduationCap size={18} color="#6366f1"/>
            <span>{candidate.universityName || "Brak uczelni"}</span>
        </div>

        <div style={{ ...infoRow, fontStyle: 'italic', color: '#555', marginTop: '15px' }}>
            <Quote size={18} color="#6366f1" style={{minWidth: '18px'}}/>
            <span>"{candidate.description || "Brak opisu..."}"</span>
        </div>

        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)' }} />

        {/* Czas */}
        <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' }}>
                <CalendarClock size={20}/>
                Wspólne okienka:
            </h4>
            <p style={{ fontSize: '14px', color: '#666' }}>
               Algorytm wykrył nakładanie się planów.
            </p>
        </div>

        {/* Przyciski */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
            <button
                onClick={() => handleDecision("reject")}
                style={{ ...actionButton, border: '2px solid #ef4444', color: '#ef4444' }}>
                <X size={32} />
            </button>

            <button
                onClick={() => handleDecision("accept")}
                style={{ ...actionButton, background: '#10b981', color: 'white', flex: 1, border: 'none' }}>
                <Check size={32} /> Zaproś
            </button>
        </div>

      </div>
    </div>
  );
};

// Style bez zmian
const cardStyle = {
    position: 'relative', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', borderRadius: '30px', padding: '30px', width: '90%', maxWidth: '400px', height: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.6)', animation: 'fadeIn 0.5s ease-out'
};
const infoRow = { display: 'flex', alignItems: 'center', gap: '10px', color: '#333', fontSize: '15px' };
const actionButton = { borderRadius: '50px', height: '60px', width: '60px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'transparent', transition: 'transform 0.1s' };

export default MatchingPage;