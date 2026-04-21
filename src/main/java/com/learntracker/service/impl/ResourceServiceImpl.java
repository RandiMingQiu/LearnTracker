package com.learntracker.service.impl;

import com.learntracker.entity.StatusEnum;
import com.learntracker.dto.ResourceDTO;
import com.learntracker.entity.Resource;
import com.learntracker.entity.Tag;
import com.learntracker.repository.ResourceRepository;
import com.learntracker.repository.TagRepository;
import com.learntracker.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private TagRepository tagRepository;

    @Override
    public void create(ResourceDTO dto) {
        Resource resource = new Resource();
        resource.setTitle(dto.getTitle());
        resource.setDescription(dto.getDescription());
        resource.setType(dto.getType());
        resource.setUrl(dto.getUrl());
        resource.setCreateTime(LocalDateTime.now());
        resource.setUpdateTime(LocalDateTime.now());

        // ====================== 新增默认值赋值 ======================
        // 优先用前端传过来的状态，如果前端没传，默认设置为 TODO 待学习
        if(dto.getStatus() != null){
            // 字符串转枚举
            resource.setStatus(StatusEnum.valueOf(dto.getStatus()));
        }else{
            // 默认状态：待学习
            resource.setStatus(StatusEnum.TODO);
        }


        if (dto.getTagIds() != null) {
            List<Tag> tags = tagRepository.findAllById(dto.getTagIds());
            resource.setTags(tags);
        }

        resourceRepository.save(resource);
    }

    @Override
    public void update(Long id, ResourceDTO dto) {

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("资源不存在"));

        resource.setTitle(dto.getTitle());
        resource.setDescription(dto.getDescription());
        resource.setType(dto.getType());
        resource.setUrl(dto.getUrl());
        resource.setUpdateTime(LocalDateTime.now());

        resourceRepository.save(resource);
    }

    @Override
    public void delete(Long id) {
        resourceRepository.deleteById(id);
    }

    @Override
    public Page<?> page(int page, int size, String status, Long tagId) {

        Pageable pageable = PageRequest.of(page - 1, size);

        if (tagId != null) {
            return resourceRepository.findByTagId(tagId, pageable);
        }

        if (status != null) {
            return resourceRepository.findByStatus(status, pageable);
        }

        return resourceRepository.findAll(pageable);
    }

    @Override
    public Resource getById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("资源不存在"));
    }

    @Override
    public Resource detail(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("资源不存在"));
    }

}
