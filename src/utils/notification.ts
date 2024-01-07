import { toast, ToastOptions } from "react-toastify";

type NotificationType = "success" | "error" | "info" | "warn";

export const notification = (type: NotificationType, content: string): void => {
  const options: ToastOptions = {
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 1500,
  };

  toast[type](content, options);
};
