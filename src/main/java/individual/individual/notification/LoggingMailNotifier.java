package individual.individual.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class LoggingMailNotifier implements MailNotifier {

    @Override
    public void send(String toEmail, String subject, String content) {
        log.info("[MAIL STUB] to={}, subject={}, content={}", toEmail, subject, content);
    }
}
