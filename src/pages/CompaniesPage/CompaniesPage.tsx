import React, { useState } from "react";
import { Button, Card, message, Modal, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CompanyCreateModal from "./components/CompaniesCreateModal";


interface Company {
  id: number;
  name: string;
  description: string;
}

const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);


  const handleSubmit = (companyData: Omit<Company, "id">) => {
    if (editingCompany) {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editingCompany.id ? { ...c, ...companyData } : c
        )
      );
      message.success("Компания обновлена");
    } else {
      const newCompany: Company = {
        id: Date.now(),
        ...companyData,
      };
      setCompanies((prev) => [...prev, newCompany]);
      message.success("Компания добавлена");
    }

    setEditingCompany(null);
    setIsModalOpen(false);
  };


  const handleDelete = (id: number) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    message.success("Компания удалена");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Компании</h1>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: "1rem" }}>
        Добавить компанию
      </Button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {companies.map((company) => (
          <Card
            key={company.id}
            title={company.name}
            style={{ width: 300 }}
            extra={
              <>
                <EditOutlined
                  style={{ color: "blue", marginRight: 12, cursor: "pointer" }}
                  onClick={() => {
                    setEditingCompany(company);
                    setIsModalOpen(true);
                  }}
                />

                <Popconfirm
                  title="Удалить эту компанию?"
                  onConfirm={() => handleDelete(company.id)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                </Popconfirm>
              </>
            }
          >
            <p>{company.description || "Без описания"}</p>
          </Card>
        ))}
      </div>

      <CompanyCreateModal
        open={isModalOpen}
        onClose={() => {
          setEditingCompany(null);
          setIsModalOpen(false);
        }}
        onCreate={handleSubmit}
        initialData={editingCompany}
      />


    </div>
  );
};

export default CompaniesPage;
