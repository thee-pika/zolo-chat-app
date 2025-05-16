import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./components/Home"));
const Chat = lazy(() => import("./pages/Chat"));
const Login = lazy(() => import("./components/auth/Login"));
const Groups = lazy(() => import("./components/Groups"));
const Signup = lazy(() => import("./components/auth/Signup"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute user={true} />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/groups" element={<Groups />} />
        </Route>
    
        <Route element={<ProtectedRoute user={false} redirectUrl="/"/>}>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
