import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useInputValidation } from "6pp";

export default function SignupForm() {
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("");
  const password = useInputValidation("");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-2xl">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold">Sign Up</h2>
        </div>
        <div className="relative w-[10rem] h-[10rem] mx-auto">
          <AccountCircleIcon
            color="action"
            sx={{
              width: "10rem",
              height: "10rem",
              objectFit: "contain",
            }}
          />
          <>
            <CameraAltIcon
              sx={{
                position: "absolute",
                width: "2rem",
                height: "2rem",
                bottom: "0",
                right: "0",
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                ":hover": {
                  bgcolor: "rgba(0,0,0,0.7)",
                },
                marginRight: "0.5rem",
                marginBottom: "1rem",
                padding: "0.3rem",
              }}
            />
            {/* <visuallyHiddenInput type="file" onchange={} /> */}
          </>
        </div>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <input
              id="bio"
              type="password"
              placeholder="Enter your bio"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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
            Sign Up
          </button>
          <div className="flex flex-col items-center">
          <span className="p-4">OR</span>
          <h4 className=" text-sm p-4">Already have an Account? <span className="hover:underline bg-amber-100 px-4 py-2 pl-4">LOGIN INSTEAD</span></h4>
            </div>
        </form>
      </div>
    </div>
  );
}
