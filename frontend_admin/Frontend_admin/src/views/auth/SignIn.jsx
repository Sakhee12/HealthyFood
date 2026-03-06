import InputField from "components/fields/InputField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "services/api";

export default function SignIn() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    debugger
    if (!phone) {
      setError("Please enter a phone number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authService.sendOtp(phone);
      setOtpSent(true);
      alert("OTP sent to " + phone);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    debugger
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await authService.verifyOtp(phone, otp);
      const { token, user } = response.data;

      if (user.role !== "admin") {
        setError("Access denied. You are not an admin.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin/default");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Admin Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your phone number to receive an OTP!
        </p>

        {error && (
          <div className="mb-4 text-sm font-medium text-red-500">
            {error}
          </div>
        )}

        {!otpSent ? (
          <>
            <InputField
              variant="auth"
              extra="mb-3"
              label="Phone Number*"
              placeholder="+1234567890"
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <InputField
              variant="auth"
              extra="mb-3"
              label="OTP*"
              placeholder="123456"
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >

              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button
              onClick={() => {
                const dummyUser = { id: 1, phone: "+1234567890", role: "admin", name: "Dev Admin" };
                const token = "dev_token_bypass"; // In a real app, this would be a real JWT
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(dummyUser));
                navigate("/admin/default");
              }}
              className="mt-6 w-full text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-brand-500"
            >
              [ Dev Auto-Login ]
            </button>
          </>
        )}
      </div>
    </div>
  );
}
