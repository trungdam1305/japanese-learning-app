package individual.individual.question.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

/** Kết quả đọc trước file Excel: 10 dòng đầu tiên + các lỗi phát hiện được (A2). */
@Getter
@Builder
public class ImportPreviewResponse {
    private int totalRows;
    private List<QuestionRequest> previewRows;
    private List<ImportRowError> errors;
}
