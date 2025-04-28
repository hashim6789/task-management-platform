import { toast } from "sonner";

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
}

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export const showToast = ({
  message,
  type = ToastType.INFO,
  duration = 3000,
}: ToastOptions): void => {
  switch (type) {
    case ToastType.SUCCESS:
      toast.success(message, { duration });
      break;
    case ToastType.ERROR:
      toast.error(message, { duration });
      break;
    case ToastType.WARNING:
      toast.warning(message, { duration });
      break;
    default:
      toast(message, { duration });
      break;
  }
};
