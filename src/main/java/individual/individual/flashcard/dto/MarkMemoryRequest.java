package individual.individual.flashcard.dto;

import individual.individual.flashcard.MemoryStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarkMemoryRequest {

    @NotNull(message = "Vui lòng chọn trạng thái ghi nhớ (MASTERED hoặc NOT_MASTERED)")
    private MemoryStatus status;
}
