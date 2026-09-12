package individual.individual.question.dto;

import individual.individual.question.QuestionStatus;
import individual.individual.question.document.Question;
import individual.individual.user.JlptLevel;
import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class QuestionResponse {
    private String id;
    private String questionText;
    private List<String> options;
    private int correctAnswerIndex;
    private String explanation;
    private JlptLevel level;
    private String category;
    private String audioUrl;
    private String imageUrl;
    private QuestionStatus status;
    private Instant createdAt;

    public static QuestionResponse from(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .options(question.getOptions())
                .correctAnswerIndex(question.getCorrectAnswerIndex())
                .explanation(question.getExplanation())
                .level(question.getLevel())
                .category(question.getCategory())
                .audioUrl(question.getAudioUrl())
                .imageUrl(question.getImageUrl())
                .status(question.getStatus())
                .createdAt(question.getCreatedAt())
                .build();
    }
}
