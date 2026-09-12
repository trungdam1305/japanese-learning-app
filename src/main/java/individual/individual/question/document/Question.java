package individual.individual.question.document;

import individual.individual.question.QuestionStatus;
import individual.individual.user.JlptLevel;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "questions")
public class Question {

    @Id
    private String id;

    private String questionText;

    /** Luôn có đúng 4 phương án, theo thứ tự A/B/C/D. */
    private List<String> options;

    /** Vị trí đáp án đúng trong {@link #options}, 0-3. */
    private int correctAnswerIndex;

    private String explanation;

    @Indexed
    private JlptLevel level;

    @Indexed
    private String category;

    private String audioUrl;

    private String imageUrl;

    @Builder.Default
    private QuestionStatus status = QuestionStatus.ACTIVE;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
