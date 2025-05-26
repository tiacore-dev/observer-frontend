import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>Панель управления</Title>
      <Paragraph>Выберите раздел:</Paragraph>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>

        <Card
          title="Компании"
          variant={"outlined"}
          hoverable
          style={{ width: 240, cursor: "pointer" }}
          onClick={() => navigate("/companies")}
        >
          Управление компаниями
        </Card>


        <Card
          title="Боты"
          variant={'outlined'}
          hoverable
          style={{ width: 240, cursor: "pointer" }}
          onClick={() => navigate("/bots")}
        >
          Управление ботами
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
