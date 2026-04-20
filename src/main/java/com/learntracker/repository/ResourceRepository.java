package com.learntracker.repository;

import org.springframework.data.jpa.repository.Query;
import com.learntracker.entity.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    @Query("SELECT r FROM Resource r JOIN r.tags t WHERE t.id = :tagId")
    Page<Resource> findByTagId(Long tagId, Pageable pageable);
    Page<Resource> findByStatus(String status, Pageable pageable);
}
