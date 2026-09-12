package individual.individual.question;

import individual.individual.question.document.Question;
import individual.individual.user.JlptLevel;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuestionRepository extends MongoRepository<Question, String> {

    List<Question> findByStatusAndLevel(QuestionStatus status, JlptLevel level);

    List<Question> findByStatusAndLevelAndCategory(QuestionStatus status, JlptLevel level, String category);
}
