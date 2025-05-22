import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useFileHandler, useInputValidation } from "6pp";
import { useNavigate } from "react-router-dom";
import { EmailValidator, UsernameValidator } from "../../utils/validator";
import { VisuallyHiddenInput } from "../styles/StyledComponent";
import axios from "axios";
import { Avatar } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

export default function SignupForm() {
  const navigate = useNavigate();
  const name = useInputValidation("", UsernameValidator);
  const email = useInputValidation("", EmailValidator);
  const bio = useInputValidation("");
  const password = useInputValidation("");

  const avatar = useFileHandler("single", 5);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    avatar.changeHandler(e);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("email", email.value);
    formData.append("bio", bio.value);
    formData.append("password", password.value);
    formData.append("avatar", avatar.file!);

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signup`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("res", res.data);
    if (res.data.success) {
      toast.success(res.data.message ?? "Login successful");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-2xl">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold">Sign Up</h2>
        </div>
        <div className="relative w-[10rem] h-[10rem] mx-auto">
          <Avatar
            src={avatar.preview ?? undefined}
            color="action"
            sx={{
              width: "10rem",
              height: "10rem",
              objectFit: "contain",
            }}
          />

          <div className="absolute bottom-0 right-0 bg-[#c4bdbdb0] text-gray-100 hover:bg-[#4b4848] rounded-full p-2 shadow-md cursor-pointer">
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <CameraAltIcon />
              <VisuallyHiddenInput type="file" onChange={changeHandler} />
            </label>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
              value={name.value}
              onChange={name.changeHandler}
              placeholder="Enter your name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {name.error && (
              <span className="text-red-500 text-sm">{name.error}</span>
            )}
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
              type="text"
              value={bio.value}
              onChange={bio.changeHandler}
              placeholder="Enter your bio"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {bio.error && (
              <span className="text-red-500 text-sm">{bio.error}</span>
            )}
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
              value={email.value}
              onChange={email.changeHandler}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {email.error && (
              <span className="text-red-500 text-sm">{email.error}</span>
            )}
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
              value={password.value}
              onChange={password.changeHandler}
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {password.error && (
              <span className="text-red-500 text-sm">{password.error}</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 cursor-pointer bg-[#EF4444] text-white rounded-md shadow-sm hover:bg-[#a75252] focus:ring-2 focus:bg-[rgb(168,62,62)] focus:ring-offset-2"
          >
            Sign Up
          </button>
          <div className="flex flex-col items-center">
            <span className="p-4">OR</span>
            <h4 className=" text-sm p-4">
              Already have an Account?{" "}
              <span
                className="hover:underline bg-amber-100 px-4 py-2 pl-4 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                LOGIN INSTEAD
              </span>
            </h4>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
