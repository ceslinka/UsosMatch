import { NavLink } from 'react-router-dom';
import { User, Flame, MessageCircle, LogIn } from 'lucide-react'; // Ikony

const Navbar = () => {
  return (
    // Główny kontener paska - przyklejony do dołu (position: fixed)
    <nav style={{
      position: 'fixed',
      bottom: '20px',        // 20px od dołu ekranu
      left: '50%',           // Na środku w poziomie
      transform: 'translateX(-50%)', // Centrowanie

      // EFEKT SZKŁA (GLASSMORPHISM) ✨
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Biały, ale prześwitujący
      backdropFilter: 'blur(10px)', // Rozmycie tła pod spodem

      padding: '10px 30px',
      borderRadius: '30px',  // Mocno zaokrąglone rogi (jak pastylka)
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)', // Delikatny cień
      display: 'flex',       // Ikony obok siebie
      gap: '40px',           // Odstęp między ikonami
      zIndex: 1000           // Zawsze na wierzchu
    }}>

      {/* Link 1: Rejestracja/Logowanie */}
      <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#6366f1' : '#888' })}>
        <LogIn size={28} />
      </NavLink>

      {/* Link 2: Szukanie Pary (Główny) */}
      <NavLink to="/match" style={({ isActive }) => ({ color: isActive ? '#6366f1' : '#888' })}>
        <Flame size={28} />
      </NavLink>

      {/* Link 3: Moje Pary (Lista) */}
      <NavLink to="/list" style={({ isActive }) => ({ color: isActive ? '#6366f1' : '#888' })}>
        <MessageCircle size={28} />
      </NavLink>

      {/* Link 4: Profil */}
      <NavLink to="/profile" style={({ isActive }) => ({ color: isActive ? '#6366f1' : '#888' })}>
        <User size={28} />
      </NavLink>

    </nav>
  );
};

export default Navbar;