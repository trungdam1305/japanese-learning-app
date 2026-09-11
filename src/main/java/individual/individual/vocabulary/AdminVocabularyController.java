package individual.individual.vocabulary;

import individual.individual.common.ApiResponse;
import individual.individual.common.PageResponse;
import individual.individual.user.JlptLevel;
import individual.individual.vocabulary.dto.ImportPreviewResponse;
import individual.individual.vocabulary.dto.ImportResultResponse;
import individual.individual.vocabulary.dto.VocabularyRequest;
import individual.individual.vocabulary.dto.VocabularyResponse;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/vocabularies")
@RequiredArgsConstructor
public class AdminVocabularyController {

    private final VocabularyService vocabularyService;
    private final VocabularyExcelService vocabularyExcelService;

    @GetMapping
    public ApiResponse<PageResponse<VocabularyResponse>> search(
            @RequestParam(required = false) JlptLevel level,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ApiResponse.success(vocabularyService.search(level, keyword, pageable));
    }

    @PostMapping
    public ApiResponse<VocabularyResponse> create(@Valid @RequestBody VocabularyRequest request) {
        return ApiResponse.success("Đã thêm từ vựng", vocabularyService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<VocabularyResponse> update(@PathVariable String id, @Valid @RequestBody VocabularyRequest request) {
        return ApiResponse.success("Đã cập nhật từ vựng", vocabularyService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        vocabularyService.delete(id);
        return ApiResponse.success("Đã xóa từ vựng", null);
    }

    @GetMapping("/template")
    public ResponseEntity<byte[]> downloadTemplate() {
        byte[] template = vocabularyExcelService.generateTemplate();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=vocabulary-template.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(template);
    }

    @PostMapping("/import/preview")
    public ApiResponse<ImportPreviewResponse> previewImport(@RequestParam("file") MultipartFile file) {
        return ApiResponse.success(vocabularyExcelService.preview(file));
    }

    @PostMapping("/import")
    public ApiResponse<ImportResultResponse> importExcel(@RequestParam("file") MultipartFile file) {
        ImportResultResponse result = vocabularyExcelService.importFile(file);
        return ApiResponse.success("Đã import " + result.getInsertedCount() + " từ vựng vào hệ thống", result);
    }
}
