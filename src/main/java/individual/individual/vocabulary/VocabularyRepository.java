package individual.individual.vocabulary;

import individual.individual.user.JlptLevel;
import individual.individual.vocabulary.document.Vocabulary;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VocabularyRepository extends MongoRepository<Vocabulary, String> {

    List<Vocabulary> findByLevelOrderByWordAsc(JlptLevel level);
}
