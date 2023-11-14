import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Header({ children }: Props) {
  // destructure children
  const [sidebar, globalSearch, profile, notification] =
    React.Children.toArray(children);

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">{sidebar}</div>
      <div className="navbar-end">
        {globalSearch}
        {notification}
        {profile}
      </div>
    </div>
  );
}
