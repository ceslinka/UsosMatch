package com.usosmatch.backend.service;

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

}
