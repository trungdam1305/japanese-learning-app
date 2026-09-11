package individual.individual.user;

import individual.individual.user.document.StudentUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StudentUserRepository extends MongoRepository<StudentUser, String> {
}
