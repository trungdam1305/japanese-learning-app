package individual.individual.vocabulary;

import individual.individual.common.ApiResponse;
import individual.individual.common.PageResponse;
import individual.individual.user.JlptLevel;
import individual.individual.vocabulary.dto.VocabularyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Tra cứu Từ vựng & Kanji cho học viên (tính năng miễn phí, không cần gói Premium). */
@RestController
@RequestMapping("/api/students/vocabularies")
@RequiredArgsConstructor
public class StudentVocabularyController {

    private final VocabularyService vocabularyService;

    @GetMapping
    public ApiResponse<PageResponse<VocabularyResponse>> search(
            @RequestParam(required = false) JlptLevel level,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "word"));
        return ApiResponse.success(vocabularyService.search(level, keyword, pageable));
    }
}
