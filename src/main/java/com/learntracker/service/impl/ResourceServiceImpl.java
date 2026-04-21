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

    @Override//新建资源
    public void create(ResourceDTO dto) {
        Resource resource = new Resource();
        resource.setTitle(dto.getTitle());//标题
        resource.setDescription(dto.getDescription());//描述
        resource.setType(dto.getType());//类型
        resource.setUrl(dto.getUrl());
        resource.setCreateTime(LocalDateTime.now());//创建时间
        resource.setUpdateTime(LocalDateTime.now());//更新时间

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

    @Override//修改资源
    public void update(Long id, ResourceDTO dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("资源不存在"));

        resource.setTitle(dto.getTitle());
        resource.setDescription(dto.getDescription());
        resource.setType(dto.getType());
        resource.setUrl(dto.getUrl());

        if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            // 字符串 转 枚举
            resource.setStatus(StatusEnum.valueOf(dto.getStatus()));
        }

        resource.setUpdateTime(LocalDateTime.now());

        // 可选：如果要同时修改标签，打开下面这段
        if (dto.getTagIds() != null) {
            List<Tag> tags = tagRepository.findAllById(dto.getTagIds());
            resource.setTags(tags);
        }

        resourceRepository.save(resource);
    }

    @Override//删除资源
    public void delete(Long id) {
        resourceRepository.deleteById(id);
    }

    @Override
    public Page<Resource> page(Integer page, Integer size, StatusEnum status, Long tagId) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Resource> resourcePage;

        if (status != null && tagId != null) {
            resourcePage = resourceRepository.findByStatusAndTags_Id(status, tagId, pageable);
        } else if (status != null) {
            resourcePage = resourceRepository.findByStatus(status, pageable);
        } else if (tagId != null) {
            resourcePage = resourceRepository.findByTagId(tagId, pageable);
        } else {
            resourcePage = resourceRepository.findAll(pageable);
        }

        return resourcePage;
    }

    @Override//查询搜索
    public Resource getById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("资源不存在"));
    }

    @Override//查询详情
    public Resource detail(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("资源不存在"));
    }

}
