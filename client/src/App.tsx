import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutLoader from "./components/layout/Loaders";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { userExists, userNotExists } from "./redux/reducers/auth";

const Home = lazy(() => import("./components/Home"));
const Chat = lazy(() => import("./pages/Chat"));
const Login = lazy(() => import("./components/auth/Login"));
const Groups = lazy(() => import("./components/Groups"));
const Signup = lazy(() => import("./components/auth/Signup"));

function App() {
  const { user, loader } = useSelector(
    (state: { auth: { user: boolean; loader: boolean } }) => state.auth
  );
  console.log("user", user);
  console.log("loader", loader);
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      console.log("token found!!", token);
      getUserDetails(token);
    }
    console.log("token notofund", token);
  }, [token]);

  const getUserDetails = async (token: string) => {
    try {
      console.log("Fetching user data");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("fetchinggggggggggggggggggggggggggg res", res);
      if (res.data.success) {
        console.log("User exists:", res.data.user);
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
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>

          <Route element={<ProtectedRoute user={true} redirectUrl="/" />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
