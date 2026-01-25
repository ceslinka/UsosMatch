package com.usosmatch.backend.service;

import biweekly.Biweekly;
import biweekly.ICalendar;
import biweekly.component.VEvent;
import com.usosmatch.backend.model.DayOfWeek;
import com.usosmatch.backend.model.TimeSlot;
import com.usosmatch.backend.model.User;
import com.usosmatch.backend.repository.TimeSlotRepository;
import com.usosmatch.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TimeSlotService {
    private final UserRepository userRepository;
    private final TimeSlotRepository timeSlotRepository;

    public TimeSlotService(UserRepository userRepository, TimeSlotRepository timeSlotRepository) {
        this.userRepository = userRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    // Metoda ręcznego dodawania (z zabezpieczeniem)
    public TimeSlot addTimeSlot(TimeSlot timeSlot, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie ma takiego usera"));

        if (!timeSlot.getEndTime().isAfter(timeSlot.getStartTime())) {
            throw new RuntimeException("Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia!");
        }

        // SPRAWDZENIE KOLIZJI
        for (TimeSlot existingSlot : user.getSchedule()) {
            if (existingSlot.overlaps(timeSlot)) {
                throw new RuntimeException("Kolizja! Masz już okienko w tym czasie (" +
                        existingSlot.getDayOfWeek() + " " + existingSlot.getStartTime() + ")");
            }
        }

        timeSlot.setUser(user);
        return timeSlotRepository.save(timeSlot);
    }

    public void deleteTimeSlot(Long timeSlotId) {
        timeSlotRepository.deleteById(timeSlotId);
    }

    // import z pliku ics
    public void importFromIcs(MultipartFile file, Long userId) throws IOException {
        System.out.println("📂 [ICS] Start importu dla ID: " + userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono usera")); // Szukamy użytkownika w bazie

        List<TimeSlot> currentSchedule = user.getSchedule(); // Pobieramy OBECNY grafik (żeby nie dodać duplikatów)

        ICalendar ical = Biweekly.parse(file.getInputStream()).first(); // Czytamy plik ics, wczytujemy do obiektu ical
        if (ical == null) throw new RuntimeException("Plik uszkodzony/pusty");

        List<VEvent> events = ical.getEvents(); // Wyciągamy listę zdarzeń
        if (events.isEmpty()) return;

        LocalTime DAY_START = LocalTime.of(8, 0);
        LocalTime DAY_END = LocalTime.of(23, 0); // definiujemy ramy dnia studenckiego

        // Mapowanie zajęć USOS
        Map<DayOfWeek, List<LocalTime[]>> busySlotsByDay = events.stream() // tworzymy szufladki, gdzie kluczem jest dzieńa wartością lista slotów
                .map(event -> { // bierzemy każde wydarzenie
                    if (event.getDateStart() == null) return null;
                    try {
                        LocalDateTime start = event.getDateStart().getValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                        LocalDateTime end;
                        if (event.getDateEnd() != null) end = event.getDateEnd().getValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                        else end = start.plusMinutes(90); // ustawiamy default czas konca zajęć
                        return new Object[]{ convertDay(start.getDayOfWeek()), start.toLocalTime(), end.toLocalTime() };
                    } catch (Exception e) { return null; }
                })
                .filter(obj -> obj != null) // wyrzucamy puste obiekty
                //grupujemy dniami tygodnia
                .collect(Collectors.groupingBy(arr -> (DayOfWeek) arr[0], Collectors.mapping(arr -> new LocalTime[]{(LocalTime) arr[1], (LocalTime) arr[2]}, Collectors.toList())));

        // Algorytm szukania dziur
        List<TimeSlot> calculatedFreeSlots = new ArrayList<>();

        for (DayOfWeek day : DayOfWeek.values()) { // pętla dla każdego dnia tygodnia
            List<LocalTime[]> classes = busySlotsByDay.getOrDefault(day, new ArrayList<>()); // pobieramy zajęcia dla danego dnia
            classes.sort(Comparator.comparing(arr -> arr[0])); // sortujemy je od rana

            LocalTime pointer = DAY_START; // ustawiamy wskaźnik na początku dnia

            for (LocalTime[] classTime : classes) { // lecimy po kolei przez zajęcia w tym dniu
                LocalTime classStart = classTime[0];
                LocalTime classEnd = classTime[1];

                if (classEnd.isBefore(DAY_START)) continue; // pomijamy zajęcia przed 8
                if (classStart.isAfter(DAY_END)) break; // przerywamy pętle, jeśli zajęcia są za poźno, nie sprawdzamy już nic dalej

                // Znaleziono dziurę (okienko)
                if (pointer.isBefore(classStart)) { // czy wskaźnik jest przed początkiem zajęć?
                    // Minimalny czas okienka = 30 minut
                    if (java.time.Duration.between(pointer, classStart).toMinutes() >= 30) {
                        LocalTime gapEnd = classStart.isAfter(DAY_END) ? DAY_END : classStart; // ucinamy okienko o 23
                        calculatedFreeSlots.add(new TimeSlot(day, pointer, gapEnd, true, user)); // dodajemy wolny slot do listy
                    }
                }
                if (classEnd.isAfter(pointer)) pointer = classEnd;
            }

            // Czy zostało coś wolnego po zajęciach?
            if (pointer.isBefore(DAY_END)) {
                if (java.time.Duration.between(pointer, DAY_END).toMinutes() >= 30) {
                    calculatedFreeSlots.add(new TimeSlot(day, pointer, DAY_END, true, user));
                }
            }
        }

        // naprawa duplikatów
        List<TimeSlot> slotsToSave = new ArrayList<>();

        for (TimeSlot newSlot : calculatedFreeSlots) { // sprawdzamy każdy nowo wyliczony slot
            boolean isCollision = false;

            // Sprawdzamy, czy to nowe okienko nie nakłada się na to, co JUŻ MAMY w bazie
            for (TimeSlot oldSlot : currentSchedule) {
                if (oldSlot.overlaps(newSlot)) { // metoda overlaps z modelu, sprawdzamy czy się nakłada
                    isCollision = true;
                    System.out.println("⛔ Odrzucam duplikat: " + newSlot.getDayOfWeek());
                    break;
                }
            }

            if (!isCollision) {
                slotsToSave.add(newSlot); // zapisujemy
            }
        }

        // Zapisujemy TYLKO te unikalne
        if (!slotsToSave.isEmpty()) {
            timeSlotRepository.saveAll(slotsToSave); // zapisujemy jedną paczką do bazy
            System.out.println("💾 Zapisano " + slotsToSave.size() + " nowych okienek.");
        } else {
            System.out.println("✨ Brak nowych okienek (wszystkie terminy były już dodane).");
        }
    }

    private DayOfWeek convertDay(java.time.DayOfWeek javaDay) {
        return DayOfWeek.valueOf(javaDay.name());
    }
}