package individual.individual.exam.dto;

import individual.individual.exam.document.AttemptQuestion;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

/** Câu hỏi hiển thị SAU khi nộp bài — lộ đáp án đúng, đáp án đã chọn và giải thích. */
@Getter
@Builder
public class AttemptQuestionReview {
    private String questionId;
    private String questionText;
    private List<String> options;
    private int correctAnswerIndex;
    private Integer selectedAnswerIndex;
    private String explanation;
    private String audioUrl;
    private String imageUrl;

    public static AttemptQuestionReview from(AttemptQuestion question) {
        return AttemptQuestionReview.builder()
                .questionId(question.getQuestionId())
                .questionText(question.getQuestionText())
                .options(question.getOptions())
                .correctAnswerIndex(question.getCorrectAnswerIndex())
                .selectedAnswerIndex(question.getSelectedAnswerIndex())
                .explanation(question.getExplanation())
                .audioUrl(question.getAudioUrl())
                .imageUrl(question.getImageUrl())
                .build();
    }
}
