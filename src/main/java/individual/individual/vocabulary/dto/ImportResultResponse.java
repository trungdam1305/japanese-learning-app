package individual.individual.vocabulary.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ImportResultResponse {
    private int totalRows;
    private int insertedCount;
    private int failedCount;
    private List<ImportRowError> errors;
}
