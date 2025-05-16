import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutLoader from "./components/layout/Loaders";

const Home = lazy(() => import("./components/Home"));
const Chat = lazy(() => import("./pages/Chat"));
const Login = lazy(() => import("./components/auth/Login"));
const Groups = lazy(() => import("./components/Groups"));
const Signup = lazy(() => import("./components/auth/Signup"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={<ProtectedRoute user={true} />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>

          <Route element={<ProtectedRoute user={false} redirectUrl="/" />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
