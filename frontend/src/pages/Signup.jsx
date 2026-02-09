import { useState } from "react";
import { Link } from "react-router-dom";
import banner from "../assets/Banner1.png";
import api from "../utils/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");

  const { name, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", formData);
      console.log(api)
      localStorage.setItem("token", res.data.token);

      const { role } = res.data.data;
      if (role === "admin") {
        window.location.href = "/admin";
      } else if (role === "company") {
        window.location.href = "/company";
      } else if (role === "student") {
        window.location.href = "/student";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-bg-primary">
      {/* Left Side: Brand Identity - Hidden on mobile/tablet */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-center items-center p-12 text-text-inverse">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <img
              src={banner}
              alt="InternLagbe"
              className="h-24 w-auto object-contain"
            />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight text-white">
            Build Your <br />
            <span className="text-secondary">Professional Future</span>
          </h1>
          <p className="text-xl font-medium text-bg-tertiary/80 max-w-sm">
            Join thousands of students and top companies already growing
            together on InternLagbe.
          </p>
        </div>

        <div className="absolute bottom-12 flex space-x-4 text-sm font-medium opacity-60">
          <span>Global Network</span>
          <span>•</span>
          <span>Verified Companies</span>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-bg-secondary lg:bg-bg-primary overflow-y-auto">
        <div className="w-full max-w-md p-6 md:p-8 bg-bg-primary rounded-3xl shadow-xl lg:shadow-none border border-border-light lg:border-none">
          {/* Mobile Logo/Banner */}
          <div className="flex lg:hidden justify-center mb-6">
            <img src={banner} alt="InternLagbe" className="h-14 w-auto" />
          </div>

          <h2 className="mb-2 text-2xl md:text-3xl font-extrabold text-primary">
            Get Started
          </h2>
          <p className="text-sm text-text-tertiary mb-6 md:mb-8 font-medium">
            Create an account to start your journey.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-text-secondary">
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-2.5 md:py-3 border border-border-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-bg-tertiary font-medium placeholder:text-text-tertiary text-sm"
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-text-secondary">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-2.5 md:py-3 border border-border-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-bg-tertiary font-medium placeholder:text-text-tertiary text-sm"
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-text-secondary">
                  Password
                </label>
                <input
                  className="w-full px-4 py-2.5 md:py-3 border border-border-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-bg-tertiary font-medium placeholder:text-text-tertiary text-sm"
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-text-secondary">
                  Register as:
                </label>
                <select
                  name="role"
                  value={role}
                  onChange={onChange}
                  className="w-full px-4 py-2.5 md:py-3 border border-border-medium rounded-xl bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-text-primary text-sm"
                >
                  <option value="student">Student</option>
                  <option value="company">Company</option>
                </select>
              </div>
            </div>

            <button
              className="w-full mt-6 md:mt-8 py-3.5 font-bold text-text-inverse bg-secondary rounded-xl hover:bg-secondary-dark active:scale-[0.98] transition-all shadow-lg hover:shadow-secondary/20"
              type="submit"
            >
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-text-tertiary">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-bold text-primary hover:text-primary-light hover:underline underline-offset-4 decoration-2"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
