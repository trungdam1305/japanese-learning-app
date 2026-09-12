package individual.individual.exam.dto;

import individual.individual.exam.ExamTemplateStatus;
import individual.individual.exam.document.ExamTemplate;
import individual.individual.user.JlptLevel;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExamTemplateResponse {
    private String id;
    private String name;
    private JlptLevel level;
    private String category;
    private int numberOfQuestions;
    private int totalTimeMinutes;
    private int passingScorePercentage;
    private boolean shuffleQuestions;
    private ExamTemplateStatus status;
    private Instant createdAt;

    public static ExamTemplateResponse from(ExamTemplate template) {
        return ExamTemplateResponse.builder()
                .id(template.getId())
                .name(template.getName())
                .level(template.getLevel())
                .category(template.getCategory())
                .numberOfQuestions(template.getNumberOfQuestions())
                .totalTimeMinutes(template.getTotalTimeMinutes())
                .passingScorePercentage(template.getPassingScorePercentage())
                .shuffleQuestions(template.isShuffleQuestions())
                .status(template.getStatus())
                .createdAt(template.getCreatedAt())
                .build();
    }
}
