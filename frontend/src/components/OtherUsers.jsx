import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = ({ search = "" }) => {
  useGetOtherUsers();
  const { otherUsers } = useSelector((store) => store.user);

  if (!otherUsers) return null;

  const filteredUsers = search.trim()
    ? otherUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(search.toLowerCase()) ||
          user.username.toLowerCase().includes(search.toLowerCase())
      )
    : otherUsers;

  return (
    <div className="flex flex-col gap-1 py-1">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => {
          return <OtherUser key={user._id} user={user} />;
        })
      ) : (
        <div className="text-center py-8 text-slate-400 text-xs">
          No contacts found
        </div>
      )}
    </div>
  );
};

export default OtherUsers;