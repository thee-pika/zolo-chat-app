import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-2xl">
        <div className="text-center mb-4">
          <h4 className="font-semibold text-2xl">Welcome Back </h4>
          <h2 className="text-3xl font-semibold">Login </h2>
        </div>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 cursor-pointer bg-[#EF4444] text-white rounded-md shadow-sm hover:bg-[#a75252] focus:ring-2 focus:bg-[rgb(168,62,62)] focus:ring-offset-2"
          >
            Log In
          </button>
          <div className="flex flex-col items-center">
            <span className="p-4">OR</span>
            <h4 className=" text-sm p-4">
              Don't have an account?{" "}
              <span className="hover:underline bg-amber-100 px-4 py-2 pl-4"    onClick={() => navigate("/signup")}>
                Sign UP
              </span>
            </h4>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
