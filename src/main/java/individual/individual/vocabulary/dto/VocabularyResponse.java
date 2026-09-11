package individual.individual.vocabulary.dto;

import individual.individual.user.JlptLevel;
import individual.individual.vocabulary.document.Vocabulary;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VocabularyResponse {
    private String id;
    private String word;
    private String meaning;
    private JlptLevel level;
    private String audioUrl;
    private String exampleSentence;

    public static VocabularyResponse from(Vocabulary vocabulary) {
        return VocabularyResponse.builder()
                .id(vocabulary.getId())
                .word(vocabulary.getWord())
                .meaning(vocabulary.getMeaning())
                .level(vocabulary.getLevel())
                .audioUrl(vocabulary.getAudioUrl())
                .exampleSentence(vocabulary.getExampleSentence())
                .build();
    }
}
