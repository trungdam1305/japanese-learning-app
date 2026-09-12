package individual.individual.question.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ImportRowError {
    /** Số dòng trong file Excel (tính cả dòng tiêu đề). */
    private int row;
    private String message;
}
