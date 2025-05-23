import { useEffect } from "react";
import toast from "react-hot-toast";

type ErrorObject = {
  isError: boolean;
  error: {
    data: {
      message: string;
    };
  };
  fallback?: () => void;
};

const useErrors = (errors: ErrorObject[] = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) {
          fallback();
        } else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

export { useErrors };
