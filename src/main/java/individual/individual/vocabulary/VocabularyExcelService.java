package individual.individual.vocabulary;

import individual.individual.common.exception.BadRequestException;
import individual.individual.user.JlptLevel;
import individual.individual.vocabulary.document.Vocabulary;
import individual.individual.vocabulary.dto.ImportPreviewResponse;
import individual.individual.vocabulary.dto.ImportResultResponse;
import individual.individual.vocabulary.dto.ImportRowError;
import individual.individual.vocabulary.dto.VocabularyRequest;
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

/** Xử lý nhập liệu hàng loạt Từ vựng/Kanji từ file Excel (chức năng A1). */
@Service
@RequiredArgsConstructor
public class VocabularyExcelService {

    private static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024;
    private static final int PREVIEW_ROW_LIMIT = 10;
    private static final String[] TEMPLATE_HEADERS = {"word/kanji", "meaning", "level", "audio_url", "example_sentence"};

    private final VocabularyRepository vocabularyRepository;

    public byte[] generateTemplate() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("vocabulary");

            Row header = sheet.createRow(0);
            for (int i = 0; i < TEMPLATE_HEADERS.length; i++) {
                header.createCell(i).setCellValue(TEMPLATE_HEADERS[i]);
                sheet.setColumnWidth(i, 20 * 256);
            }

            Row sample = sheet.createRow(1);
            sample.createCell(0).setCellValue("学校");
            sample.createCell(1).setCellValue("trường học");
            sample.createCell(2).setCellValue("N5");
            sample.createCell(3).setCellValue("https://example.com/audio/gakkou.mp3");
            sample.createCell(4).setCellValue("私は学校へ行きます。");

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException ex) {
            throw new BadRequestException("Không tạo được file template: " + ex.getMessage());
        }
    }

    public ImportPreviewResponse preview(MultipartFile file) {
        ParsedFile parsed = parse(file);
        List<VocabularyRequest> previewRows = parsed.rows().stream().limit(PREVIEW_ROW_LIMIT).toList();
        return ImportPreviewResponse.builder()
                .totalRows(parsed.totalRows())
                .previewRows(previewRows)
                .errors(parsed.errors())
                .build();
    }

    public ImportResultResponse importFile(MultipartFile file) {
        ParsedFile parsed = parse(file);

        List<Vocabulary> documents = parsed.rows().stream()
                .map(row -> Vocabulary.builder()
                        .word(row.getWord())
                        .meaning(row.getMeaning())
                        .level(row.getLevel())
                        .audioUrl(row.getAudioUrl())
                        .exampleSentence(row.getExampleSentence())
                        .build())
                .toList();
        vocabularyRepository.saveAll(documents);

        return ImportResultResponse.builder()
                .totalRows(parsed.totalRows())
                .insertedCount(documents.size())
                .failedCount(parsed.errors().size())
                .errors(parsed.errors())
                .build();
    }

    private ParsedFile parse(MultipartFile file) {
        validateFile(file);

        List<VocabularyRequest> rows = new ArrayList<>();
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

                String word = readCell(row, 0, formatter);
                String meaning = readCell(row, 1, formatter);
                String levelText = readCell(row, 2, formatter);
                String audioUrl = readCell(row, 3, formatter);
                String example = readCell(row, 4, formatter);

                String error = validateRow(word, meaning, levelText, audioUrl);
                if (error != null) {
                    errors.add(new ImportRowError(excelRowNumber, error));
                    continue;
                }

                VocabularyRequest request = new VocabularyRequest();
                request.setWord(word);
                request.setMeaning(meaning);
                request.setLevel(JlptLevel.valueOf(levelText.toUpperCase(Locale.ROOT)));
                request.setAudioUrl(audioUrl.isBlank() ? null : audioUrl);
                request.setExampleSentence(example.isBlank() ? null : example);
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

    private String validateRow(String word, String meaning, String levelText, String audioUrl) {
        if (word.isBlank()) {
            return "Cột word/kanji không được để trống";
        }
        if (word.length() > 50) {
            return "Cột word/kanji tối đa 50 ký tự";
        }
        if (meaning.isBlank()) {
            return "Cột meaning không được để trống";
        }
        if (!levelText.equalsIgnoreCase("N5") && !levelText.equalsIgnoreCase("N4")) {
            return "Cột level chỉ nhận giá trị N5 hoặc N4";
        }
        if (!audioUrl.isBlank() && !audioUrl.startsWith("http://") && !audioUrl.startsWith("https://")) {
            return "Cột audio_url phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://)";
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

    private record ParsedFile(int totalRows, List<VocabularyRequest> rows, List<ImportRowError> errors) {
    }
}
