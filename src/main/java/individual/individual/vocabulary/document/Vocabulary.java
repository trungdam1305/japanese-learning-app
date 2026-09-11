package individual.individual.vocabulary.document;

import individual.individual.user.JlptLevel;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "vocabularies")
public class Vocabulary {

    @Id
    private String id;

    /** Từ vựng hoặc Kanji (theo đúng cột "word/kanji" trong tài liệu đặc tả A1). */
    private String word;

    private String meaning;

    @Indexed
    private JlptLevel level;

    private String audioUrl;

    private String exampleSentence;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
