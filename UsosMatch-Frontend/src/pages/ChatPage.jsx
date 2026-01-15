import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Ikony są zaimportowane, ale na razie nieużywane - to OK, przydadzą się zaraz
import { Send, ArrowLeft, User } from 'lucide-react';

const ChatPage = () => {
    const { partnerId } = useParams();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [myId, setMyId] = useState(null);

    useEffect(() => {
        // POPRAWKA NAZWY: Nazywamy to storedId, żeby nie mylić ze stanem
        const storedId = localStorage.getItem("myUserId");

        if (!storedId) {
            window.location.href = "/";
            return;
        }

        // POPRAWKA SKŁADNI: Nawiasy okrągłe () zamiast klamrowych {}
        setMyId(storedId);

        console.log(`Pobieram rozmowę: Ja=${storedId}, Partner=${partnerId}`);

        // Używamy storedId, bo myId (ze stanu) może się jeszcze nie zdążyć ustawić
        fetch(`http://localhost:8080/api/chat/${storedId}/${partnerId}`)
            .then(res => res.json())
            .then(data => {
                console.log("Przyszły wiadomości:", data);
                setMessages(data);
            })
            .catch(error => {
                console.error("Błąd pobierania czatu:", error);
            });

    }, [partnerId]);


    return (
        <div>
            <h2>Rozmowa z ID: {partnerId}</h2>
            <p>Liczba wiadomości: {messages.length}</p>

            {/* SZYBKI PODGLĄD DANYCH (żebyś widziała co przyszło) */}
            <pre>{JSON.stringify(messages, null, 2)}</pre>
        </div>
    );
};

export default ChatPage;