package individual.individual.exam;

import individual.individual.exam.document.QuizAttempt;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuizAttemptRepository extends MongoRepository<QuizAttempt, String> {

    Optional<QuizAttempt> findByIdAndStudentId(String id, String studentId);

    Page<QuizAttempt> findByStudentIdAndStatus(String studentId, QuizAttemptStatus status, Pageable pageable);

    List<QuizAttempt> findByStudentIdAndStatus(String studentId, QuizAttemptStatus status);
}
