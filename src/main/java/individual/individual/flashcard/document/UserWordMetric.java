package individual.individual.flashcard.document;

import individual.individual.flashcard.MemoryStatus;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

/** Trạng thái ghi nhớ của 1 học viên với 1 từ vựng (bảng user_word_metrics trong tài liệu). */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_word_metrics")
@CompoundIndex(name = "student_vocabulary_unique", def = "{'studentId': 1, 'vocabularyId': 1}", unique = true)
public class UserWordMetric {

    @Id
    private String id;

    private String studentId;

    private String vocabularyId;

    private MemoryStatus status;

    private Instant lastReviewedAt;
}
