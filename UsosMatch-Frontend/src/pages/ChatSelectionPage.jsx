import { MessageCircle } from 'lucide-react'; // Zaimportujmy ikonkę, żeby było ładnie

const ChatSelectionPage = () => {
    return (
        <div style={styles.container}> // Tworzymy główne pudełko "kontener"
            <MessageCircle size={64} color="#ccc" /> // Rysujemy ikonkę (64 piksele, kolor jasnoszary)
            <h2 style={{ marginTop: '20px', color: '#555' }}>Twoje wiadomości</h2> //Tworzymy nagłowek, dodajemy odstęp od góry
            <p>Wybierz osobę z listy po lewej stronie, aby rozpocząć rozmowę.</p> // Zwykły akapit tekstu
        </div> // Zamykamy nawias return, koniec definicji przepisu
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        marginTop: '100px'
    }
}; // jest to obiekt JavaScript, słownik (żeby nie śmiecić na górze)

export default ChatSelectionPage;