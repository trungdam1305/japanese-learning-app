package individual.individual.exam.dto;

import individual.individual.exam.document.AttemptQuestion;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

/** Câu hỏi hiển thị cho học viên khi ĐANG làm bài — không lộ đáp án đúng/giải thích. */
@Getter
@Builder
public class AttemptQuestionView {
    private String questionId;
    private String questionText;
    private List<String> options;
    private String audioUrl;
    private String imageUrl;

    public static AttemptQuestionView from(AttemptQuestion question) {
        return AttemptQuestionView.builder()
                .questionId(question.getQuestionId())
                .questionText(question.getQuestionText())
                .options(question.getOptions())
                .audioUrl(question.getAudioUrl())
                .imageUrl(question.getImageUrl())
                .build();
    }
}
