package com.learntracker.repository;

import com.learntracker.entity.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    Page<Resource> findByStatus(String status, Pageable pageable);
}
