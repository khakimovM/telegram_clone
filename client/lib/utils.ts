import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSoundLabel = (value?: string) => {
  switch (value) {
    case "notification.mp3":
      return "Apple";
      break;
    case "notification2.mp3":
      return "Azish";
      break;
    case "sending.mp3":
      return "Belli";
      break;
    case "sending2.mp3":
      return "Oranger";
      break;
    default:
      return "";
      break;
  }
};
