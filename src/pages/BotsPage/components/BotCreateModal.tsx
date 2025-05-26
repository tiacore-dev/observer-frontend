import React from "react";
import { Modal, Form, Input } from "antd";

interface BotCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (values: any) => void;
}

const BotCreateModal: React.FC<BotCreateModalProps> = ({ open, onClose, onCreate }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onCreate(values);
      form.resetFields();
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  return (
    <Modal
      title="Добавить бота"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Создать"
      cancelText="Отмена"
    >
      <Form form={form} layout="vertical">
        <Form.Item
        name="name"
        label="Имя бота"
        rules={[{ required: true, message: "Введите имя" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BotCreateModal;
