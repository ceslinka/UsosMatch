package com.usosmatch.backend.controller;

import com.usosmatch.backend.model.TimeSlot;
import com.usosmatch.backend.service.TimeSlotService;
import org.springframework.web.bind.annotation.*;

@RestController // rest bo odsyła czyste dane JSON
@RequestMapping("/api/timeslots")
public class TimeSlotController {
    private final TimeSlotService timeSlotService; //Uniemożliwienie modyfikacji
    public TimeSlotController(TimeSlotService timeSlotService){
        this.timeSlotService = timeSlotService;
    }
    @PostMapping
    public TimeSlot addTimeSlot(@RequestBody TimeSlot timeSlot, @RequestParam Long userId ) {
        return timeSlotService.addTimeSlot(timeSlot, userId);
    }
    @DeleteMapping("/{id}")
    public void deleteTimeSlot(@PathVariable Long id){
        timeSlotService.deleteTimeSlot(id);
    }
}
