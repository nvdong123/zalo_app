import React from "react";
import { Header } from "zmp-ui";

interface MyHeaderProps {
  title: string;
  showBackIcon: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const MyHeader: React.FC<MyHeaderProps> = ({ title, showBackIcon, className, style }) => {
  const defaultStyles: React.CSSProperties = { backgroundColor: '#65BF68', color: '#FFFFFF' };

  return (
    <div>
      <Header title={title} showBackIcon={showBackIcon} className={className} style={{...defaultStyles, ...style}} />
    </div>
  )
}