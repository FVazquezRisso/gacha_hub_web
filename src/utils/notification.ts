import { toast } from "react-toastify";

export const notification = (type, content) => {
  toast[type](content, {
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 1500,
  });
}