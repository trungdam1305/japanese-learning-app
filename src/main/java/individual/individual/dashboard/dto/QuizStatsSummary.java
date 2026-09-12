package individual.individual.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class QuizStatsSummary {
    private int totalAttempts;
    private double averageScorePercentage;
    private double passRatePercentage;
}
