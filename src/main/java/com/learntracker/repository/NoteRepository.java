package com.learntracker.repository;

import com.learntracker.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByResourceId(Long resourceId);
}
