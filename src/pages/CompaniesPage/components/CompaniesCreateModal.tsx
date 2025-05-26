import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";

interface CompanyCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description: string }) => void;
  initialData?: { name: string; description: string } | null;
}

const CompanyCreateModal: React.FC<CompanyCreateModalProps> = ({
  open,
  onClose,
  onCreate,
  initialData,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onCreate(values);
      onClose();
      form.resetFields();
    });
  };

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  return (
    <Modal
      title={initialData ? "Редактировать компанию" : "Добавить компанию"}
      open={open}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      onOk={handleOk}
      okText={initialData ? "Сохранить" : "Создать"}
      cancelText="Отмена"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Название компании"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompanyCreateModal;
