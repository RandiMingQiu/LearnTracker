package com.learntracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ResourceDTO {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String type;

    @NotBlank
    private String url;

    private String status;

    private List<Long> tagIds;
}
