package individual.individual.question;

import individual.individual.common.ApiResponse;
import individual.individual.common.PageResponse;
import individual.individual.question.dto.ImportPreviewResponse;
import individual.individual.question.dto.ImportResultResponse;
import individual.individual.question.dto.QuestionRequest;
import individual.individual.question.dto.QuestionResponse;
import individual.individual.user.JlptLevel;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/questions")
@RequiredArgsConstructor
public class AdminQuestionController {

    private final QuestionService questionService;
    private final QuestionExcelService questionExcelService;

    @GetMapping
    public ApiResponse<PageResponse<QuestionResponse>> search(
            @RequestParam(required = false) JlptLevel level,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ApiResponse.success(questionService.search(level, category, keyword, pageable));
    }

    @PostMapping
    public ApiResponse<QuestionResponse> create(@Valid @RequestBody QuestionRequest request) {
        return ApiResponse.success("Đã thêm câu hỏi", questionService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<QuestionResponse> update(@PathVariable String id, @Valid @RequestBody QuestionRequest request) {
        return ApiResponse.success("Đã cập nhật câu hỏi", questionService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<QuestionResponse> setStatus(@PathVariable String id, @RequestParam QuestionStatus status) {
        return ApiResponse.success("Đã cập nhật trạng thái câu hỏi", questionService.setStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        questionService.delete(id);
        return ApiResponse.success("Đã xóa câu hỏi", null);
    }

    @GetMapping("/template")
    public ResponseEntity<byte[]> downloadTemplate() {
        byte[] template = questionExcelService.generateTemplate();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=question-template.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(template);
    }

    @PostMapping("/import/preview")
    public ApiResponse<ImportPreviewResponse> previewImport(@RequestParam("file") MultipartFile file) {
        return ApiResponse.success(questionExcelService.preview(file));
    }

    @PostMapping("/import")
    public ApiResponse<ImportResultResponse> importExcel(@RequestParam("file") MultipartFile file) {
        ImportResultResponse result = questionExcelService.importFile(file);
        return ApiResponse.success("Đã import " + result.getInsertedCount() + " câu hỏi vào hệ thống", result);
    }
}
