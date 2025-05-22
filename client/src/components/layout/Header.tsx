import MenuIcon from "@mui/icons-material/Menu";
import React, { lazy, Suspense, useEffect, useState } from "react";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { Backdrop } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { userNotExists } from "../../redux/reducers/auth";
import toast, { Toaster } from "react-hot-toast";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/NotificationDialog"));
const GroupDialog = lazy(() => import("../specific/GroupDialog"));
const AllGroupsDialog = lazy(() => import("../specific/AllGroups"));

const Header = () => {
  const [, setisMobile] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isNewGroup, setIsNewGroup] = useState<boolean>(false);
  const [isNotification, setisNotification] = useState<boolean>(false);
  const [myGroups, setMyGroups] = useState<boolean>(false);
  const { user } = useSelector(
    (state: { auth: { user: boolean; loader: boolean } }) => state.auth
  );

  const handleClose = () => {
    setIsNewGroup(false);
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSearchDialog = () => {
    setIsSearch(true);
    console.log("openSearchDialog");
  };

  const handleNewGroup = () => {
    setIsNewGroup(true);
    console.log("addGroupDialog called ..");
  };

  const handleNotificationDialog = () => {
    setisNotification(true);
    console.log("allNotification");
  };

  const handleAllGroups = () => {
    setMyGroups(true);
  };

  const handleLogoutHandler = async () => {
    localStorage.removeItem("token");
    dispatch(userNotExists());

    toast.success("You are Logged Out !!");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <>
      <div className="h-20 flex justify-between items-center px-8">
        <div className="font-bold text-3xl ml-4 shadow">
          Zolo Chat <span className="text-[#EF4444]">Messenger</span>
        </div>
        <div className="flex">
          <div>
            <IconBtn
              icon={SearchIcon}
              name="Search"
              onClick={handleSearchDialog}
            />
          </div>
          <div>
            <IconBtn
              icon={AddBoxIcon}
              name="Add Group"
              onClick={handleNewGroup}
            />
          </div>
          <div>
            <IconBtn
              icon={CircleNotificationsIcon}
              name="Notifications"
              onClick={handleNotificationDialog}
            />
          </div>
          <div>
            <IconBtn icon={GroupIcon} name="Groups" onClick={handleAllGroups} />
          </div>
          {user ? (
            <button
              className="bg-[#EF4444] px-4 py-2 text-gray-50 rounded-md font-semibold cursor-pointer ml-8"
              onClick={handleLogoutHandler}
            >
              LogOut
            </button>
          ) : (
            <button
              className="bg-[#EF4444] px-4 py-2 text-gray-50 rounded-md font-semibold cursor-pointer ml-8"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          )}
        </div>
      </div>
      <div>
        <button className="md:hidden block" onClick={() => setisMobile(true)}>
          {<MenuIcon />}
        </button>
      </div>
      <div>
        {isSearch && (
          <Suspense fallback={<Backdrop open />}>
            <SearchDialog
              isOpen={isSearch}
              onClose={() => setIsSearch(false)}
            />
          </Suspense>
        )}

        {isNewGroup && (
          <Suspense fallback={<Backdrop open />}>
            <GroupDialog isOpen={isNewGroup} onClose={handleClose} />
          </Suspense>
        )}

        {isNotification && (
          <Suspense fallback={<Backdrop open />}>
            <NotifcationDialog
              isOpen={isNotification}
              onClose={() => setisNotification(false)}
            />
          </Suspense>
        )}

        {myGroups && (
          <Suspense fallback={<Backdrop open />}>
            <AllGroupsDialog
              isOpen={myGroups}
              onClose={() => setMyGroups(false)}
            />
          </Suspense>
        )}
      </div>
      <Toaster />
    </>
  );
};

type IconBtnProps = {
  icon: React.ElementType;
  name: string;
  onClick: () => void;
};

const IconBtn: React.FC<IconBtnProps> = ({ icon: Icon, name, onClick }) => (
  <button
    className="hover:bg-[#dbc9d373] rounded-md cursor-pointer mr-4"
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

    {name}
  </button>
);

export default Header;
