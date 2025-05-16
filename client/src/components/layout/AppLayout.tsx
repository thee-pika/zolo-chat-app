import type { ComponentType } from "react";
import Header from "./Header";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";

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
              <ChatList/>
            </div>
            <div className="bg-yellow-600  h-screen flex-1">
              <WrappedComponent {...props} />
            </div>
            <div className="bg-green-600 w-1/4 h-screen md:block hidden">
              THird
            </div>
          
          </div>
        </div>
      );
    };
  };

export default AppLayout;
