import React, { useState } from "react";
import { Button, Card, message, Popconfirm, Modal } from "antd";
import BotCreateModal from "./components/BotCreateModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";


interface Bot {
  id: number;
  name: string;
  description: string;
}

const BotsPage: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [bots, setBots] = useState<Bot[]>([]);

  const handleCreate = (botData: Omit<Bot, "id">) => {
    const newBot: Bot = {
      id: Date.now(),
      ...botData,
    };
    setBots((prev) => [...prev, newBot]);
    message.success("Бот добавлен");
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setBots((prev) => prev.filter((bot) => bot.id !== id));
    message.success("Бот удалён");
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);

  const openEditModal = (bot: Bot) => {
    setEditingBot(bot);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!editingBot?.name.trim()) {
      message.error("Поле обязательно");
      return;
    }
  
    setBots((prevBots) =>
      prevBots.map((bot) => (bot.id === editingBot.id ? editingBot : bot))
    );
    message.success("Бот обновлён");
    setIsEditModalOpen(false);
    setEditingBot(null);
  };
  
  
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Боты</h1>
      <Button type="primary" onClick={() => setModalOpen(true)} style={{ marginBottom: "1rem" }}>
        Добавить бота
      </Button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {bots.map((bot) => (
          <Card
            key={bot.id}
            title={bot.name}
            style={{ width: 300 }}
            extra={
              <>
                <EditOutlined
                  style={{ color: "blue", marginRight: 12, cursor: "pointer" }}
                  onClick={() => openEditModal(bot)}
                />
                <Popconfirm
                  title="Удалить этого бота?"
                  onConfirm={() => handleDelete(bot.id)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                </Popconfirm>
              </>
            }

          >
            <p>{bot.description || "Без описания"}</p>
          </Card>
        ))}
      </div>

      <BotCreateModal open={isModalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      <Modal
        title="Редактировать бота"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingBot(null);
        }}
        onOk={() => handleUpdate()}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <form>
          <div style={{ marginBottom: "1rem" }}>
            <label>Имя бота</label>
            <input
              style={{ width: "100%" }}
              type="text"
              value={editingBot?.name || ""}
              onChange={(e) =>
                setEditingBot((prev) => prev ? { ...prev, name: e.target.value } : null)
              }
            />
          </div>

          <div>
            <label>Описание</label>
            <textarea
              style={{ width: "100%" }}
              value={editingBot?.description || ""}
              onChange={(e) =>
                setEditingBot((prev) => prev ? { ...prev, description: e.target.value } : null)
              }
            />
          </div>
        </form>
      </Modal>


    </div>
  );
};

export default BotsPage;
