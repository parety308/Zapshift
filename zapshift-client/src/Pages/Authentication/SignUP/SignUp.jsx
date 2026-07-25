import Logo from "../../../component/Logo/Logo";
import { Link, useLocation, useNavigate } from "react-router";
import authImage from "../../../assets/authImage.png";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth/useAuth";
import Swal from "sweetalert2";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUp = async (data) => {
    try {
      await signup({ name: data.name, email: data.email, password: data.password });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Sign Up Successful \ud83c\udf89",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate(location?.state || "/");
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Something went wrong";
      Swal.fire({ icon: "error", title: "Signup Failed", text: message });
    }
  };

  return (
    <>
      <div className="m-4">
        <Logo />
      </div>

      <div className="w-10/12 mx-auto lg:flex md:flex justify-between items-center">
        <div className="bg-base-100 shadow-sm p-4 my-10">
          <h1 className="text-4xl font-bold">Create an Account</h1>
          <p>Sign Up with ZapShift</p>

          <form onSubmit={handleSubmit(handleSignUp)}>
            <fieldset className="fieldset">
              <label className="label">Name</label>
              <input type="text" {...register("name", { required: true })} className="input" placeholder="Your Name" />
              {errors.name && <p className="text-red-500">Name is required</p>}

              <label className="label">Email</label>
              <input type="email" {...register("email", { required: true })} className="input" placeholder="Email" />
              {errors.email && <p className="text-red-500">Email is required</p>}

              <label className="label">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/,
                })}
                className="input"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500">
                  Password must include uppercase, lowercase, number & special character
                </p>
              )}

              <button type="submit" className="btn bg-lime-300 mt-4">
                Sign Up
              </button>
            </fieldset>
          </form>

          <Link state={location.state} to="/auth/login" className="text-blue-500 text-center block mt-3">
            Already have an account? Login
          </Link>
        </div>

        <img src={authImage} alt="Sign up illustration" />
      </div>
    </>
  );
};

export default SignUp;
