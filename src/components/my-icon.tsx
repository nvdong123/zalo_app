import React from "react";
import { IconMap } from "./icons";
import { AmenityIcon } from "@/types/room";

interface IconProps {
  name: AmenityIcon;
  className?: string; // Optional for additional styling
}

export const Icon: React.FC<IconProps> = ({ name, className }) => {
  const SelectedIcon = IconMap[name];

  if (!SelectedIcon) {
    console.warn(`Icon "${name}" not found`);
    return null; // Return null or a fallback if the icon is not found
  }

  return <SelectedIcon className={className} />;
};
