package individual.individual.exam.document;

import individual.individual.exam.ExamTemplateStatus;
import individual.individual.user.JlptLevel;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Cấu hình một đề thi/quiz (A2). Câu hỏi KHÔNG được ghim cố định — mỗi lượt học viên bắt đầu làm
 * bài, hệ thống chọn ngẫu nhiên đủ số lượng câu hỏi ACTIVE khớp level/category từ ngân hàng câu hỏi.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "exam_templates")
public class ExamTemplate {

    @Id
    private String id;

    private String name;

    private JlptLevel level;

    /** Null/blank = lấy câu hỏi từ mọi danh mục thuộc level này. */
    private String category;

    private int numberOfQuestions;

    private int totalTimeMinutes;

    private int passingScorePercentage;

    private boolean shuffleQuestions;

    @Builder.Default
    private ExamTemplateStatus status = ExamTemplateStatus.ACTIVE;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
