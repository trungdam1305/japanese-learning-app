package individual.individual.flashcard.dto;

import individual.individual.user.JlptLevel;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

/** Bộ thẻ của 1 trình độ + chỉ số tiến độ ghi nhớ dùng cho thanh phần trăm trên màn hình cá nhân. */
@Getter
@Builder
public class FlashcardDeckResponse {
    private JlptLevel level;
    private int totalCount;
    private int masteredCount;
    private int progressPercent;
    private List<FlashcardItem> cards;
}
