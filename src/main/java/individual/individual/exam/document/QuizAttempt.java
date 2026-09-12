package individual.individual.exam.document;

import individual.individual.exam.QuizAttemptStatus;
import individual.individual.user.JlptLevel;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quiz_attempts")
public class QuizAttempt {

    @Id
    private String id;

    @Indexed
    private String studentId;

    private String examTemplateId;

    private String examTemplateName;

    private JlptLevel level;

    private int passingScorePercentage;

    private List<AttemptQuestion> questions;

    private QuizAttemptStatus status;

    private Instant startedAt;

    private Instant submittedAt;

    private Long timeTakenSeconds;

    private Integer score;

    private Integer totalQuestions;

    private Double scorePercentage;

    private Boolean passed;
}
