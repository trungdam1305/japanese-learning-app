package individual.individual.question;

import individual.individual.common.exception.BadRequestException;
import individual.individual.question.document.Question;
import individual.individual.question.dto.ImportPreviewResponse;
import individual.individual.question.dto.ImportResultResponse;
import individual.individual.question.dto.ImportRowError;
import individual.individual.question.dto.QuestionRequest;
import individual.individual.user.JlptLevel;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Xử lý nhập liệu hàng loạt Ngân hàng câu hỏi từ file Excel (chức năng A2). */
@Service
@RequiredArgsConstructor
public class QuestionExcelService {

    private static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024;
    private static final int PREVIEW_ROW_LIMIT = 10;
    private static final String[] TEMPLATE_HEADERS = {
            "question_text", "option_a", "option_b", "option_c", "option_d",
            "correct_answer", "explanation", "level", "category", "audio_url", "image_url"
    };

    private final QuestionRepository questionRepository;

    public byte[] generateTemplate() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("questions");

            Row header = sheet.createRow(0);
            for (int i = 0; i < TEMPLATE_HEADERS.length; i++) {
                header.createCell(i).setCellValue(TEMPLATE_HEADERS[i]);
                sheet.setColumnWidth(i, 20 * 256);
            }

            Row sample = sheet.createRow(1);
            sample.createCell(0).setCellValue("「がっこう」の漢字はどれですか。");
            sample.createCell(1).setCellValue("学校");
            sample.createCell(2).setCellValue("学枚");
            sample.createCell(3).setCellValue("字校");
            sample.createCell(4).setCellValue("学較");
            sample.createCell(5).setCellValue("A");
            sample.createCell(6).setCellValue("がっこう được viết là 学校");
            sample.createCell(7).setCellValue("N5");
            sample.createCell(8).setCellValue("Kanji");

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException ex) {
            throw new BadRequestException("Không tạo được file template: " + ex.getMessage());
        }
    }

    public ImportPreviewResponse preview(MultipartFile file) {
        ParsedFile parsed = parse(file);
        List<QuestionRequest> previewRows = parsed.rows().stream().limit(PREVIEW_ROW_LIMIT).toList();
        return ImportPreviewResponse.builder()
                .totalRows(parsed.totalRows())
                .previewRows(previewRows)
                .errors(parsed.errors())
                .build();
    }

    public ImportResultResponse importFile(MultipartFile file) {
        ParsedFile parsed = parse(file);

        List<Question> documents = parsed.rows().stream()
                .map(row -> Question.builder()
                        .questionText(row.getQuestionText())
                        .options(row.getOptions())
                        .correctAnswerIndex(row.getCorrectAnswerIndex())
                        .explanation(row.getExplanation())
                        .level(row.getLevel())
                        .category(row.getCategory())
                        .audioUrl(row.getAudioUrl())
                        .imageUrl(row.getImageUrl())
                        .status(QuestionStatus.ACTIVE)
                        .build())
                .toList();
        questionRepository.saveAll(documents);

        return ImportResultResponse.builder()
                .totalRows(parsed.totalRows())
                .insertedCount(documents.size())
                .failedCount(parsed.errors().size())
                .errors(parsed.errors())
                .build();
    }

    private ParsedFile parse(MultipartFile file) {
        validateFile(file);

        List<QuestionRequest> rows = new ArrayList<>();
        List<ImportRowError> errors = new ArrayList<>();
        int totalRows = 0;

        try (InputStream in = file.getInputStream(); Workbook workbook = WorkbookFactory.create(in)) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();

            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null || isEmptyRow(row, formatter)) {
                    continue;
                }
                totalRows++;
                int excelRowNumber = rowIndex + 1;

                String questionText = readCell(row, 0, formatter);
                String optionA = readCell(row, 1, formatter);
                String optionB = readCell(row, 2, formatter);
                String optionC = readCell(row, 3, formatter);
                String optionD = readCell(row, 4, formatter);
                String correctAnswer = readCell(row, 5, formatter);
                String explanation = readCell(row, 6, formatter);
                String levelText = readCell(row, 7, formatter);
                String category = readCell(row, 8, formatter);
                String audioUrl = readCell(row, 9, formatter);
                String imageUrl = readCell(row, 10, formatter);

                List<String> options = List.of(optionA, optionB, optionC, optionD);
                String error = validateRow(questionText, options, correctAnswer, levelText, category, audioUrl, imageUrl);
                if (error != null) {
                    errors.add(new ImportRowError(excelRowNumber, error));
                    continue;
                }

                QuestionRequest request = new QuestionRequest();
                request.setQuestionText(questionText);
                request.setOptions(options);
                request.setCorrectAnswerIndex("ABCD".indexOf(correctAnswer.toUpperCase(Locale.ROOT)));
                request.setExplanation(explanation.isBlank() ? null : explanation);
                request.setLevel(JlptLevel.valueOf(levelText.toUpperCase(Locale.ROOT)));
                request.setCategory(category);
                request.setAudioUrl(audioUrl.isBlank() ? null : audioUrl);
                request.setImageUrl(imageUrl.isBlank() ? null : imageUrl);
                rows.add(request);
            }
        } catch (IOException ex) {
            throw new BadRequestException("Không đọc được file Excel: " + ex.getMessage());
        }

        if (totalRows == 0) {
            throw new BadRequestException("File Excel không có dữ liệu");
        }
        return new ParsedFile(totalRows, rows, errors);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Vui lòng chọn file Excel");
        }
        String filename = file.getOriginalFilename();
        if (filename == null || !(filename.toLowerCase(Locale.ROOT).endsWith(".xlsx")
                || filename.toLowerCase(Locale.ROOT).endsWith(".xls"))) {
            throw new BadRequestException("File phải có định dạng .xlsx hoặc .xls");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("Dung lượng file phải nhỏ hơn 10MB");
        }
    }

    private String validateRow(String questionText, List<String> options, String correctAnswer,
            String levelText, String category, String audioUrl, String imageUrl) {
        if (questionText.isBlank()) {
            return "Cột question_text không được để trống";
        }
        for (int i = 0; i < options.size(); i++) {
            if (options.get(i).isBlank()) {
                return "Cột option_" + (char) ('a' + i) + " không được để trống";
            }
        }
        if (!correctAnswer.matches("(?i)[ABCD]")) {
            return "Cột correct_answer chỉ nhận giá trị A, B, C hoặc D";
        }
        if (!levelText.equalsIgnoreCase("N5") && !levelText.equalsIgnoreCase("N4")) {
            return "Cột level chỉ nhận giá trị N5 hoặc N4";
        }
        if (category.isBlank()) {
            return "Cột category không được để trống";
        }
        if (!audioUrl.isBlank() && !audioUrl.startsWith("http://") && !audioUrl.startsWith("https://")) {
            return "Cột audio_url phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://)";
        }
        if (!imageUrl.isBlank() && !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            return "Cột image_url phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://)";
        }
        return null;
    }

    private boolean isEmptyRow(Row row, DataFormatter formatter) {
        for (int i = 0; i < TEMPLATE_HEADERS.length; i++) {
            if (!readCell(row, i, formatter).isBlank()) {
                return false;
            }
        }
        return true;
    }

    private String readCell(Row row, int index, DataFormatter formatter) {
        Cell cell = row.getCell(index);
        return cell == null ? "" : formatter.formatCellValue(cell).trim();
    }

    private record ParsedFile(int totalRows, List<QuestionRequest> rows, List<ImportRowError> errors) {
    }
}
