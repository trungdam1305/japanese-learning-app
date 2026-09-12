import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Modal, Space, Table, Typography, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { questionApi } from '../api/questionApi';
import { getErrorMessage } from '../../../../shared/api/errors';
import type { ImportPreview, ImportResult } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}

export default function ImportExcelModal({ open, onClose, onImported }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const previewMutation = useMutation({
    mutationFn: (selected: File) => questionApi.previewImport(selected),
    onSuccess: (data) => setPreview(data),
    onError: (error) => {
      setFile(null);
      message.error(getErrorMessage(error, 'Không đọc được file Excel'));
    },
  });

  const importMutation = useMutation({
    mutationFn: (selected: File) => questionApi.runImport(selected),
    onSuccess: (data) => {
      setResult(data);
      message.success(`Đã import thành công ${data.insertedCount} câu hỏi`);
      onImported();
    },
    onError: (error) => message.error(getErrorMessage(error, 'Import thất bại')),
  });

  return (
    <Modal
      open={open}
      title="Nhập câu hỏi hàng loạt từ Excel"
      width={820}
      onCancel={() => {
        reset();
        onClose();
      }}
      footer={[
        <Button key="template" onClick={() => questionApi.downloadTemplate()}>
          Take Template Excel
        </Button>,
        <Button
          key="import"
          type="primary"
          disabled={!file}
          loading={importMutation.isPending}
          onClick={() => file && importMutation.mutate(file)}
        >
          Import from Excel
        </Button>,
      ]}
    >
      <Upload.Dragger
        accept=".xlsx,.xls"
        maxCount={1}
        beforeUpload={(selected) => {
          setResult(null);
          setFile(selected);
          previewMutation.mutate(selected);
          return false;
        }}
        onRemove={reset}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Kéo thả file Excel vào đây hoặc bấm để chọn file</p>
        <p className="ant-upload-hint">Định dạng .xlsx / .xls, dung lượng nhỏ hơn 10MB</p>
      </Upload.Dragger>

      {preview && (
        <div style={{ marginTop: 16 }}>
          <Typography.Text strong>
            Xem trước {preview.previewRows.length}/{preview.totalRows} dòng dữ liệu
          </Typography.Text>
          <Table
            style={{ marginTop: 8 }}
            size="small"
            rowKey={(_, index) => String(index)}
            pagination={false}
            scroll={{ x: true }}
            dataSource={preview.previewRows}
            columns={[
              { title: 'question_text', dataIndex: 'questionText', ellipsis: true, width: 220 },
              { title: 'options', render: (_, row) => row.options.join(' / '), width: 260 },
              { title: 'correct', dataIndex: 'correctAnswerIndex', render: (i: number) => 'ABCD'[i] },
              { title: 'level', dataIndex: 'level' },
              { title: 'category', dataIndex: 'category' },
            ]}
          />
          {preview.errors.length > 0 && (
            <Alert
              style={{ marginTop: 12 }}
              type="warning"
              showIcon
              message={`${preview.errors.length} dòng có lỗi sẽ bị bỏ qua khi import`}
              description={
                <Space orientation="vertical" size={2}>
                  {preview.errors.slice(0, 5).map((error) => (
                    <span key={error.row}>
                      Dòng {error.row}: {error.message}
                    </span>
                  ))}
                </Space>
              }
            />
          )}
        </div>
      )}

      {result && (
        <Alert
          style={{ marginTop: 16 }}
          type="success"
          showIcon
          message={`Import hoàn tất: thêm mới ${result.insertedCount} bản ghi, bỏ qua ${result.failedCount} dòng lỗi`}
        />
      )}
    </Modal>
  );
}
