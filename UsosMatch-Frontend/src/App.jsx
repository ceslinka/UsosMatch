import { Routes, Route } from 'react-router-dom';
// Importujemy nasze strony (pliki muszą mieć 'export default'!)
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MatchingPage from './pages/MatchingPage';
import MatchesListPage from './pages/MatchesListPage';
// Importujemy menu nawigacyjne
import Navbar from './components/Navbar';

function App() {
  return (
    // Główny kontener aplikacji - nasze "okno" na telefon
    <div className="app-container" style={{ position: 'relative', height: '100%', width: '100%' }}>

      {/* 1. MIEJSCE NA TREŚĆ (Zmienia się w zależności od adresu URL) */}
      <Routes>
        {/* Ścieżka "/" (startowa) -> na razie Rejestracja */}
        <Route path="/" element={<RegisterPage />} />

        {/* Reszta podstron */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/match" element={<MatchingPage />} />
        <Route path="/list" element={<MatchesListPage />} />
      </Routes>

      {/* 2. MENU NA DOLE (Jest zawsze widoczne, bo jest POZA <Routes>) */}
      <Navbar />

    </div>
  );
}

export default App;