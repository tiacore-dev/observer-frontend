import { Button, Form, Input, Typography, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

type FormData = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (data.username === "admin" && data.password === "123456") {
      localStorage.setItem("access_token", "fake_token_abc123");
      message.success("Успешный вход");
      navigate("/home");
    } else {
      message.error("Неверный логин или пароль");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "100px auto",
        padding: "2rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <Title level={2} style={{ textAlign: "center" }}>
        Вход
      </Title>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Логин" validateStatus={errors.username ? "error" : ""} help={errors.username?.message}>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Введите логин" }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item label="Пароль" validateStatus={errors.password ? "error" : ""} help={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            rules={{ required: "Введите пароль" }}
            render={({ field }) => <Input.Password {...field} />}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
