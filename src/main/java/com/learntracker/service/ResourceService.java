package com.learntracker.service;

import com.learntracker.dto.ResourceDTO;
import com.learntracker.entity.Resource;
import org.springframework.data.domain.Page;

public interface ResourceService {

    void create(ResourceDTO dto);

    void update(Long id, ResourceDTO dto);

    void delete(Long id);

    // 🔥 分页（带 tag 筛选）
    Page<?> page(int page, int size, String status, Long tagId);

    // 🔥 详情接口（新增）
    Resource detail(Long id);
    Resource getById(Long id);
}
