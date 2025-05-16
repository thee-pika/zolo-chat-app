import Skeleton from "@mui/material/Skeleton";

const LayoutLoader = () => {
  return (
    <div>
      <div className="flex ">
        <div className=" w-1/4 h-screen ">
          <Skeleton variant="rectangular" height={"100vh"}/>
        </div>
        <div className=" h-screen flex-1 ml-4 mr-4">
          {Array.from({ length: 11 }).map((_, index) => (
            <>
            <Skeleton variant="rectangular" key={index} height={"4rem"} />
            <br/>
            </>
          ))}
          
        </div>
        <div className=" w-1/4 h-screen ">
           <Skeleton variant="rectangular" height={"100vh"}/>
        </div>
      </div>
    </div>
  );
};

export default LayoutLoader;
