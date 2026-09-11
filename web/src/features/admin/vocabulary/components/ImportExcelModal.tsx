import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Modal, Space, Table, Typography, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { vocabularyApi } from '../api/vocabularyApi';
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
    mutationFn: (selected: File) => vocabularyApi.previewImport(selected),
    onSuccess: (data) => setPreview(data),
    onError: (error) => {
      setFile(null);
      message.error(getErrorMessage(error, 'Không đọc được file Excel'));
    },
  });

  const importMutation = useMutation({
    mutationFn: (selected: File) => vocabularyApi.runImport(selected),
    onSuccess: (data) => {
      setResult(data);
      message.success(`Đã import thành công ${data.insertedCount} từ vựng`);
      onImported();
    },
    onError: (error) => message.error(getErrorMessage(error, 'Import thất bại')),
  });

  return (
    <Modal
      open={open}
      title="Nhập từ vựng hàng loạt từ Excel"
      width={760}
      onCancel={() => {
        reset();
        onClose();
      }}
      footer={[
        <Button key="template" onClick={() => vocabularyApi.downloadTemplate()}>
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
            dataSource={preview.previewRows}
            columns={[
              { title: 'word/kanji', dataIndex: 'word' },
              { title: 'meaning', dataIndex: 'meaning' },
              { title: 'level', dataIndex: 'level' },
              { title: 'audio_url', dataIndex: 'audioUrl', ellipsis: true },
              { title: 'example_sentence', dataIndex: 'exampleSentence', ellipsis: true },
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
