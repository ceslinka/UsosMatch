import { CheckCircle, AlertTriangle, X } from 'lucide-react';

const InfoModal = ({ isOpen, onClose, type, title, message }) => {
  // Jeśli modal jest zamknięty, nie renderujemy nic
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    // 1. TŁO (Overlay) - przyciemnia resztę aplikacji
    <div style={overlayStyle} onClick={onClose}>

      {/* 2. OKNO (Kliknięcie w okno nie powinno go zamykać -> e.stopPropagation) */}
      <div style={modalWindowStyle} onClick={(e) => e.stopPropagation()}>

        {/* Ikonka na górze */}
        <div style={{ marginBottom: '15px' }}>
            {isSuccess ? (
                <CheckCircle size={50} color="#10b981" />
            ) : (
                <AlertTriangle size={50} color="#ef4444" />
            )}
        </div>

        {/* Tytuł */}
        <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '20px' }}>
            {title}
        </h3>

        {/* Treść */}
        <p style={{ margin: '0 0 25px 0', color: '#666', lineHeight: '1.5' }}>
            {message}
        </p>

        {/* Przycisk Zamknij */}
        <button onClick={onClose} style={isSuccess ? successBtn : errorBtn}>
            Zrozumiałem
        </button>

      </div>
    </div>
  );
};

// --- STYLE ---
const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Półprzezroczyste czarne tło
    backdropFilter: 'blur(4px)', // Rozmycie tła aplikacji
    display: 'flex', justifyContent: 'center', alignItems: 'center', // Centrowanie
    zIndex: 9999,
    animation: 'fadeIn 0.2s ease-out'
};

const modalWindowStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    animation: 'slideUp 0.3s ease-out'
};

const btnBase = {
    padding: '12px 30px', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', width: '100%', transition: '0.2s'
};

const successBtn = { ...btnBase, backgroundColor: '#10b981', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' };
const errorBtn = { ...btnBase, backgroundColor: '#ef4444', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' };

export default InfoModal;