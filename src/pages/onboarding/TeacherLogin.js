import React, { useState, useEffect } from "react";
import { Logo } from "../../components/images";
import { Button } from "../../components/ui/button";
import { MdPassword } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useTeacherLoginMutation } from "../../app/api/authApi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const TeacherLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [teacherLogin, { isLoading, isSuccess, error }] =
    useTeacherLoginMutation();

  const [credentials, setCredientials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (error) {
      toast.error(error.data.message);
      console.log(error.data);
    }

    if (isSuccess) {
      navigate("/teacher");
      toast.success("Logged in Successfully");
    }
  }, [error, isSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredientials((preValue) => {
      return { ...preValue, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.password.trim()) return toast.error("Password is missing");
    teacherLogin(credentials);
  };

  // console.log(credentials)

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full h-screen min-h-screen flex flex-col sm:flex-row bg-white ">
      <div className="flex-1 h-32 lg:h-full hidden sm:flex">
        <div className="relative flex h-32 items-end bg-gray-900 lg:h-full ">
          <img
            alt=""
            src="/teacherImg.webp"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <div className=" logo-sm">
              <Logo />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome Back
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Welcome back to Living Seed Excel Kidz Academy, Log into your
              dashboard
            </p>
          </div>
        </div>
      </div>

      {/* form side */}
      <div className="flex-1 flex justify-center items-center ">
        <div className="w-full  justify-center items-center py-10 sm:py-18 px-6 sm:px-12 flex flex-col gap-6 ">
          <div className="flex flex-col gap-6 justify-center items-center">
            <div className=" logo-sm">
              <Logo />
            </div>
            <p className="text-sm sm:text-[16px] ">
              Login into your dashboard as a Teacher on Living Seed Excel Kidz
              Academy{" "}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 mt-4 sm:max-w-[450px] justify-start"
          >
            {/* email */}

            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder=""
                value={credentials.email}
                onChange={handleChange}
                className="px-4 py-2 outline-[#988fff] border border-gray-300 rounded-lg"
              />
            </div>

            {/* password */}

            <div className="flex flex-col gap-2 w-full relative">
              <label htmlFor="password" className="text-sm">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="px-4 py-2 outline-[#988fff] border border-gray-300 rounded-lg"
              />

              {showPassword ? (
                <AiFillEye
                  fontSize={20}
                  onClick={() => setShowPassword(false)}
                  className="absolute right-3 top-10 cursor-pointer text-[#4e3ffa]"
                />
              ) : (
                <AiFillEyeInvisible
                  fontSize={20}
                  onClick={() => setShowPassword(true)}
                  className="absolute right-3 top-10 cursor-pointer text-[#4e3ffa]"
                />
              )}
            </div>

            <div className="flex flex-col items-center justify-center w-full gap-4">
              <Button
                disabled={isLoading}
                className="w-full bg-[#4a3aff] hover:bg-[#4e3ffa] text-[18px] "
              >
                {" "}
                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
              {/* <p className='text-black text-sm flex items-center gap-1'>Not Registered?
                <Link to="/select-preference">
                 <span className='text-gray-600 cursor-pointer underline'>Register with us today</span>
                </Link>
                 </p> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
