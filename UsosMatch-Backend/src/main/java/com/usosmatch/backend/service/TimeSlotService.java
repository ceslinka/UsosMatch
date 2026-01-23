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

    // --- IMPORT Z PLIKU .ICS ---
    public void importFromIcs(MultipartFile file, Long userId) throws IOException {
        System.out.println("📂 [ICS] Start importu dla ID: " + userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono usera"));

        // Pobieramy OBECNY grafik (żeby nie dodać duplikatów)
        List<TimeSlot> currentSchedule = user.getSchedule();

        ICalendar ical = Biweekly.parse(file.getInputStream()).first();
        if (ical == null) throw new RuntimeException("Plik uszkodzony/pusty");

        List<VEvent> events = ical.getEvents();
        if (events.isEmpty()) return;

        LocalTime DAY_START = LocalTime.of(10, 0);
        LocalTime DAY_END = LocalTime.of(22, 0);

        // Mapowanie zajęć USOS
        Map<DayOfWeek, List<LocalTime[]>> busySlotsByDay = events.stream()
                .map(event -> {
                    if (event.getDateStart() == null) return null;
                    try {
                        LocalDateTime start = event.getDateStart().getValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                        LocalDateTime end;
                        if (event.getDateEnd() != null) end = event.getDateEnd().getValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                        else end = start.plusMinutes(90);
                        return new Object[]{ convertDay(start.getDayOfWeek()), start.toLocalTime(), end.toLocalTime() };
                    } catch (Exception e) { return null; }
                })
                .filter(obj -> obj != null)
                .collect(Collectors.groupingBy(arr -> (DayOfWeek) arr[0], Collectors.mapping(arr -> new LocalTime[]{(LocalTime) arr[1], (LocalTime) arr[2]}, Collectors.toList())));

        // Algorytm szukania dziur
        List<TimeSlot> calculatedFreeSlots = new ArrayList<>();

        for (DayOfWeek day : DayOfWeek.values()) {
            List<LocalTime[]> classes = busySlotsByDay.getOrDefault(day, new ArrayList<>());
            classes.sort(Comparator.comparing(arr -> arr[0]));

            LocalTime pointer = DAY_START;

            for (LocalTime[] classTime : classes) {
                LocalTime classStart = classTime[0];
                LocalTime classEnd = classTime[1];

                if (classEnd.isBefore(DAY_START)) continue;
                if (classStart.isAfter(DAY_END)) break;

                // Znaleziono dziurę (okienko)
                if (pointer.isBefore(classStart)) {
                    // Minimalny czas okienka = 30 minut
                    if (java.time.Duration.between(pointer, classStart).toMinutes() >= 30) {
                        LocalTime gapEnd = classStart.isAfter(DAY_END) ? DAY_END : classStart;
                        calculatedFreeSlots.add(new TimeSlot(day, pointer, gapEnd, true, user));
                    }
                }
                if (classEnd.isAfter(pointer)) pointer = classEnd;
            }

            // Dziura wieczorna (po zajęciach do 22:00)
            if (pointer.isBefore(DAY_END)) {
                if (java.time.Duration.between(pointer, DAY_END).toMinutes() >= 30) {
                    calculatedFreeSlots.add(new TimeSlot(day, pointer, DAY_END, true, user));
                }
            }
        }

        // --- 🔥 TUTAJ ZACHODZI NAPRAWA DUPLIKATÓW ---
        List<TimeSlot> slotsToSave = new ArrayList<>();

        for (TimeSlot newSlot : calculatedFreeSlots) {
            boolean isCollision = false;

            // Sprawdzamy, czy to nowe okienko nie nakłada się na to, co JUŻ MAMY w bazie
            for (TimeSlot oldSlot : currentSchedule) {
                if (oldSlot.overlaps(newSlot)) {
                    isCollision = true;
                    // Możesz odkomentować log, żeby widzieć co się odrzuca
                    // System.out.println("⛔ Odrzucam duplikat: " + newSlot.getDayOfWeek());
                    break;
                }
            }

            if (!isCollision) {
                slotsToSave.add(newSlot);
            }
        }

        // Zapisujemy TYLKO te unikalne
        if (!slotsToSave.isEmpty()) {
            timeSlotRepository.saveAll(slotsToSave);
            System.out.println("💾 Zapisano " + slotsToSave.size() + " nowych okienek.");
        } else {
            System.out.println("✨ Brak nowych okienek (wszystkie terminy były już dodane).");
        }
    }

    private DayOfWeek convertDay(java.time.DayOfWeek javaDay) {
        return DayOfWeek.valueOf(javaDay.name());
    }
}