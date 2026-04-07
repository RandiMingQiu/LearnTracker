package com.learntracker.controller;

import com.learntracker.common.result.Result;
import com.learntracker.dto.NoteDTO;
import com.learntracker.entity.Note;
import com.learntracker.repository.NoteRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/note")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @PostMapping
    public Result<?> create(@RequestBody @Valid NoteDTO dto) {
        Note note = new Note();
        note.setResourceId(dto.getResourceId());
        note.setContent(dto.getContent());
        noteRepository.save(note);
        return Result.success();
    }

    @GetMapping("/resource/{resourceId}")
    public Result<List<Note>> list(@PathVariable Long resourceId) {
        return Result.success(noteRepository.findByResourceId(resourceId));
    }

    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Long id, @RequestBody NoteDTO dto) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("笔记不存在"));

        note.setContent(dto.getContent());
        noteRepository.save(note);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        noteRepository.deleteById(id);
        return Result.success();
    }
}
