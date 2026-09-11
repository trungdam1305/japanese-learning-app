package individual.individual.vocabulary.dto;

import individual.individual.user.JlptLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VocabularyRequest {

    @NotBlank(message = "Từ vựng/Kanji không được để trống")
    @Size(min = 1, max = 50, message = "Từ vựng/Kanji phải từ 1-50 ký tự")
    private String word;

    @NotBlank(message = "Nghĩa tiếng Việt không được để trống")
    private String meaning;

    @NotNull(message = "Vui lòng chọn trình độ (N5 hoặc N4)")
    private JlptLevel level;

    private String audioUrl;

    private String exampleSentence;
}
