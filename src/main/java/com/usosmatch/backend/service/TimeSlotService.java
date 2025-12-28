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
        timeSlot.setUser(user);
        return timeSlotRepository.save(timeSlot);

    }
    public void deleteTimeSlot(Long userId) {
        timeSlotRepository.deleteById(userId);
    }
    public void ale_jaja(){}

}
