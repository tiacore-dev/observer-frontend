import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// import { Button, Form, Input, message, Typography } from 'antd';

type FormData = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // Здесь будет логика авторизации
    if (data.email === "логин" && data.password === "пароль") {
      // message.success('Авторизация успешна');
      // Здесь будет переходна главную
      navigate("/account");
    } else {
      // message.error('Неверные данные');
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        style={{ maxWidth: 400, width: '100%' }}
      >
        <Typography.Title level={2} style={{ textAlign: 'center' }}>Вход в систему</Typography.Title>

        <Form.Item
          label="Логин"
          validateStatus={errors.username ? 'error' : ''}
          help={errors.username?.message}
        >
          <Controller
            name="username"
            control={control}
            rules={{ required: 'Логин обязателен' }}
            render={({ field }) => (
              <Input {...field} placeholder='Введите "логин"' />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Пароль"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Пароль обязателен' }}
            render={({ field }) => (
              <Input.Password {...field} placeholder='Введите "пароль"' />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block> */}
      <h1>ffffffff</h1> Войти
      {/* </Button>
        </Form.Item>
      </Form> */}
    </div>
  );
};

export default LoginPage;
