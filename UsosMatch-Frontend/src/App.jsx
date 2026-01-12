import { useState, useEffect } from 'react'

function App() {
  // Stan na przechowywanie listy studentów
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ten kawałek kodu uruchamia się raz po wejściu na stronę
  useEffect(() => {
    // 1. Uderzamy pod adres Twojego Backendu
    fetch('http://localhost:8080/api/users')
      .then(response => {
        if (!response.ok) {
            throw new Error("Błąd sieci!");
        }
        return response.json();
      })
      .then(data => {
        // 2. Jak przyjdą dane (Kamila i Ani), zapisujemy je
        console.log("Dane z Javy:", data);
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Błąd:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>🎓 UsosMatch Frontend</h1>
      <p>Poniżej lista studentów pobrana prosto z bazy H2:</p>

      {loading ? (
        <p>Ładowanie danych z Javy...</p>
      ) : (
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>

          {/* Jeśli lista jest pusta */}
          {users.length === 0 && <p style={{color: "red"}}>Brak studentów. Dodaj kogoś przez Postmana/Cool Request!</p>}

          {/* Pętla wyświetlająca kafelki studentów */}
          {users.map(user => (
            <div key={user.id} style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "10px", width: "200px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
              <h3>{user.firstName} {user.lastName}</h3>
              <p style={{ color: "gray" }}>{user.email}</p>
              <p>Uni: {user.universityName}</p>
              <p style={{ fontStyle: "italic" }}>"{user.description}"</p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default App;