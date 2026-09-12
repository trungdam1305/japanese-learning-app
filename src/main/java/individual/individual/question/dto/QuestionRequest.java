package individual.individual.question.dto;

import individual.individual.user.JlptLevel;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionRequest {

    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    private String questionText;

    @NotEmpty(message = "Câu hỏi phải có đúng 4 phương án trả lời")
    @Size(min = 4, max = 4, message = "Câu hỏi phải có đúng 4 phương án trả lời")
    private List<@NotBlank(message = "Phương án trả lời không được để trống") String> options;

    @Min(value = 0, message = "Đáp án đúng phải là chỉ số từ 0-3")
    @Max(value = 3, message = "Đáp án đúng phải là chỉ số từ 0-3")
    private int correctAnswerIndex;

    private String explanation;

    @NotNull(message = "Vui lòng chọn trình độ (N5 hoặc N4)")
    private JlptLevel level;

    @NotBlank(message = "Vui lòng chọn danh mục câu hỏi")
    private String category;

    private String audioUrl;

    private String imageUrl;
}
