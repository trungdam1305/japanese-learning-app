package individual.individual.dashboard.dto;

import individual.individual.user.JlptLevel;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WeakVocabularyItem {
    private String vocabularyId;
    private String word;
    private String meaning;
    private JlptLevel level;
    private Instant lastReviewedAt;
}
