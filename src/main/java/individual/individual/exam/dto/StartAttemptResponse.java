package individual.individual.exam.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StartAttemptResponse {
    private String attemptId;
    private String examTemplateName;
    private int totalTimeMinutes;
    private List<AttemptQuestionView> questions;
}
