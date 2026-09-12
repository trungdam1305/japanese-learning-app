package individual.individual.exam.dto;

import individual.individual.user.JlptLevel;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamTemplateRequest {

    @NotBlank(message = "Tên đề thi không được để trống")
    private String name;

    @NotNull(message = "Vui lòng chọn trình độ (N5 hoặc N4)")
    private JlptLevel level;

    /** Bỏ trống = lấy câu hỏi từ mọi danh mục thuộc level. */
    private String category;

    @Min(value = 1, message = "Số lượng câu hỏi phải lớn hơn 0")
    private int numberOfQuestions;

    @Min(value = 1, message = "Thời gian làm bài phải lớn hơn 0 phút")
    private int totalTimeMinutes;

    @Min(value = 0, message = "Điểm đạt phải từ 0-100%")
    @Max(value = 100, message = "Điểm đạt phải từ 0-100%")
    private int passingScorePercentage;

    private boolean shuffleQuestions = true;
}
