import { useState, useEffect } from 'react';
import { MessageCircle, User} from 'lucide-react'; // Ikonki akcji

const MatchesListPage = () => { // tworzymy nową funkcję(stronę)
  const [matches, setMatches] = useState([]); // dzieki useState po odświeżeniu mamy nadal nasz matche, setmatches generuje sie automatycznie
  const [loading, setLoading] = useState(true);  // dopiero gdy przyjdą dane z backendu znika nam 'loading'
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("myUserId"); // zapamiętujemy id
    if (!storedId) {
        window.location.href = "/";
        return;
    }
    setMyId(parseInt(storedId));

    // 1. Pobieramy wszystko z backendu
    fetch(`http://localhost:8080/api/matches/${storedId}`)
      .then(res => res.json())
      .then(data => {
        // 2. FILTRUJEMY! Chcemy tylko zaakceptowane pary (MATCHED)
        // Odrzucone (REJECTED) i Oczekujące (PENDING) ukrywamy.
        const onlyAccepted = data.filter(m => m.status === 'MATCHED');
        setMatches(onlyAccepted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Funkcja pomocnicza: Kto jest po drugiej stronie?
  const getPartner = (match) => {
      // Jeśli my to user1, to partner to user2 (i na odwrót)
      if (match.user1.id === myId) return match.user2;
      return match.user1;
  };

  // Funkcja tymczasowa (bo nie mamy websocketów/czatu na backendzie)
  const handleChat = (name) => {
      alert(`Otwieram czat z użytkownikiem: ${name} (Coming soon!)`);
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Ładowanie rozmów...</div>;

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>

      <h1 style={{ marginBottom: '20px', color: '#6366f1' }}>Twoje Pary</h1>

      {matches.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#888' }}>
              <MessageCircle size={64} style={{ marginBottom: '20px', opacity: 0.5 }} />
              <h3>Pusto tutaj...</h3>
              <p>Wejdź w zakładkę 🔥 i polub kogoś!</p>
          </div>
      ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

              {/* Generowanie listy kafelków */}
              {matches.map(match => {
                  const partner = getPartner(match);

                  // Jeśli jakimś cudem partner nie istnieje (błąd danych), pomiń
                  if (!partner) return null;

                  return (
                    <div key={match.id} style={listItemStyle} onClick={() => handleChat(partner.firstName)}>

                        {/* Avatar */}
                        <div style={avatarStyle}>
                            <User size={24} color="#fff" />
                        </div>

                        {/* Dane Tekstowe */}
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>{partner.firstName} {partner.lastName}</h3>
                            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{partner.universityName}</p>
                        </div>

                        {/* Ikony akcji (fake) */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={iconBtnStyle}><Phone size={18}/></div>
                            <div style={iconBtnStyle}><Video size={18}/></div>
                        </div>

                    </div>
                  );
              })}

          </div>
      )}
    </div>
  );
};

// --- STYLE (List Item Glassmorphism) ---
const listItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    borderRadius: '18px',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.5)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    cursor: 'pointer',
    transition: '0.2s',
};

const avatarStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const iconBtnStyle = {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    background: '#f3f4f6',
    color: '#6366f1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

export default MatchesListPage;