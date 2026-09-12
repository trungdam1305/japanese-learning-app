package individual.individual.exam;

import individual.individual.common.PageResponse;
import individual.individual.common.exception.NotFoundException;
import individual.individual.exam.document.ExamTemplate;
import individual.individual.exam.dto.ExamTemplateRequest;
import individual.individual.exam.dto.ExamTemplateResponse;
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
public class ExamTemplateService {

    private final ExamTemplateRepository examTemplateRepository;
    private final MongoTemplate mongoTemplate;

    public PageResponse<ExamTemplateResponse> search(JlptLevel level, Pageable pageable) {
        List<Criteria> filters = new ArrayList<>();
        if (level != null) {
            filters.add(Criteria.where("level").is(level));
        }
        Criteria criteria = filters.isEmpty()
                ? new Criteria()
                : new Criteria().andOperator(filters.toArray(new Criteria[0]));

        long total = mongoTemplate.count(new Query(criteria), ExamTemplate.class);
        List<ExamTemplate> items = mongoTemplate.find(new Query(criteria).with(pageable), ExamTemplate.class);

        Page<ExamTemplate> page = new PageImpl<>(items, pageable, total);
        return PageResponse.from(page.map(ExamTemplateResponse::from));
    }

    public ExamTemplateResponse create(ExamTemplateRequest request) {
        ExamTemplate template = ExamTemplate.builder()
                .name(request.getName())
                .level(request.getLevel())
                .category(blankToNull(request.getCategory()))
                .numberOfQuestions(request.getNumberOfQuestions())
                .totalTimeMinutes(request.getTotalTimeMinutes())
                .passingScorePercentage(request.getPassingScorePercentage())
                .shuffleQuestions(request.isShuffleQuestions())
                .status(ExamTemplateStatus.ACTIVE)
                .build();
        return ExamTemplateResponse.from(examTemplateRepository.save(template));
    }

    public ExamTemplateResponse update(String id, ExamTemplateRequest request) {
        ExamTemplate template = findOrThrow(id);
        template.setName(request.getName());
        template.setLevel(request.getLevel());
        template.setCategory(blankToNull(request.getCategory()));
        template.setNumberOfQuestions(request.getNumberOfQuestions());
        template.setTotalTimeMinutes(request.getTotalTimeMinutes());
        template.setPassingScorePercentage(request.getPassingScorePercentage());
        template.setShuffleQuestions(request.isShuffleQuestions());
        return ExamTemplateResponse.from(examTemplateRepository.save(template));
    }

    public ExamTemplateResponse setStatus(String id, ExamTemplateStatus status) {
        ExamTemplate template = findOrThrow(id);
        template.setStatus(status);
        return ExamTemplateResponse.from(examTemplateRepository.save(template));
    }

    public void delete(String id) {
        examTemplateRepository.delete(findOrThrow(id));
    }

    ExamTemplate findOrThrow(String id) {
        return examTemplateRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đề thi"));
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
