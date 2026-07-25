import React from "react";
import Logo from "../../../component/Logo/Logo";
import { Link, useLocation, useNavigate } from "react-router";
import authImage from "../../../assets/authImage.png";
import useAuth from "../../../hooks/useAuth/useAuth";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogIn = async (data) => {
    try {
      await login(data.email, data.password);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(location?.state || "/");
    } catch (error) {
      const message = error?.response?.data?.message || "Invalid email or password";
      Swal.fire({ icon: "error", title: "Login Failed", text: message });
    }
  };

  return (
    <>
      <div className="m-4">
        <Logo />
      </div>
      <div className="w-10/12 mx-auto lg:flex md:flex md:justify-between md:items-center lg:justify-between lg:items-center">
        <div className="w-full lg:w-100 flex flex-col justify-center bg-base-100 shadow-sm p-4 my-10">
          <h1 className="text-5xl font-bold">Welcome Back</h1>
          <p>Login with ZapShift</p>
          <form onSubmit={handleSubmit(handleLogIn)}>
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input type="email" {...register("email", { required: true })} className="input" placeholder="Email" />
              {errors.email?.type === "required" && <p className="text-red-500">Email is required</p>}

              <label className="label">Password</label>
              <input type="password" {...register("password", { required: true })} className="input" placeholder="Password" />
              {errors.password?.type === "required" && <p className="text-red-500">Password is required</p>}

              <button className="btn bg-lime-300 mt-4">Login</button>
            </fieldset>
          </form>
          <Link state={location.state} to="/auth/signup" className="link link-hover text-center text-blue-400">
            Do not have an account? Sign up
          </Link>
        </div>
        <div>
          <img src={authImage} alt="Login illustration" />
        </div>
      </div>
    </>
  );
};

export default Login;
