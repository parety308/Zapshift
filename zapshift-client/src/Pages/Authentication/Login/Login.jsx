import React from 'react';
import Logo from '../../../component/Logo/Logo';
import { Link, useLocation, useNavigate } from 'react-router';
import authImage from '../../../assets/authImage.png';
import useAuth from '../../../hooks/useAuth/useAuth';
import { useForm } from 'react-hook-form';
import SocialLogIn from '../SocialLogIn/SocialLogIn';
import Swal from 'sweetalert2';

// UI-only: form submits into AuthProvider's mock login(), which does not
// contact Firebase or any backend. Replace with a real API call later.
const Login = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { login, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = watch('email');

    const handleLogIn = (data) => {
        login(data.email, data.password)
            .then((res) => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Login Successful',
                    showConfirmButton: false,
                    timer: 1500,
                });
                setUser(res);
                navigate(location?.state || '/');
            })
            .catch((err) => console.log(err));
    };

    const handleForgetPassword = () => {
        if (!email) {
            Swal.fire({ icon: 'info', title: 'Enter your email first' });
            return;
        }
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Please check your email',
            showConfirmButton: false,
            timer: 1500,
        });
    };

    return (
        <>
            <div className="m-4"><Logo /></div>
            <div className="w-10/12 mx-auto lg:flex md:flex md:justify-between md:items-center lg:justify-between lg:items-center">
                <div className="w-full lg:w-100 flex flex-col justify-center bg-base-100 shadow-sm p-4 my-10">
                    <h1 className="text-5xl font-bold">Welcome Back</h1>
                    <p>Login with ZapShift</p>
                    <form onSubmit={handleSubmit(handleLogIn)}>
                        <fieldset className="fieldset">
                            <label className="label">Email</label>
                            <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                            {errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>}

                            <label className="label">Password</label>
                            <input type="password" {...register('password', { required: true })} className="input" placeholder="Password" />
                            {errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>}

                            <div onClick={handleForgetPassword}><a className="link link-hover">Forgot password?</a></div>
                            <button className="btn bg-lime-300 mt-4">Login</button>
                            <div><SocialLogIn /></div>
                        </fieldset>
                    </form>
                    <Link state={location.state} to="/auth/signup" className="link link-hover text-center text-blue-400">
                        Don't have an account? Sign up
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
