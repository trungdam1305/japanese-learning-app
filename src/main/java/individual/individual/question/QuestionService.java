package individual.individual.question;

import individual.individual.common.PageResponse;
import individual.individual.common.exception.NotFoundException;
import individual.individual.question.document.Question;
import individual.individual.question.dto.QuestionRequest;
import individual.individual.question.dto.QuestionResponse;
import individual.individual.user.JlptLevel;
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
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final MongoTemplate mongoTemplate;

    /** Tra cứu/lọc ngân hàng câu hỏi theo trình độ, danh mục và từ khóa nội dung câu hỏi (A2). */
    public PageResponse<QuestionResponse> search(JlptLevel level, String category, String keyword, Pageable pageable) {
        List<Criteria> filters = new ArrayList<>();
        if (level != null) {
            filters.add(Criteria.where("level").is(level));
        }
        if (category != null && !category.isBlank()) {
            filters.add(Criteria.where("category").is(category));
        }
        if (keyword != null && !keyword.isBlank()) {
            filters.add(Criteria.where("questionText").regex(java.util.regex.Pattern.quote(keyword), "i"));
        }

        Criteria criteria = filters.isEmpty()
                ? new Criteria()
                : new Criteria().andOperator(filters.toArray(new Criteria[0]));

        long total = mongoTemplate.count(new Query(criteria), Question.class);
        List<Question> items = mongoTemplate.find(new Query(criteria).with(pageable), Question.class);

        Page<Question> page = new PageImpl<>(items, pageable, total);
        return PageResponse.from(page.map(QuestionResponse::from));
    }

    public QuestionResponse create(QuestionRequest request) {
        Question question = Question.builder()
                .questionText(request.getQuestionText())
                .options(request.getOptions())
                .correctAnswerIndex(request.getCorrectAnswerIndex())
                .explanation(request.getExplanation())
                .level(request.getLevel())
                .category(request.getCategory())
                .audioUrl(request.getAudioUrl())
                .imageUrl(request.getImageUrl())
                .status(QuestionStatus.ACTIVE)
                .build();
        return QuestionResponse.from(questionRepository.save(question));
    }

    public QuestionResponse update(String id, QuestionRequest request) {
        Question question = findOrThrow(id);
        question.setQuestionText(request.getQuestionText());
        question.setOptions(request.getOptions());
        question.setCorrectAnswerIndex(request.getCorrectAnswerIndex());
        question.setExplanation(request.getExplanation());
        question.setLevel(request.getLevel());
        question.setCategory(request.getCategory());
        question.setAudioUrl(request.getAudioUrl());
        question.setImageUrl(request.getImageUrl());
        return QuestionResponse.from(questionRepository.save(question));
    }

    public QuestionResponse setStatus(String id, QuestionStatus status) {
        Question question = findOrThrow(id);
        question.setStatus(status);
        return QuestionResponse.from(questionRepository.save(question));
    }

    public void delete(String id) {
        questionRepository.delete(findOrThrow(id));
    }

    Question findOrThrow(String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy câu hỏi"));
    }
}
