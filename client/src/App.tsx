import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { LayoutLoader } from "./components/layout/Loaders";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { SocketProvider } from "./socket/socket";

const Home = lazy(() => import("./pages/Home"));
const Chat = lazy(() => import("./pages/Chat"));
const Login = lazy(() => import("./components/auth/Login"));
const Groups = lazy(() => import("./pages/Groups"));
const Signup = lazy(() => import("./components/auth/Signup"));

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  publicId: string;
  bio: string;
}

function App() {
  const { user, loader } = useSelector(
    (state: { auth: { user: User; loader: boolean } }) => state.auth
  );

  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getUserDetails(token);
    }
    console.log("loader ", loader);
  }, [token, loader]);

  const getUserDetails = async (token: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(userExists(res.data.user));
      }
    } catch (error) {
      console.error("Error fetching user data", error);
      dispatch(userNotExists());
    }
  };

  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route
            element={
              <SocketProvider>
                <ProtectedRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />

            <Route path="/groups/:id" element={<Groups />} />
          </Route>
          <Route path="/chats/:chatId" element={<Chat user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
