import { Skeleton, keyframes, styled } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  position: "absolute",
  width: "1",
  height: "1",
  padding: "0",
  margin: "-1",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: "0",
});

const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.5); }
100% { transform: scale(1); }
`;

const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
}));

export { BouncingSkeleton, VisuallyHiddenInput };
