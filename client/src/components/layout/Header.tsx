import MenuIcon from "@mui/icons-material/Menu";
import React, { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import SearchDialog from "../specific/Search";
import { Backdrop } from "@mui/material";
import NotificationDialog from "../specific/NotificationDialog";
import GroupDialog from "../specific/GroupDialog";

const Header = () => {
  const [mobile, setisMobile] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isNewGroup, setIsNewGroup] = useState<boolean>(false);
  const [isNotification, setisNotification] = useState<boolean>(false);

  const navigate = useNavigate();

  const openSearchDialog = () => {
    console.log("openSearchDialog");
  };

  const addGroupDialog = () => {
    console.log("addGroupDialog");
  };

  const allNotification = () => {
    console.log("allNotification");
  };

  return (
    <>
      <div className="h-20 flex justify-between items-center px-8">
        <div className="font-bold text-3xl ml-4 shadow">
          Zolo Chat <span className="text-[#EF4444]">Messenger</span>
        </div>
        <div className="flex">
          <div>
            <IconBtn icon={SearchIcon} onClick={openSearchDialog} />
          </div>
          <div>
            <IconBtn icon={AddBoxIcon} onClick={addGroupDialog} />
          </div>
          <div>
            <IconBtn icon={CircleNotificationsIcon} onClick={allNotification} />
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
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <GroupDialog />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotificationDialog />
        </Suspense>
      )}
    </>
  );
};

type IconBtnProps = {
  icon: React.ElementType;
  onClick: () => void;
};

const IconBtn: React.FC<IconBtnProps> = ({ icon: Icon, onClick }) => (
  <button
    className="hover:bg-[#dbc9d373] rounded-md cursor-pointer"
    onClick={onClick}
  >
    <Icon
      sx={{
        width: "2rem",
        height: "2rem",
        marginX: "0.5rem",
        marginY: "0.5rem",
      }}
    />
  </button>
);

export default Header;
