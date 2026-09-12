package individual.individual.exam.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitAttemptRequest {

    @NotNull
    private List<@Valid AnswerSubmission> answers;
}
