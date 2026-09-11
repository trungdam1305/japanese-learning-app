package individual.individual.user;

public enum UserStatus {
    ACTIVE,
    LOCKED,
    /** Tự động gắn bởi thuật toán giám sát gian lận (S8), chờ Admin xử lý (A4). */
    LOCKED_PENDING
}
