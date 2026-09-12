package individual.individual.exam;

import individual.individual.common.PageResponse;
import individual.individual.common.exception.BadRequestException;
import individual.individual.common.exception.NotFoundException;
import individual.individual.exam.document.AttemptQuestion;
import individual.individual.exam.document.ExamTemplate;
import individual.individual.exam.document.QuizAttempt;
import individual.individual.exam.dto.AnswerSubmission;
import individual.individual.exam.dto.AttemptHistoryItemResponse;
import individual.individual.exam.dto.AttemptQuestionView;
import individual.individual.exam.dto.AttemptResultResponse;
import individual.individual.exam.dto.ErrorNotebookItemResponse;
import individual.individual.exam.dto.ExamListItemResponse;
import individual.individual.exam.dto.StartAttemptResponse;
import individual.individual.exam.dto.SubmitAttemptRequest;
import individual.individual.question.QuestionRepository;
import individual.individual.question.QuestionStatus;
import individual.individual.question.document.Question;
import individual.individual.user.JlptLevel;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuizAttemptService {

    private final ExamTemplateRepository examTemplateRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public List<ExamListItemResponse> listAvailableExams(JlptLevel level) {
        return examTemplateRepository.findAll().stream()
                .filter(template -> template.getStatus() == ExamTemplateStatus.ACTIVE)
                .filter(template -> level == null || template.getLevel() == level)
                .map(ExamListItemResponse::from)
                .toList();
    }

    public StartAttemptResponse startAttempt(String studentId, String templateId) {
        ExamTemplate template = examTemplateRepository.findById(templateId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đề thi"));
        if (template.getStatus() != ExamTemplateStatus.ACTIVE) {
            throw new BadRequestException("Đề thi này hiện không khả dụng");
        }

        List<Question> pool = (template.getCategory() == null)
                ? questionRepository.findByStatusAndLevel(QuestionStatus.ACTIVE, template.getLevel())
                : questionRepository.findByStatusAndLevelAndCategory(
                        QuestionStatus.ACTIVE, template.getLevel(), template.getCategory());

        if (pool.size() < template.getNumberOfQuestions()) {
            throw new BadRequestException(
                    "Ngân hàng câu hỏi hiện chỉ có " + pool.size() + "/" + template.getNumberOfQuestions()
                            + " câu phù hợp, chưa đủ để tạo đề thi này");
        }

        List<Question> shuffled = new ArrayList<>(pool);
        Collections.shuffle(shuffled);
        List<Question> selected = shuffled.subList(0, template.getNumberOfQuestions());
        if (!template.isShuffleQuestions()) {
            selected = selected.stream()
                    .sorted(Comparator.comparing(Question::getId))
                    .toList();
        }

        List<AttemptQuestion> snapshots = selected.stream()
                .map(question -> AttemptQuestion.builder()
                        .questionId(question.getId())
                        .questionText(question.getQuestionText())
                        .options(question.getOptions())
                        .correctAnswerIndex(question.getCorrectAnswerIndex())
                        .explanation(question.getExplanation())
                        .audioUrl(question.getAudioUrl())
                        .imageUrl(question.getImageUrl())
                        .build())
                .toList();

        QuizAttempt attempt = QuizAttempt.builder()
                .studentId(studentId)
                .examTemplateId(template.getId())
                .examTemplateName(template.getName())
                .level(template.getLevel())
                .passingScorePercentage(template.getPassingScorePercentage())
                .questions(snapshots)
                .status(QuizAttemptStatus.IN_PROGRESS)
                .startedAt(Instant.now())
                .build();
        quizAttemptRepository.save(attempt);

        return StartAttemptResponse.builder()
                .attemptId(attempt.getId())
                .examTemplateName(attempt.getExamTemplateName())
                .totalTimeMinutes(template.getTotalTimeMinutes())
                .questions(snapshots.stream().map(AttemptQuestionView::from).toList())
                .build();
    }

    public AttemptResultResponse submitAttempt(String studentId, String attemptId, SubmitAttemptRequest request) {
        QuizAttempt attempt = quizAttemptRepository.findByIdAndStudentId(attemptId, studentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy bài làm"));
        if (attempt.getStatus() != QuizAttemptStatus.IN_PROGRESS) {
            throw new BadRequestException("Bài thi này đã được nộp trước đó");
        }

        Map<String, Integer> answerByQuestionId = new LinkedHashMap<>();
        for (AnswerSubmission answer : request.getAnswers()) {
            answerByQuestionId.put(answer.getQuestionId(), answer.getSelectedAnswerIndex());
        }

        int correctCount = 0;
        for (AttemptQuestion question : attempt.getQuestions()) {
            Integer selected = answerByQuestionId.get(question.getQuestionId());
            question.setSelectedAnswerIndex(selected);
            if (selected != null && selected == question.getCorrectAnswerIndex()) {
                correctCount++;
            }
        }

        int total = attempt.getQuestions().size();
        double percentage = total == 0 ? 0 : correctCount * 100.0 / total;

        attempt.setStatus(QuizAttemptStatus.SUBMITTED);
        attempt.setSubmittedAt(Instant.now());
        attempt.setTimeTakenSeconds(Duration.between(attempt.getStartedAt(), attempt.getSubmittedAt()).getSeconds());
        attempt.setScore(correctCount);
        attempt.setTotalQuestions(total);
        attempt.setScorePercentage(percentage);
        attempt.setPassed(percentage >= attempt.getPassingScorePercentage());
        quizAttemptRepository.save(attempt);

        return AttemptResultResponse.from(attempt);
    }

    public PageResponse<AttemptHistoryItemResponse> listHistory(String studentId, Pageable pageable) {
        Page<QuizAttempt> page = quizAttemptRepository.findByStudentIdAndStatus(
                studentId, QuizAttemptStatus.SUBMITTED, pageable);
        return PageResponse.from(page.map(AttemptHistoryItemResponse::from));
    }

    public AttemptResultResponse getAttemptDetail(String studentId, String attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findByIdAndStudentId(attemptId, studentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy bài làm"));
        if (attempt.getStatus() != QuizAttemptStatus.SUBMITTED) {
            throw new BadRequestException("Bài thi chưa hoàn thành");
        }
        return AttemptResultResponse.from(attempt);
    }

    /** Sổ tay lỗi sai: tổng hợp các câu học viên từng trả lời sai qua mọi lần thi đã nộp. */
    public List<ErrorNotebookItemResponse> getErrorNotebook(String studentId) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentIdAndStatus(studentId, QuizAttemptStatus.SUBMITTED);

        record Accumulator(AttemptQuestion question, int wrongCount, Instant lastWrongAt) {
        }

        Map<String, Accumulator> byQuestion = new LinkedHashMap<>();
        for (QuizAttempt attempt : attempts) {
            for (AttemptQuestion question : attempt.getQuestions()) {
                boolean isWrong = question.getSelectedAnswerIndex() == null
                        || !question.getSelectedAnswerIndex().equals(question.getCorrectAnswerIndex());
                if (!isWrong) {
                    continue;
                }
                byQuestion.merge(
                        question.getQuestionId(),
                        new Accumulator(question, 1, attempt.getSubmittedAt()),
                        (existing, incoming) -> new Accumulator(
                                incoming.question(),
                                existing.wrongCount() + 1,
                                existing.lastWrongAt().isAfter(incoming.lastWrongAt())
                                        ? existing.lastWrongAt()
                                        : incoming.lastWrongAt()));
            }
        }

        return byQuestion.values().stream()
                .sorted(Comparator
                        .comparingInt(Accumulator::wrongCount).reversed()
                        .thenComparing(Accumulator::lastWrongAt, Comparator.reverseOrder()))
                .map(acc -> ErrorNotebookItemResponse.builder()
                        .questionId(acc.question().getQuestionId())
                        .questionText(acc.question().getQuestionText())
                        .options(acc.question().getOptions())
                        .correctAnswerIndex(acc.question().getCorrectAnswerIndex())
                        .explanation(acc.question().getExplanation())
                        .wrongCount(acc.wrongCount())
                        .lastWrongAt(acc.lastWrongAt())
                        .build())
                .toList();
    }
}
