package individual.individual.flashcard.dto;

import individual.individual.flashcard.MemoryStatus;
import individual.individual.user.JlptLevel;
import individual.individual.vocabulary.document.Vocabulary;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FlashcardItem {
    private String vocabularyId;
    private String word;
    private String meaning;
    private JlptLevel level;
    private String audioUrl;
    private String exampleSentence;
    /** null = học viên chưa đánh dấu thẻ này lần nào. */
    private MemoryStatus memoryStatus;

    public static FlashcardItem of(Vocabulary vocabulary, MemoryStatus status) {
        return FlashcardItem.builder()
                .vocabularyId(vocabulary.getId())
                .word(vocabulary.getWord())
                .meaning(vocabulary.getMeaning())
                .level(vocabulary.getLevel())
                .audioUrl(vocabulary.getAudioUrl())
                .exampleSentence(vocabulary.getExampleSentence())
                .memoryStatus(status)
                .build();
    }
}
