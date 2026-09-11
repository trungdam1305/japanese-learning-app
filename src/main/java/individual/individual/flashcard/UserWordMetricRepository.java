package individual.individual.flashcard;

import individual.individual.flashcard.document.UserWordMetric;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserWordMetricRepository extends MongoRepository<UserWordMetric, String> {

    Optional<UserWordMetric> findByStudentIdAndVocabularyId(String studentId, String vocabularyId);

    List<UserWordMetric> findByStudentId(String studentId);
}
