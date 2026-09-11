package individual.individual.vocabulary;

import individual.individual.common.PageResponse;
import individual.individual.common.exception.NotFoundException;
import individual.individual.user.JlptLevel;
import individual.individual.vocabulary.document.Vocabulary;
import individual.individual.vocabulary.dto.VocabularyRequest;
import individual.individual.vocabulary.dto.VocabularyResponse;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VocabularyService {

    private final VocabularyRepository vocabularyRepository;
    private final MongoTemplate mongoTemplate;

    /** Tra cứu/lọc danh sách từ vựng theo trình độ JLPT và từ khóa (khớp cả word lẫn nghĩa tiếng Việt). */
    public PageResponse<VocabularyResponse> search(JlptLevel level, String keyword, Pageable pageable) {
        List<Criteria> filters = new ArrayList<>();
        if (level != null) {
            filters.add(Criteria.where("level").is(level));
        }
        if (keyword != null && !keyword.isBlank()) {
            String escaped = java.util.regex.Pattern.quote(keyword);
            filters.add(new Criteria().orOperator(
                    Criteria.where("word").regex(escaped, "i"),
                    Criteria.where("meaning").regex(escaped, "i")));
        }

        Criteria criteria = filters.isEmpty()
                ? new Criteria()
                : new Criteria().andOperator(filters.toArray(new Criteria[0]));

        long total = mongoTemplate.count(new Query(criteria), Vocabulary.class);
        List<Vocabulary> items = mongoTemplate.find(new Query(criteria).with(pageable), Vocabulary.class);

        Page<Vocabulary> page = new PageImpl<>(items, pageable, total);
        return PageResponse.from(page.map(VocabularyResponse::from));
    }

    public VocabularyResponse create(VocabularyRequest request) {
        Vocabulary vocabulary = Vocabulary.builder()
                .word(request.getWord())
                .meaning(request.getMeaning())
                .level(request.getLevel())
                .audioUrl(request.getAudioUrl())
                .exampleSentence(request.getExampleSentence())
                .build();
        return VocabularyResponse.from(vocabularyRepository.save(vocabulary));
    }

    public VocabularyResponse update(String id, VocabularyRequest request) {
        Vocabulary vocabulary = findOrThrow(id);
        vocabulary.setWord(request.getWord());
        vocabulary.setMeaning(request.getMeaning());
        vocabulary.setLevel(request.getLevel());
        vocabulary.setAudioUrl(request.getAudioUrl());
        vocabulary.setExampleSentence(request.getExampleSentence());
        return VocabularyResponse.from(vocabularyRepository.save(vocabulary));
    }

    public void delete(String id) {
        vocabularyRepository.delete(findOrThrow(id));
    }

    private Vocabulary findOrThrow(String id) {
        return vocabularyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy từ vựng"));
    }
}
