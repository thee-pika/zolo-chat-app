import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";

const Header = () => {
  const [, setisMobile] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <>
      <div className="h-20 flex justify-between items-center px-8">
        <div className="font-bold text-3xl ml-4 shadow">
          Zolo Chat <span className="text-[#EF4444]">Messenger</span>
        </div>
        <div className="flex">
          <div className="hover:bg-[#dbc9d373] rounded-md cursor-pointer">
            <SearchIcon
              sx={{
                width: "2rem",
                height: "2rem",
                marginX: "0.5rem",
                marginY: "0.5rem",
              }}
            />
          </div>
          <div className="hover:bg-[#dbc9d373] rounded-md cursor-pointer">
            <AddBoxIcon
              sx={{
                width: "2rem",
                height: "2rem",
                marginX: "0.5rem",
                marginY: "0.5rem",
              }}
            />
          </div>
          <div className="hover:bg-[#dbc9d373] rounded-md cursor-pointer">
            <CircleNotificationsIcon
              sx={{
                width: "2rem",
                height: "2rem",
                marginX: "0.5rem",
                marginY: "0.5rem",
              }}
            />
          </div>
          <button
            className="bg-[#EF4444] px-4 py-2 text-gray-50 rounded-md font-semibold cursor-pointer ml-8"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
      <div>
        <button className="md:hidden block" onClick={() => setisMobile(true)}>
          {<MenuIcon />}
        </button>
      </div>
    </>
  );
};

export default Header;
