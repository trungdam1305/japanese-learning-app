package individual.individual.admin.account;

import individual.individual.admin.account.dto.ResetPasswordResponse;
import individual.individual.admin.account.dto.StudentAccountView;
import individual.individual.common.PageResponse;
import individual.individual.common.exception.NotFoundException;
import individual.individual.notification.MailNotifier;
import individual.individual.user.StudentUserRepository;
import individual.individual.user.UserStatus;
import individual.individual.user.document.StudentUser;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAccountService {

    private static final String STUDENT_TYPE_ALIAS = "STUDENT";
    private static final String TEMP_PASSWORD_CHARS =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final StudentUserRepository studentUserRepository;
    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;
    private final MailNotifier mailNotifier;

    public PageResponse<StudentAccountView> listStudents(String username, UserStatus status, Pageable pageable) {
        List<Criteria> criteriaList = new ArrayList<>();
        criteriaList.add(Criteria.where("_class").is(STUDENT_TYPE_ALIAS));
        if (username != null && !username.isBlank()) {
            criteriaList.add(Criteria.where("username").regex(username, "i"));
        }
        if (status != null) {
            criteriaList.add(Criteria.where("status").is(status));
        }

        Criteria criteria = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
        long total = mongoTemplate.count(new Query(criteria), StudentUser.class);
        List<StudentUser> students = mongoTemplate.find(new Query(criteria).with(pageable), StudentUser.class);

        Page<StudentUser> page = new org.springframework.data.domain.PageImpl<>(students, pageable, total);
        return PageResponse.from(page.map(StudentAccountView::from));
    }

    public StudentAccountView lockAccount(String studentId, String reason) {
        StudentUser student = findStudentOrThrow(studentId);
        student.setStatus(UserStatus.LOCKED);
        studentUserRepository.save(student);
        mailNotifier.send(student.getEmail(), "Tài khoản của bạn đã bị khóa",
                "Lý do: " + (reason == null || reason.isBlank() ? "Vi phạm quy định hệ thống" : reason));
        return StudentAccountView.from(student);
    }

    public StudentAccountView unlockAccount(String studentId) {
        StudentUser student = findStudentOrThrow(studentId);
        student.setStatus(UserStatus.ACTIVE);
        studentUserRepository.save(student);
        mailNotifier.send(student.getEmail(), "Tài khoản của bạn đã được mở khóa",
                "Tài khoản của bạn hiện đã có thể đăng nhập và sử dụng bình thường.");
        return StudentAccountView.from(student);
    }

    public ResetPasswordResponse resetPassword(String studentId) {
        StudentUser student = findStudentOrThrow(studentId);
        String tempPassword = generateTemporaryPassword();
        student.setPassword(passwordEncoder.encode(tempPassword));
        studentUserRepository.save(student);
        mailNotifier.send(student.getEmail(), "Mật khẩu mới của bạn",
                "Mật khẩu tạm thời: " + tempPassword + ". Vui lòng đổi mật khẩu sau khi đăng nhập.");
        return ResetPasswordResponse.builder()
                .username(student.getUsername())
                .temporaryPassword(tempPassword)
                .build();
    }

    private StudentUser findStudentOrThrow(String studentId) {
        return studentUserRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài khoản học viên"));
    }

    private String generateTemporaryPassword() {
        StringBuilder sb = new StringBuilder("Aa1");
        for (int i = 0; i < 9; i++) {
            sb.append(TEMP_PASSWORD_CHARS.charAt(RANDOM.nextInt(TEMP_PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}
