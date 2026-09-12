package individual.individual.exam.dto;

import individual.individual.exam.document.ExamTemplate;
import individual.individual.user.JlptLevel;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExamListItemResponse {
    private String id;
    private String name;
    private JlptLevel level;
    private String category;
    private int numberOfQuestions;
    private int totalTimeMinutes;
    private int passingScorePercentage;

    public static ExamListItemResponse from(ExamTemplate template) {
        return ExamListItemResponse.builder()
                .id(template.getId())
                .name(template.getName())
                .level(template.getLevel())
                .category(template.getCategory())
                .numberOfQuestions(template.getNumberOfQuestions())
                .totalTimeMinutes(template.getTotalTimeMinutes())
                .passingScorePercentage(template.getPassingScorePercentage())
                .build();
    }
}
