import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./components/Home"));
const Chat = lazy(() => import("./components/Chat"));
const Login = lazy(() => import("./components/auth/Login"));
const Groups = lazy(() => import("./components/Groups"));
const Signup = lazy(() => import("./components/auth/Signup"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute user={false}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
