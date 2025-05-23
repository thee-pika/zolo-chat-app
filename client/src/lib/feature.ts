const getOrSaveFromStorage = ({
  key,
  value,
  get,
}: {
  key: string;
  value?: unknown;
  get: boolean;
}) => {
  if (get) {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  } else {
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

const fileFormat = (url = "") => {
  const fileExtn = url.split(".").pop();

  if (fileExtn === "mp4" || fileExtn === "webm" || fileExtn === "ogg")
    return "video";

  if (fileExtn === "mp3" || fileExtn === "wav") return "audio";

  if (
    fileExtn === "png" ||
    fileExtn === "jpg" ||
    fileExtn === "jpeg" ||
    fileExtn === "gif"
  )
    return "image";
  return "file";
};

export { fileFormat, getOrSaveFromStorage };
