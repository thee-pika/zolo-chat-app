import { Skeleton, Stack } from "@mui/material";
import { BouncingSkeleton } from "../styles/StyledComponent";

const LayoutLoader = () => {
  return (
    <div>
      <div className="flex ">
        <div className=" w-1/4 h-screen ">
          <Skeleton variant="rectangular" height={"100vh"} />
        </div>
        <div className=" h-screen flex-1 ml-4 mr-4">
          {Array.from({ length: 11 }).map((_, index) => (
            <>
              <div key={index}>
                <Skeleton variant="rectangular" key={index} height={"4rem"} />
              </div>
              <br />
            </>
          ))}
        </div>
        <div className=" w-1/4 h-screen ">
          <Skeleton variant="rectangular" height={"100vh"} />
        </div>
      </div>
    </div>
  );
};

const TypingLoader = () => {
  return (
    <Stack
      spacing={"0.5rem"}
      direction={"row"}
      padding={"0.5rem"}
      justifyContent={"center"}
    >
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.1s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.2s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.4s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.6s",
        }}
      />
    </Stack>
  );
};
export { LayoutLoader, TypingLoader };
