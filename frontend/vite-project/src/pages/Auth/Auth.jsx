import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const res = await api.post(endpoint, data);

      if (isLogin) {
        console.log(res.data.user);
        console.log(res.data.token);
        loginContext(res.data.user, res.data.token);
        const role = res.data.user.role;

        if (role === "student") {
          navigate("/student");
        } else if (role === "instructor") {
          navigate("/instructor/home");
        } else {
          navigate("/admin");
        }
      } else {
        
        navigate("/"); // Navigate to login after registration
        reset();
        setIsLogin(true);
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200"
    >
      <div
        className="w-full max-w-md p-10 rounded-2xl bg-white/10 backdrop-blur-xl
        border border-white/20 shadow-xl"
      >
        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              reset();
            }}
            className={`px-4 py-2 rounded-l-xl transition ${
              isLogin ? "bg-purple-600 text-white" : "bg-white/10 text-gray-300"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => {
              setIsLogin(false);
              reset();
            }}
            className={`px-4 py-2 rounded-r-xl transition ${
              !isLogin
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name (Register Only) */}
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20
                rounded-xl text-white placeholder-gray-300 focus:ring-2 
                focus:ring-purple-500 outline-none"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-white/10 border border-white/20
              rounded-xl text-white placeholder-gray-300 focus:ring-2 
              focus:ring-purple-500 outline-none"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/10 border border-white/20
              rounded-xl text-white placeholder-gray-300 focus:ring-2 
              focus:ring-purple-500 outline-none"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role Dropdown (Register Only) */}
          {!isLogin && (
            <select
              className="w-full px-4 py-3 bg-white/10 border border-white/20 
              rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
              {...register("role", { required: true })}
            >
              <option value="student" className="text-black">
                Student
              </option>
              <option value="instructor" className="text-black">
                Instructor
              </option>
            </select>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700
            rounded-xl text-white font-semibold shadow-lg shadow-purple-900/40
            transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
