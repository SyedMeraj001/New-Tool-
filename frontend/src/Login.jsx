import { useState } from "react";
import { useTheme } from "./contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEyeSlash,
  FaLeaf,
  FaUser
} from "react-icons/fa";
import logo from "./companyLogo.jpg";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [signupRole, setSignupRole] = useState("");

  /* ================================
     Handle Login / Register
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isSignup && !selectedRole) {
      setMessage("❌ Please select a role");
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    const url = isSignup ? `${API}/api/auth/register` : `${API}/api/auth/login`;

    const payload = isSignup
      ? { fullName, email, password, role: signupRole, contactNumber }
      : { email, password, role: selectedRole };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important: sends/receives cookies
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message || "Authentication failed"}`);
        return;
      }

      if (isSignup) {
        setMessage("✅ Registered successfully. Awaiting admin approval.");
        setIsSignup(false);
        return;
      }

      // Login success - cookie is set by server, redirect to dashboard
      setMessage(`✅ Welcome ${data.user.fullName}`);
      setTimeout(() => navigate("/dashboard", { replace: true }), 500);

    } catch (err) {
      console.error("Request error:", err);
      setMessage("❌ Server not reachable");
    }
  };


  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-all duration-500 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-[#e9edf2] via-[#f1f5f9] to-[#e2e8f0]'}`}>
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3a7a44]/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1b3a2d]/10 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
      </div>

      <div className={`container relative max-w-5xl w-full h-[650px] rounded-2xl shadow-2xl overflow-hidden border transition-all duration-1000 ${isSignup ? 'active' : ''}`} style={isDark ? { background: 'rgba(17,24,39,0.9)', border: '2px solid #3a7a44' } : { background: 'rgba(255,255,255,0.9)', border: '2px solid #3a7a44' }}>

        {/* Login Form */}
        <div className="form-box Login absolute top-0 left-0 w-1/2 h-full flex justify-center flex-col px-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src={logo} alt="Logo" className="w-12 h-12 rounded-full border-2 border-[#3a7a44]/30" />
            <div className="text-center">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>ESGenius Tech</h2>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Secure Login</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Email */}
            <div className="relative w-full h-12 mt-6">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className={`w-full h-full bg-transparent border-b-2 outline-none text-base font-semibold pr-6 ${isDark ? 'text-white border-white focus:border-[#3a7a44]' : 'text-gray-900 border-gray-900 focus:border-[#3a7a44]'}`}
              />
              <FaUser className={`absolute top-1/2 right-0 transform -translate-y-1/2 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            </div>

            {/* Password */}
            <div className="relative w-full h-12 mt-6">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className={`w-full h-full bg-transparent border-b-2 outline-none text-base font-semibold pr-6 ${isDark ? 'text-white border-white focus:border-[#3a7a44]' : 'text-gray-900 border-gray-900 focus:border-[#3a7a44]'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-1/2 right-0 transform -translate-y-1/2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {showPassword ? <FaEyeSlash /> : <FaLock />}
              </button>
            </div>

            {/* Role Selector */}
            <div className="mt-6">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border-2 text-base font-semibold ${isDark ? 'bg-gray-800 border-[#3a7a44] text-white' : 'bg-white border-[#3a7a44] text-gray-900'}`}
              >
                <option value="">Select Your Role</option>
                <option value="super_admin">🔴 Super Admin</option>
                <option value="supervisor">🔵 Supervisor</option>
                <option value="data_entry">🟢 Data Entry</option>
              </select>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <button type="submit" className="w-full h-11 bg-[#3a7a44] text-white rounded-full font-semibold hover:bg-[#2d5f35] transition-colors">
                🔐 Secure Login
              </button>
            </div>

            {/* Switch to Signup */}
            <div className="text-sm text-center mt-5">
              <p className={isDark ? 'text-white' : 'text-gray-900'}>
                Don't have an account?{' '}
                <button type="button" onClick={() => setIsSignup(true)} className="text-[#3a7a44] font-semibold hover:underline">
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Info Panel - Login */}
        <div className="info-content Login absolute top-0 right-0 h-full w-1/2 flex justify-center flex-col text-right pr-10 pl-36 pb-16 bg-gradient-to-br from-[#1b3a2d] to-[#3a7a44]">
          <div className="flex items-center justify-end gap-3 mb-4">
            <div className="text-right">
              <h2 className="text-3xl font-bold text-white">ESGenius Tech</h2>
              <p className="text-sm text-white/80">Solutions</p>
            </div>
            <img src={logo} alt="Logo" className="w-16 h-16 rounded-full border-2 border-white/20" />
          </div>
          <h2 className="uppercase text-3xl leading-tight mb-4 text-white">WELCOME BACK!</h2>
          <p className="text-base text-white/90">🔒 Secure authentication with encrypted passwords and HTTP-only cookies. No data stored in browser.</p>
        </div>

        {/* Signup Form */}
        <div className={`form-box Register absolute top-0 right-0 w-1/2 h-full flex justify-center flex-col px-12 py-8 transition-all duration-500 ${isSignup ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full border-2 border-[#3a7a44]/30" />
            <div className="text-center">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>ESGenius Tech</h2>
              <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Register</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Full Name */}
            <div className="relative w-full h-10">
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required={isSignup} placeholder="Full Name"
                className={`w-full h-full bg-transparent border-b-2 outline-none text-sm font-semibold ${isDark ? 'text-white border-white' : 'text-gray-900 border-gray-900'}`} />
            </div>

            {/* Role */}
            <select value={signupRole} onChange={(e) => setSignupRole(e.target.value)} required={isSignup}
              className={`w-full px-3 py-2 rounded-lg border-2 text-sm font-semibold ${isDark ? 'bg-gray-800 border-[#3a7a44] text-white' : 'bg-white border-[#3a7a44] text-gray-900'}`}>
              <option value="">Select Role</option>
              <option value="data_entry">Data Entry</option>
              <option value="supervisor">Supervisor</option>
            </select>

            {/* Email */}
            <div className="relative w-full h-10">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"
                className={`w-full h-full bg-transparent border-b-2 outline-none text-sm font-semibold ${isDark ? 'text-white border-white' : 'text-gray-900 border-gray-900'}`} />
            </div>

            {/* Contact */}
            <div className="relative w-full h-10">
              <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="Contact Number" maxLength="10"
                className={`w-full h-full bg-transparent border-b-2 outline-none text-sm font-semibold ${isDark ? 'text-white border-white' : 'text-gray-900 border-gray-900'}`} />
            </div>

            {/* Password */}
            <div className="relative w-full h-10">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password"
                className={`w-full h-full bg-transparent border-b-2 outline-none text-sm font-semibold ${isDark ? 'text-white border-white' : 'text-gray-900 border-gray-900'}`} />
            </div>

            {/* Confirm Password */}
            <div className="relative w-full h-10">
              <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={isSignup} placeholder="Confirm Password"
                className={`w-full h-full bg-transparent border-b-2 outline-none text-sm font-semibold ${isDark ? 'text-white border-white' : 'text-gray-900 border-gray-900'}`} />
            </div>

            {/* Submit */}
            <button type="submit" className="w-full h-10 bg-[#3a7a44] text-white rounded-full text-sm font-semibold hover:bg-[#2d5f35]">
              Register
            </button>

            {/* Switch to Login */}
            <div className="text-xs text-center mt-3">
              <p className={isDark ? 'text-white' : 'text-gray-900'}>
                Already have an account?{' '}
                <button type="button" onClick={() => setIsSignup(false)} className="text-[#3a7a44] font-semibold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Info Panel - Signup */}
        <div className={`info-content Register absolute top-0 left-0 h-full w-1/2 flex justify-center flex-col text-left pl-10 pr-36 pb-16 bg-gradient-to-br from-[#3a7a44] to-[#1b3a2d] transition-all duration-500 ${isSignup ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Logo" className="w-16 h-16 rounded-full border-2 border-white/20" />
            <div>
              <h2 className="text-3xl font-bold text-white">ESGenius Tech</h2>
              <p className="text-sm text-white/80">Solutions</p>
            </div>
          </div>
          <h2 className="uppercase text-3xl leading-tight mb-4 text-white">WELCOME!</h2>
          <p className="text-base text-white/90">🔐 Your password will be securely hashed. Registration requires admin approval.</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'} bg-white/90 px-4 py-2 rounded-lg shadow-lg`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
