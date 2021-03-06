import React, { useState} from "react";
import {
  FormWrapper,
  Auth,
  ImgSide,
  Img,
  Text,
  Form,
  Label,
  Input,
  Icon,
  Button,
} from "./style";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import IconHandler from "../../utils/IconHandler";
import { CreateCart, signInRequest } from "../../api/request";
import { Toast } from "../../utils/toastify";

const SignIn = ({ handleAuth }) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const inputHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const formHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await signInRequest(user);
      if (response.data.success) {
        const createCart = await CreateCart({
          userId: response.data.payload._id,
        });
        localStorage.setItem("cardId", createCart.payload._id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.payload));
        Toast.fire({
          icon: "success",
          title: "Success",
        });
        handleAuth(response.data.token);
        navigate("/products");
      } else {
        Toast.fire({
          icon: "error",
          title: `${response?.data.msg}`,
        });
      }
    } catch (e) {
      Toast.fire({
        icon: "error",
        title: `${e.response.data.msg}`,
      });
    }
  };

  const { email, password } = user;
  return (
    <div className="section_public">
      <FormWrapper>
        <Auth className="auth-wrapper">
          <Link to="/sign-up" style={{ padding: 18 }}>
            <Img src="./brand-logo.svg" alt="logo-turbosale" />
          </Link>
          <Text>Sign in</Text>
          <Form onSubmit={formHandler}>
            <Label>
              <Input
                onChange={inputHandler}
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                required
              />
              <Icon>
                <FontAwesomeIcon icon={faEnvelope} />
              </Icon>
            </Label>
            <Label>
              <Input
                onChange={inputHandler}
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                required
              />
              <Icon onClick={(e) => IconHandler(e)}>
                <FaEye />
                <FaEyeSlash className="d-none" />
              </Icon>
            </Label>
            <Label>
              <Button className="btn btn-orange">Sign in</Button>
              <Link to="/sign-up" className="auth-link">
                Sign up
              </Link>
            </Label>
          </Form>
        </Auth>
        <ImgSide className="auth-wrapper">
          <img src="./form-img.svg" />
        </ImgSide>
      </FormWrapper>
    </div>
  );
};

export default SignIn;
