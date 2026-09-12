package individual.individual.exam;

import individual.individual.common.ApiResponse;
import individual.individual.common.PageResponse;
import individual.individual.exam.dto.AttemptHistoryItemResponse;
import individual.individual.exam.dto.AttemptResultResponse;
import individual.individual.exam.dto.ErrorNotebookItemResponse;
import individual.individual.exam.dto.ExamListItemResponse;
import individual.individual.exam.dto.StartAttemptResponse;
import individual.individual.exam.dto.SubmitAttemptRequest;
import individual.individual.security.UserPrincipal;
import individual.individual.user.JlptLevel;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students/exams")
@RequiredArgsConstructor
public class StudentExamController {

    private final QuizAttemptService quizAttemptService;

    @GetMapping
    public ApiResponse<List<ExamListItemResponse>> listAvailableExams(@RequestParam(required = false) JlptLevel level) {
        return ApiResponse.success(quizAttemptService.listAvailableExams(level));
    }

    @PostMapping("/{templateId}/start")
    public ApiResponse<StartAttemptResponse> start(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable String templateId) {
        return ApiResponse.success(quizAttemptService.startAttempt(principal.getId(), templateId));
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public ApiResponse<AttemptResultResponse> submit(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String attemptId,
            @Valid @RequestBody SubmitAttemptRequest request) {
        return ApiResponse.success(quizAttemptService.submitAttempt(principal.getId(), attemptId, request));
    }

    @GetMapping("/attempts")
    public ApiResponse<PageResponse<AttemptHistoryItemResponse>> history(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));
        return ApiResponse.success(quizAttemptService.listHistory(principal.getId(), pageable));
    }

    @GetMapping("/attempts/{attemptId}")
    public ApiResponse<AttemptResultResponse> attemptDetail(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable String attemptId) {
        return ApiResponse.success(quizAttemptService.getAttemptDetail(principal.getId(), attemptId));
    }

    @GetMapping("/error-notebook")
    public ApiResponse<List<ErrorNotebookItemResponse>> errorNotebook(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(quizAttemptService.getErrorNotebook(principal.getId()));
    }
}
