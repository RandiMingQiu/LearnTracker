package com.learntracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ResourceDTO {
    @NotBlank(message = "标题不能为空")
    private String title;

    private String description;

    @NotBlank(message = "类型不能为空")
    private String type;

    @NotBlank(message = "URL不能为空")
    private String url;

    private String status; // 依旧用String接收前端字符串，后端转枚举

    private List<Long> tagIds;
}
