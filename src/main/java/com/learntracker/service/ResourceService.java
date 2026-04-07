package com.learntracker.service;

import com.learntracker.dto.ResourceDTO;
import org.springframework.data.domain.Page;

public interface ResourceService {

    void create(ResourceDTO dto);

    void update(Long id, ResourceDTO dto);

    void delete(Long id);

    Page<?> page(int page, int size, String status);
}

