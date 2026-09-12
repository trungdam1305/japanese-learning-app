package individual.individual.exam;

import individual.individual.exam.document.ExamTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExamTemplateRepository extends MongoRepository<ExamTemplate, String> {
}
