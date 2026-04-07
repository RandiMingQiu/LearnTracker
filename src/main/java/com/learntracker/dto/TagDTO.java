package com.learntracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TagDTO {

    @NotBlank
    private String name;
}
