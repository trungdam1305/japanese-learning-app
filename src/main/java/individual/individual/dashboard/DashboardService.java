package individual.individual.dashboard;

import individual.individual.common.exception.NotFoundException;
import individual.individual.dashboard.dto.DashboardSummaryResponse;
import individual.individual.dashboard.dto.QuizStatsSummary;
import individual.individual.dashboard.dto.WeakVocabularyItem;
import individual.individual.exam.QuizAttemptRepository;
import individual.individual.exam.QuizAttemptStatus;
import individual.individual.exam.document.QuizAttempt;
import individual.individual.exam.dto.AttemptHistoryItemResponse;
import individual.individual.flashcard.FlashcardService;
import individual.individual.flashcard.MemoryStatus;
import individual.individual.flashcard.UserWordMetricRepository;
import individual.individual.flashcard.document.UserWordMetric;
import individual.individual.user.StudentUserRepository;
import individual.individual.user.document.StudentUser;
import individual.individual.vocabulary.VocabularyRepository;
import individual.individual.vocabulary.document.Vocabulary;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final int RECENT_ATTEMPTS_LIMIT = 5;
    private static final int WEAK_VOCABULARY_LIMIT = 10;

    private final StudentUserRepository studentUserRepository;
    private final FlashcardService flashcardService;
    private final UserWordMetricRepository userWordMetricRepository;
    private final VocabularyRepository vocabularyRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public DashboardSummaryResponse getSummary(String studentId) {
        StudentUser student = studentUserRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy học viên"));

        List<QuizAttempt> submittedAttempts = quizAttemptRepository
                .findByStudentIdAndStatus(studentId, QuizAttemptStatus.SUBMITTED);

        return DashboardSummaryResponse.builder()
                .streakCount(student.getStreakCount())
                .rankPoints(student.getRankPoints())
                .flashcardProgress(flashcardService.getProgressSummary(studentId))
                .quizStats(buildQuizStats(submittedAttempts))
                .recentAttempts(buildRecentAttempts(submittedAttempts))
                .weakVocabulary(buildWeakVocabulary(studentId))
                .build();
    }

    private QuizStatsSummary buildQuizStats(List<QuizAttempt> attempts) {
        if (attempts.isEmpty()) {
            return QuizStatsSummary.builder()
                    .totalAttempts(0)
                    .averageScorePercentage(0)
                    .passRatePercentage(0)
                    .build();
        }
        double averageScore = attempts.stream().mapToDouble(QuizAttempt::getScorePercentage).average().orElse(0);
        long passedCount = attempts.stream().filter(a -> Boolean.TRUE.equals(a.getPassed())).count();

        return QuizStatsSummary.builder()
                .totalAttempts(attempts.size())
                .averageScorePercentage(averageScore)
                .passRatePercentage(passedCount * 100.0 / attempts.size())
                .build();
    }

    private List<AttemptHistoryItemResponse> buildRecentAttempts(List<QuizAttempt> attempts) {
        return attempts.stream()
                .sorted(Comparator.comparing(QuizAttempt::getSubmittedAt).reversed())
                .limit(RECENT_ATTEMPTS_LIMIT)
                .map(AttemptHistoryItemResponse::from)
                .toList();
    }

    /** Top từ vựng "Chưa thuộc" gần nhất — gợi ý học viên nên ôn lại. */
    private List<WeakVocabularyItem> buildWeakVocabulary(String studentId) {
        List<UserWordMetric> notMastered = userWordMetricRepository.findByStudentId(studentId).stream()
                .filter(metric -> metric.getStatus() == MemoryStatus.NOT_MASTERED)
                .sorted(Comparator.comparing(UserWordMetric::getLastReviewedAt).reversed())
                .limit(WEAK_VOCABULARY_LIMIT)
                .toList();

        Map<String, Vocabulary> vocabularyById = vocabularyRepository
                .findAllById(notMastered.stream().map(UserWordMetric::getVocabularyId).toList())
                .stream()
                .collect(Collectors.toMap(Vocabulary::getId, v -> v));

        return notMastered.stream()
                .filter(metric -> vocabularyById.containsKey(metric.getVocabularyId()))
                .map(metric -> {
                    Vocabulary vocabulary = vocabularyById.get(metric.getVocabularyId());
                    return WeakVocabularyItem.builder()
                            .vocabularyId(vocabulary.getId())
                            .word(vocabulary.getWord())
                            .meaning(vocabulary.getMeaning())
                            .level(vocabulary.getLevel())
                            .lastReviewedAt(metric.getLastReviewedAt())
                            .build();
                })
                .toList();
    }
}
