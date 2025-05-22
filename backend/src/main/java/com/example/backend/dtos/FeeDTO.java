package com.example.backend.dtos;

import com.example.backend.models.Fee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeeDTO {
    private Long id;
    private String type;
    private Integer amount;
    private String month;
    private String description;
    private boolean compulsory;

    public static FeeDTO fromEntity(Fee f) {
        return new FeeDTO(
                f.getId(),
                f.getType(),
                f.getAmount(),
                f.getYear() + "-" + String.format("%02d", f.getMonth()),
                f.getDescription(),
                f.isCompulsory()
        );
    }
}
