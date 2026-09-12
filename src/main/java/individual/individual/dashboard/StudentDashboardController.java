package individual.individual.dashboard;

import individual.individual.common.ApiResponse;
import individual.individual.dashboard.dto.DashboardSummaryResponse;
import individual.individual.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students/dashboard")
@RequiredArgsConstructor
public class StudentDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<DashboardSummaryResponse> getSummary(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(dashboardService.getSummary(principal.getId()));
    }
}
