# 🎓 UsosMatch


> Aplikacja randkowo dla studentów, oparta o algorytmy dopasowania grafiku zajęć.

![Java](https://img.shields.io/badge/Backend-Java_17_%7C_Spring_Boot-007396?logo=java)
![React](https://img.shields.io/badge/Frontend-React_18_%7C_Vite-61DAFB?logo=react)
![Database](https://img.shields.io/badge/Database-H2_(File_Based)-orange?logo=h2)
![Security](https://img.shields.io/badge/Security-Spring_Security_%7C_BCrypt-green?logo=springsecurity)

---

## 💡 O Projekcie

**UsosMatch** to odpowiedź na odwieczny problem studencki: *"Kto ma czas w ten wtorek o 11:30?"*. Aplikacja pozwala znaleźć partnera do projektu, nauki lub randki, analizując "dziury" w planie zajęć (tzw. okienka).

Aplikacja działa w architekturze **Fullstack Monorepo**, z silnym naciskiem na **algorytmikę czasu**.

---

## 🔥 Kluczowe Funkcjonalności

### 1. 📅 Algorytm dodawania czasu 
Aplikacja pozwala na dodawanie własnoręcznie okienek, ale również daje możliwość skopiowania pliku z USOSa.
*   **Import plików `.ics`:** System parsuje kalendarz (biblioteka `Biweekly`), ignoruje zajęcia i automatycznie wylicza wolne sloty w godzinach "życia studenckiego" (10:00 - 22:00).
*   **Wykrywanie Kolizji:** Blokada dodawania nakładających się terminów.
*   **Łatwa manipulacja:** Użytkownik może w prosty sposób edytować i dodawać nowe okienka

### 2. ❤️ Algorytm Matchowania
Backendowy silnik oblicza **Compatibility Score**  na podstawie:
*   Wspólnych okienek czasowych.
*   Wspólnych zainteresowań.
*   Zgodności preferencji.

### 3. 🛡️ Bezpieczeństwo i Dane
*   **H2 File-Based:** Baza danych działa bez instalacji serwera SQL, ale **zachowuje dane na dysku** po restarcie aplikacji.
*   **Szyfrowanie Haseł:** Wszystkie hasła są hashowane algorytmem **BCrypt**.
*   **CORS & Validation:** Pełne zabezpieczenie API przed błędnymi danymi.

### 4. 🎨 Nowoczesny Frontend (React SPA)
*   Interfejs przypominający aplikację mobilną.
*   **Live Chat Simulation:** Czat odświeżany w czasie rzeczywistym.

---

## 🛠️ Stack Technologiczny

| Warstwa | Technologie |
| :--- | :--- |
| **Backend** | Java 17+, Spring Boot 3, Spring Data JPA, Spring Security |
| **Frontend** | React.js |
| **Baza Danych** | H2 Database |


---

## 👥 Autorzy

Projekt wykonany przez:
*   **Rozalia Mitkowska, Kamil Pawelczak** - *Backend & DevOps*
*   **Rozalia Mitkowska, Kamil Pawelczak** - *Frontend Logic & Features*

---
