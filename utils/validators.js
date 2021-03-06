const validateRegisterInput = (username, password, confirmPassword) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username should not be empty";
  }

  if (password === "") {
    errors.password = "password must not be empty";
  } else if (password !== confirmPassword) {
    errors.password = "passwords must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username should not be empty";
  }
  if (password === "") {
    errors.password = "password must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const validateEmail = (email) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "email must be a valid email";
    }
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports = { validateLoginInput, validateRegisterInput, validateEmail };
