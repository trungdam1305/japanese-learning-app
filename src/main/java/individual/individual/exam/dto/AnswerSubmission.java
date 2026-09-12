package individual.individual.exam.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerSubmission {

    @NotBlank(message = "Thiếu questionId")
    private String questionId;

    /** Null nếu học viên bỏ qua câu này. */
    private Integer selectedAnswerIndex;
}
