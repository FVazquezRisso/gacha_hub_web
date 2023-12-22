type error = {
  username: string;
  password: string;
  confirmPassword: string;
};

export const validateFields = (data: error) => {
  let errors: error = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  if (data.username.length < 4) {
    errors = { ...errors, username: "Mínimo 4 caracteres" };
  } else if (!/^[a-zA-Z0-9_]+$/i.test(data.username)) {
    errors = {
      ...errors,
      username: "Caracteres no permitidos",
    };
  } else if (data.username.length > 15) {
    errors = { ...errors, username: "Máximo 15 caracteres" };
  } else {
    errors = { ...errors, username: "" };
  }

  if (data.password.length < 8) {
    errors = {
      ...errors,
      password: "Mínimo 8 caracteres",
    };
  } else if (!/^(?=\S*\d)(?=\S*[A-Za-z])\S{8,100}$/g.test(data.password)) {
    errors = {
      ...errors,
      password: "Debe contener letras y números",
    };
  } else {
    errors = { ...errors, password: "" };
  }

  if (data.confirmPassword !== data.password) {
    errors = { ...errors, confirmPassword: "Las contraseñas no coinciden" };
  } else {
    errors = { ...errors, confirmPassword: "" };
  }

  return errors;
};
