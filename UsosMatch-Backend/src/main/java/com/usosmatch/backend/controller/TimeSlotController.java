package com.usosmatch.backend.controller;

import com.usosmatch.backend.model.TimeSlot;
import com.usosmatch.backend.service.TimeSlotService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public void uploadSchedule(@RequestParam("file") MultipartFile file, @RequestParam Long userId) {
        try {
            timeSlotService.importFromIcs(file, userId);
        } catch (IOException e) {
            throw new RuntimeException("Błąd odczytu pliku kalendarza");
        }
    }

}
