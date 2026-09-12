package individual.individual.flashcard;

import individual.individual.common.exception.NotFoundException;
import individual.individual.flashcard.document.UserWordMetric;
import individual.individual.flashcard.dto.FlashcardDeckResponse;
import individual.individual.flashcard.dto.FlashcardItem;
import individual.individual.user.JlptLevel;
import individual.individual.vocabulary.VocabularyRepository;
import individual.individual.vocabulary.document.Vocabulary;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final VocabularyRepository vocabularyRepository;
    private final UserWordMetricRepository userWordMetricRepository;

    /** studentId null = khách chưa đăng nhập, xem được thẻ nhưng không có trạng thái ghi nhớ cá nhân. */
    public FlashcardDeckResponse getDeck(String studentId, JlptLevel level) {
        List<Vocabulary> vocabularies = vocabularyRepository.findByLevelOrderByWordAsc(level);
        Map<String, MemoryStatus> statusByVocabularyId = studentId == null
                ? Map.of()
                : userWordMetricRepository.findByStudentId(studentId).stream()
                        .collect(Collectors.toMap(UserWordMetric::getVocabularyId, UserWordMetric::getStatus, (a, b) -> b));

        List<FlashcardItem> cards = vocabularies.stream()
                .map(vocabulary -> FlashcardItem.of(vocabulary, statusByVocabularyId.get(vocabulary.getId())))
                .toList();

        int masteredCount = (int) cards.stream()
                .filter(card -> card.getMemoryStatus() == MemoryStatus.MASTERED)
                .count();

        return FlashcardDeckResponse.builder()
                .level(level)
                .totalCount(cards.size())
                .masteredCount(masteredCount)
                .progressPercent(cards.isEmpty() ? 0 : Math.round(masteredCount * 100f / cards.size()))
                .cards(cards)
                .build();
    }

    public FlashcardItem markMemoryStatus(String studentId, String vocabularyId, MemoryStatus status) {
        Vocabulary vocabulary = vocabularyRepository.findById(vocabularyId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy từ vựng"));

        UserWordMetric metric = userWordMetricRepository
                .findByStudentIdAndVocabularyId(studentId, vocabularyId)
                .orElseGet(() -> UserWordMetric.builder()
                        .studentId(studentId)
                        .vocabularyId(vocabularyId)
                        .build());
        metric.setStatus(status);
        metric.setLastReviewedAt(Instant.now());
        userWordMetricRepository.save(metric);

        return FlashcardItem.of(vocabulary, status);
    }

    /** Tiến độ ghi nhớ theo từng trình độ, phục vụ thanh phần trăm trên Dashboard cá nhân. */
    public List<FlashcardDeckResponse> getProgressSummary(String studentId) {
        Map<String, MemoryStatus> statusByVocabularyId = userWordMetricRepository.findByStudentId(studentId).stream()
                .collect(Collectors.toMap(UserWordMetric::getVocabularyId, UserWordMetric::getStatus, (a, b) -> b));

        return Arrays.stream(JlptLevel.values())
                .map(level -> summaryForLevel(level, statusByVocabularyId))
                .toList();
    }

    private FlashcardDeckResponse summaryForLevel(JlptLevel level, Map<String, MemoryStatus> statusByVocabularyId) {
        List<String> vocabularyIds = vocabularyRepository.findByLevelOrderByWordAsc(level).stream()
                .map(Vocabulary::getId)
                .toList();
        int masteredCount = (int) vocabularyIds.stream()
                .map(statusByVocabularyId::get)
                .filter(status -> status == MemoryStatus.MASTERED)
                .count();

        return FlashcardDeckResponse.builder()
                .level(level)
                .totalCount(vocabularyIds.size())
                .masteredCount(masteredCount)
                .progressPercent(vocabularyIds.isEmpty() ? 0 : Math.round(masteredCount * 100f / vocabularyIds.size()))
                .cards(List.of())
                .build();
    }
}
