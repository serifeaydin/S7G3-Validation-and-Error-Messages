import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from 'reactstrap';
import axios from 'axios';

const initialForm = {
  email: '',
  password: '',
  terms: false,
};

const errorMessages = {
  email: 'Please enter a valid email address',
  password: 'Password must be at least 4 characters long',
};

const Login = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const history = useHistory();

  useEffect(() => {
    validateForm(); // Component yüklendiğinde validasyonu başlat
  }, [form]); // form değiştiğinde useEffect tekrar çalışsın

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Email validation
    if (!form.email.includes('@')) {
      errors.email = errorMessages.email;
      isValid = false;
    } else {
      delete errors.email; // Email doğru doldurulduğunda hata mesajını kaldır
    }

    // Password validation
    if (form.password.length < 4) {
      errors.password = errorMessages.password;
      isValid = false;
    } else {
      delete errors.password; // Password doğru doldurulduğunda hata mesajını kaldır
    }

    if (!form.terms) {
      errors.terms = 'Please accept the terms of service and privacy policy';
      isValid = false;
    } else {
      delete errors.terms; // Terms kabul edildiğinde hata mesajını kaldır
    }

    setErrors(errors);
    setIsValid(isValid);
    return isValid;
  };

  const handleChange = (event) => {
    let { name, value, type } = event.target;
    value = type === 'checkbox' ? event.target.checked : value;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isValid) {
      // isValid kontrolü eklendi
      axios
        .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
        .then((res) => {
          const user = res.data.find(
            (item) =>
              item.password === form.password && item.email === form.email
          );
          if (user) {
            setForm(initialForm);
            history.push('/main');
          } else {
            history.push('/error');
          }
        });
    } else {
      // Form geçersiz olduğunda uyarı göster
      alert('Please fill out the form correctly');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input
          id="exampleEmail"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={handleChange}
          value={form.email}
          invalid={errors.email ? true : false}
        />
        {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Enter your password "
          type="password"
          onChange={handleChange}
          value={form.password}
          invalid={errors.password ? true : false}
        />
        {errors.password && <FormFeedback>{errors.password}</FormFeedback>}
      </FormGroup>
      <FormGroup check>
        <Input
          id="terms"
          name="terms"
          checked={form.terms}
          type="checkbox"
          onChange={handleChange}
          invalid={errors.terms ? true : false}
        />
        <Label htmlFor="terms" check>
          I agree to terms of service and privacy policy
        </Label>
        {errors.terms && <FormFeedback>{errors.terms}</FormFeedback>}
      </FormGroup>
      <FormGroup className="text-center p-4">
        <Button color="primary" disabled={!isValid}>
          Sign In
        </Button>
      </FormGroup>
    </Form>
  );
};

export default Login;
