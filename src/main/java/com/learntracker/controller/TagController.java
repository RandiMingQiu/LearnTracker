package com.learntracker.controller;

import com.learntracker.common.result.Result;
import com.learntracker.dto.TagDTO;
import com.learntracker.entity.Tag;
import com.learntracker.repository.TagRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tag")
public class TagController {

    @Autowired
    private TagRepository tagRepository;

    @PostMapping
    public Result<?> create(@RequestBody @Valid TagDTO dto) {
        Tag tag = new Tag();
        tag.setName(dto.getName());
        tagRepository.save(tag);
        return Result.success();
    }

    @GetMapping
    public Result<List<Tag>> list() {
        return Result.success(tagRepository.findAll());
    }

    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Long id, @RequestBody TagDTO dto) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("标签不存在"));

        tag.setName(dto.getName());
        tagRepository.save(tag);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        tagRepository.deleteById(id);
        return Result.success();
    }
}