package individual.individual.flashcard;

import individual.individual.common.ApiResponse;
import individual.individual.flashcard.dto.FlashcardDeckResponse;
import individual.individual.flashcard.dto.FlashcardItem;
import individual.individual.flashcard.dto.MarkMemoryRequest;
import individual.individual.security.UserPrincipal;
import individual.individual.user.JlptLevel;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students/flashcards")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    @GetMapping
    public ApiResponse<FlashcardDeckResponse> getDeck(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam JlptLevel level) {
        return ApiResponse.success(flashcardService.getDeck(principal.getId(), level));
    }

    @GetMapping("/progress")
    public ApiResponse<List<FlashcardDeckResponse>> getProgress(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(flashcardService.getProgressSummary(principal.getId()));
    }

    @PutMapping("/{vocabularyId}")
    public ApiResponse<FlashcardItem> markMemoryStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String vocabularyId,
            @Valid @RequestBody MarkMemoryRequest request) {
        return ApiResponse.success(
                flashcardService.markMemoryStatus(principal.getId(), vocabularyId, request.getStatus()));
    }
}
