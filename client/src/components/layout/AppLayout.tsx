import type { ComponentType } from "react";
import Header from "./Header";
import Title from "../shared/Title";
import MenuIcon from "@mui/icons-material/Menu";

const AppLayout =
  () =>
  <P extends object>(WrappedComponent: ComponentType<P>) => {
    return (props: P) => {
      return (
        <div>
          <Title />
          <Header />
          <div className="flex ">
            <div className="bg-red-600 w-1/4 h-screen sm:block hidden">
              First
            </div>
            <div className="bg-yellow-600  h-screen flex-1">
              <WrappedComponent {...props} />
            </div>
            <div className="bg-green-600 w-1/4 h-screen md:block hidden">
              THird
            </div>
            {<button className="md:hidden block">{<MenuIcon />}</button>}
          </div>
        </div>
      );
    };
  };

export default AppLayout;
