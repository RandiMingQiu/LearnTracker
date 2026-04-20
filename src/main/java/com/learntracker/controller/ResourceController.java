package com.learntracker.controller;

import com.learntracker.common.result.Result;
import com.learntracker.dto.ResourceDTO;
import com.learntracker.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.learntracker.entity.Resource;

@RestController
@RequestMapping("/resource")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @PostMapping
    public Result<?> create(@RequestBody @Valid ResourceDTO dto) {
        resourceService.create(dto);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Long id, @RequestBody @Valid ResourceDTO dto) {
        resourceService.update(id, dto);
        return Result.success();
    }

    @GetMapping("/{id}")
    public Result<Resource> detail(@PathVariable Long id) {
        return Result.success(resourceService.detail(id));
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        resourceService.delete(id);
        return Result.success();
    }


    @GetMapping("/page")
    public Result<?> page(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long tagId
    ) {
        return Result.success(resourceService.page(page, size, status, tagId));
    }
}
