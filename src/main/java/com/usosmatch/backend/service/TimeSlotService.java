package com.usosmatch.backend.service;
import com.usosmatch.backend.model.User;
import com.usosmatch.backend.model.TimeSlot;
import com.usosmatch.backend.repository.TimeSlotRepository;
import com.usosmatch.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class TimeSlotService {
    private final UserRepository userRepository;
    private final TimeSlotRepository timeSlotRepository;
    public TimeSlotService(UserRepository userRepository, TimeSlotRepository timeSlotRepository) {
        this.userRepository = userRepository;
        this.timeSlotRepository = timeSlotRepository;
    }
    public TimeSlot addTimeSlot(TimeSlot timeSlot, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Nie ma takiego usera"));

        if (!timeSlot.getEndTime().isAfter(timeSlot.getStartTime())) {
            throw new RuntimeException("Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia!");
        }

        for (TimeSlot existingSlot : user.getSchedule()) {
            if (existingSlot.overlaps(timeSlot)) {
                // Jeśli jest kolizja, rzucamy błąd i przerywamy dodawanie!
                throw new RuntimeException("Masz już zajęcia w tym czasie ("
                        + existingSlot.getDayOfWeek() + " " + existingSlot.getStartTime() + "-" + existingSlot.getEndTime() +")");
            }
        }

        timeSlot.setUser(user);
        return timeSlotRepository.save(timeSlot);

    }
    public void deleteTimeSlot(Long timeSlotId) {
        timeSlotRepository.deleteById(timeSlotId);
    }


}
