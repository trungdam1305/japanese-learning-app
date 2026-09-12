package individual.individual.dashboard.dto;

import individual.individual.exam.dto.AttemptHistoryItemResponse;
import individual.individual.flashcard.dto.FlashcardDeckResponse;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardSummaryResponse {
    private int streakCount;
    private int rankPoints;
    private List<FlashcardDeckResponse> flashcardProgress;
    private QuizStatsSummary quizStats;
    private List<AttemptHistoryItemResponse> recentAttempts;
    private List<WeakVocabularyItem> weakVocabulary;
}
