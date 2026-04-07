package com.learntracker.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NoteDTO {

    @NotNull
    private Long resourceId;

    private String content;
}
