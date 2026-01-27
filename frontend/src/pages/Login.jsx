import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import banner from '../assets/Banner1.png';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      
      // Fixed role check and redirection logic
      const userRole = res.data.data.role; 
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'company') {
        navigate('/company');
      } else if (userRole === 'student') {
        navigate('/student');
      } else {
        navigate('/'); 
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen w-full bg-bg-primary overflow-hidden">
      {/* Left Side: Brand Identity */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-center items-center p-12 text-text-inverse">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <img src={banner} alt="InternLagbe" className="h-24 w-auto object-contain" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            The Gateway to Your <br />
            <span className="text-secondary">Dream Internship</span>
          </h1>
          <p className="text-xl font-medium text-bg-tertiary/80 max-w-sm">
            Connect with top companies and start your professional journey with InternLagbe.
          </p>
        </div>
        
        <div className="absolute bottom-12 flex space-x-4 text-sm font-medium opacity-60">
          <span>Trusted by 500+ Companies</span>
          <span>•</span>
          <span>10k+ Internships</span>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-bg-secondary lg:bg-bg-primary">
        <div className="w-full max-w-md p-8 bg-bg-primary rounded-2xl shadow-2xl lg:shadow-none border border-border-light lg:border-none">
          {/* Mobile Logo/Banner */}
          <div className="flex lg:hidden justify-center mb-8">
            <img src={banner} alt="InternLagbe" className="h-16 w-auto" />
          </div>
          
          <h2 className="mb-2 text-3xl font-extrabold text-primary">Welcome Back</h2>
          <p className="text-text-tertiary mb-8 font-medium">Please enter your details to sign in.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium animate-shake">
              {error}
            </div>
          )}
          
          <form onSubmit={onSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-bold text-text-secondary" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 border border-border-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-bg-tertiary font-medium placeholder:text-text-tertiary"
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold text-text-secondary" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full px-4 py-3 border border-border-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-bg-tertiary font-medium placeholder:text-text-tertiary"
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            
            <button
              className="w-full mt-8 py-3.5 font-bold text-text-inverse bg-primary rounded-xl hover:bg-primary-light active:scale-[0.98] transition-all shadow-lg hover:shadow-primary/20"
              type="submit"
            >
              Sign In
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm font-medium text-text-tertiary">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-primary hover:text-primary-light hover:underline underline-offset-4 decoration-2">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
