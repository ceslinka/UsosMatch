import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import MatchingPage from "./pages/MatchingPage";
import MatchesListPage from "./pages/MatchesListPage";

function App() {
    return (
        <BrowserRouter>
            {/* Navbar jest POZA <Routes>, więc będzie widoczny na każdej stronie */}
            <Navbar />

            <div style={{ padding: "20px" }}>
                <Routes>
                    {/* Definiujemy, jaki komponent pokazać pod jakim adresem */}
                    <Route path="/" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/match" element={<MatchingPage />} />
                    <Route path="/list" element={<MatchesListPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;