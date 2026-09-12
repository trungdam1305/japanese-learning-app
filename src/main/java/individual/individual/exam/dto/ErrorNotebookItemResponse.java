package individual.individual.exam.dto;

import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

/** 1 câu hỏi trong "Sổ tay lỗi sai" — tổng hợp số lần học viên trả lời sai câu này qua các lần thi. */
@Getter
@Builder
public class ErrorNotebookItemResponse {
    private String questionId;
    private String questionText;
    private List<String> options;
    private int correctAnswerIndex;
    private String explanation;
    private int wrongCount;
    private Instant lastWrongAt;
}
