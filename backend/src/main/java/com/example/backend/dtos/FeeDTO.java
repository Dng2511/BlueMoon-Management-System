package com.example.backend.dtos;

import com.example.backend.models.Fee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeeDTO {
    Long id;
    String type;
    Integer amount;
    String month;
    String description;

    public static FeeDTO fromEntity(Fee f) {
        return new FeeDTO(
                f.getId(),
                f.getType(),
                f.getAmount(),
                f.getYear() + "-" + String.format("%02d", f.getMonth()),
                f.getDescription()
        );
    }
}
