package individual.individual.notification;

/**
 * Cổng gửi mail thông báo (F2). Bản đầy đủ (SMTP/template) sẽ triển khai ở phase Notification &
 * Mail Management; hiện tại dùng bản log-only để không chặn các phase phụ thuộc (A4, S5...).
 */
public interface MailNotifier {
    void send(String toEmail, String subject, String content);
}
