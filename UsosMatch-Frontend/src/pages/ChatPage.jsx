import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, User, MessageCircle } from 'lucide-react';

const ChatPage = () => {
    const { partnerId } = useParams();
    const navigate = useNavigate();

    // Dane
    const [messages, setMessages] = useState([]);
    const [matchesList, setMatchesList] = useState([]);
    const [currentPartnerName, setCurrentPartnerName] = useState("");

    const [newMessage, setNewMessage] = useState("");
    const [myId, setMyId] = useState(null);
    const bottomRef = useRef(null);

    // --- KROK A: Pobranie tożsamości i Listy Czatów (Sidebar) ---
    useEffect(() => {
        const storedId = localStorage.getItem("myUserId");
        if (!storedId) {
            window.location.href = "/";
            return;
        }
        setMyId(parseInt(storedId));

        // Pobieramy listę matchy, żeby wyświetlić ją po lewej
        fetch(`http://172.20.10.6:8080/api/matches/${storedId}/list`)
            .then(res => res.json())
            .then(data => {
                setMatchesList(data);
                // Jeśli jesteśmy w konkretnej rozmowie, ustawmy imię partnera w nagłówku
                if (partnerId) {
                    findAndSetName(data, parseInt(storedId), parseInt(partnerId));
                }
            })
            .catch(err => console.error(err));
    }, [partnerId]);

    // --- KROK B: Pobieranie Wiadomości + Auto-Odświeżanie (LIVE) ---
    useEffect(() => {
        const fetchMessages = () => {
            if (myId && partnerId) {
                fetch(`http://172.20.10.6:8080/api/chat/${myId}/${partnerId}`)
                    .then(res => res.json())
                    .then(data => {
                        // Aktualizujemy wiadomości
                        setMessages(data);
                    })
                    .catch(err => console.error(err));
            }
        };

        // 1. Pobierz raz od razu
        fetchMessages();

        // 2. Ustaw "budzik" co 2 sekundy (Polling), żeby widzieć co ktoś odpisuje
        const intervalId = setInterval(fetchMessages, 2000);

        // 3. Sprzątanie przy wyjściu
        return () => clearInterval(intervalId);

    }, [myId, partnerId]);

    // --- Funkcje Pomocnicze ---
    const findAndSetName = (matches, myId, pId) => {
        const match = matches.find(m => m.user1.id === pId || m.user2.id === pId);
        if (match) {
            const partner = (match.user1.id === myId) ? match.user2 : match.user1;
            setCurrentPartnerName(`${partner.firstName} ${partner.lastName}`);
        } else {
            setCurrentPartnerName("Użytkownik");
        }
    };

    const getPartnerObj = (match) => {
        if (match.user1.id === myId) return match.user2;
        return match.user1;
    };

    const scrollToBottom = () => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !partnerId) return;

        const msgPayload = {
            senderId: myId,
            receiverId: parseInt(partnerId),
            content: newMessage
        };

        fetch('http://172.20.10.6:8080/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msgPayload)
        })
        .then(res => res.json())
        .then(savedMsg => {
            setMessages([...messages, savedMsg]); // Dodajemy naszą od razu
            setNewMessage("");
            scrollToBottom();
        });
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'white' }}>

            {/* LEWA KOLUMNA: Sidebar */}
            <div style={sidebarStyle}>
                <h3 style={{ padding: '20px', margin: 0, borderBottom: '1px solid #eee', color: '#6366f1' }}>
                    Twoje Czaty
                </h3>
                <div style={{ overflowY: 'auto' }}>
                    {matchesList.map(match => {
                        const partner = getPartnerObj(match);
                        const isActive = parseInt(partnerId) === partner.id;

                        return (
                            <div
                                key={match.id}
                                onClick={() => navigate(`/chat/${partner.id}`)}
                                style={{
                                    ...contactItem,
                                    background: isActive ? '#f0f4ff' : 'transparent',
                                    borderRight: isActive ? '3px solid #6366f1' : '3px solid transparent'
                                }}
                            >
                                <div style={avatarSmall}><User size={16} color="white"/></div>
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: '14px'}}>
                                        {partner.firstName} {partner.lastName}
                                    </div>
                                    <div style={{fontSize: '11px', color: '#888'}}>
                                        {partner.universityName}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* PRAWA KOLUMNA: Czat */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f5f7fb' }}>

                {/* Nagłówek */}
                <div style={chatHeader}>
                    {partnerId ? (
                        <>
                            <div style={avatarCircle}><User size={20} color="white"/></div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>{currentPartnerName}</h3>
                        </>
                    ) : (
                        <span>Wybierz rozmowę z lewej strony</span>
                    )}
                </div>

                {/* Wiadomości */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {!partnerId && (
                        <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', color:'#aaa', flexDirection:'column'}}>
                            <MessageCircle size={64}/>
                            <p>Wybierz osobę, żeby pisać.</p>
                        </div>
                    )}

                    {messages.map((msg, index) => {
                        const isMe = msg.senderId === myId;
                        return (
                            <div key={index} style={{
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                maxWidth: '60%',
                                padding: '10px 16px',
                                borderRadius: '18px',
                                fontSize: '14px',
                                lineHeight: '1.4',
                                background: isMe ? '#6366f1' : 'white',
                                color: isMe ? 'white' : '#333',
                                borderBottomRightRadius: isMe ? '4px' : '18px',
                                borderBottomLeftRadius: isMe ? '18px' : '4px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}>
                                {msg.content}
                            </div>
                        )
                    })}
                    <div ref={bottomRef} />
                </div>

                {/* Pasek Pisania (Podniesiony!) */}
                {partnerId && (
                    <form onSubmit={handleSend} style={inputAreaStyle}>
                        <input
                            placeholder="Napisz wiadomość..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            style={inputStyle}
                        />
                        <button type="submit" style={sendBtnStyle}>
                            <Send size={20} />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

// --- Style ---
const sidebarStyle = { width: '300px', background: 'white', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' };
const contactItem = { padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' };
const chatHeader = { height: '60px', padding: '0 20px', background: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' };
const avatarCircle = { width: '40px', height: '40px', borderRadius: '50%', background: '#ccc', display:'flex', alignItems:'center', justifyContent:'center' };
const avatarSmall = { width: '32px', height: '32px', borderRadius: '50%', background: '#ddd', display:'flex', alignItems:'center', justifyContent:'center' };

const inputAreaStyle = {
    padding: '20px',
    background: 'white',
    borderTop: '1px solid #eee',
    display: 'flex',
    gap: '10px',
    // ⬇️ TO NAPRAWIA ZASŁANIANIE PRZEZ MENU:
    paddingBottom: '120px'
};

const inputStyle = { flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', fontSize: '14px', background: '#f9f9f9' };
const sendBtnStyle = { width: '45px', height: '45px', borderRadius: '50%', background: '#6366f1', border: 'none', color: 'white', display:'flex', alignItems:'center', justifyContent:'center', cursor: 'pointer' };

export default ChatPage;