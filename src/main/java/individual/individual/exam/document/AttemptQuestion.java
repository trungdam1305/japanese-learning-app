package individual.individual.exam.document;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Snapshot của 1 câu hỏi tại thời điểm học viên bắt đầu làm bài — lưu nguyên trạng nội dung/đáp án
 * đúng để lịch sử làm bài không đổi dù ngân hàng câu hỏi gốc sau này bị sửa/xóa.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttemptQuestion {
    private String questionId;
    private String questionText;
    private List<String> options;
    private int correctAnswerIndex;
    private String explanation;
    private String audioUrl;
    private String imageUrl;

    /** Null cho tới khi học viên chọn đáp án / nộp bài. */
    private Integer selectedAnswerIndex;
}
