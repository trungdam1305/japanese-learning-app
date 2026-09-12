package individual.individual.exam;

import individual.individual.common.ApiResponse;
import individual.individual.common.PageResponse;
import individual.individual.exam.dto.ExamTemplateRequest;
import individual.individual.exam.dto.ExamTemplateResponse;
import individual.individual.user.JlptLevel;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/exam-templates")
@RequiredArgsConstructor
public class AdminExamTemplateController {

    private final ExamTemplateService examTemplateService;

    @GetMapping
    public ApiResponse<PageResponse<ExamTemplateResponse>> search(
            @RequestParam(required = false) JlptLevel level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ApiResponse.success(examTemplateService.search(level, pageable));
    }

    @PostMapping
    public ApiResponse<ExamTemplateResponse> create(@Valid @RequestBody ExamTemplateRequest request) {
        return ApiResponse.success("Đã tạo đề thi", examTemplateService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ExamTemplateResponse> update(@PathVariable String id, @Valid @RequestBody ExamTemplateRequest request) {
        return ApiResponse.success("Đã cập nhật đề thi", examTemplateService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<ExamTemplateResponse> setStatus(@PathVariable String id, @RequestParam ExamTemplateStatus status) {
        return ApiResponse.success("Đã cập nhật trạng thái đề thi", examTemplateService.setStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        examTemplateService.delete(id);
        return ApiResponse.success("Đã xóa đề thi", null);
    }
}
