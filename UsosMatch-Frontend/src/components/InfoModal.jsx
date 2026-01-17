import { CheckCircle, XCircle, AlertTriangle, Lock, Clock } from 'lucide-react';

const InfoModal = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) return null;

  // Logika wyboru ikony i koloru na podstawie TYPU wiadomości
  let icon = <AlertTriangle size={50} color="#ef4444" />; // Domyślny (Błąd ogólny)
  let btnStyle = errorBtn;

  switch (type) {
      case 'success':
          icon = <CheckCircle size={50} color="#10b981" />;
          btnStyle = successBtn;
          break;
      case 'login': // Nowy typ: Błąd logowania/rejestracji
          icon = <Lock size={50} color="#f59e0b" />; // Pomarańczowa kłódka
          btnStyle = warningBtn;
          break;
      case 'time': // Nowy typ: Kolizja w grafiku
          icon = <Clock size={50} color="#6366f1" />; // Fioletowy zegar
          btnStyle = infoBtn;
          break;
      case 'error': // Standardowy błąd
          icon = <XCircle size={50} color="#ef4444" />;
          btnStyle = errorBtn;
          break;
      default:
          break;
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalWindowStyle} onClick={(e) => e.stopPropagation()}>

        {/* Ikonka dynamiczna */}
        <div style={{ marginBottom: '15px' }}>
            {icon}
        </div>

        <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '20px' }}>{title}</h3>
        <p style={{ margin: '0 0 25px 0', color: '#666', lineHeight: '1.5' }}>{message}</p>

        <button onClick={onClose} style={btnStyle}>
            OK
        </button>

      </div>
    </div>
  );
};

// --- STYLE ---
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, animation: 'fadeIn 0.2s ease-out' };
const modalWindowStyle = { background: 'white', padding: '30px', borderRadius: '24px', width: '90%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'scaleUp 0.3s ease-out' };

const btnBase = { padding: '12px 30px', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', width: '100%', transition: '0.2s' };

const successBtn = { ...btnBase, backgroundColor: '#10b981' };
const errorBtn =   { ...btnBase, backgroundColor: '#ef4444' };
const warningBtn = { ...btnBase, backgroundColor: '#f59e0b' }; // Pomarańczowy (Logowanie)
const infoBtn =    { ...btnBase, backgroundColor: '#6366f1' }; // Fioletowy (Czas)

export default InfoModal;