import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Header({ children }: Props) {
  // destructure children
  const [sidebar, globalSearch, profile, notification, themeSwitcher] =
    React.Children.toArray(children);

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="flex">
          {sidebar}
          {globalSearch}
        </div>
      </div>
      <div className="navbar-end">
        {notification}
        {themeSwitcher}
        {profile}
      </div>
    </div>
  );
}
