import React from "react";
import { useAppStore } from "../../store";

const Profile = () => {
  const { userInfo } = useAppStore();
  return (
    <div>
      this page is for profle
      <div>Email:{userInfo.email}</div>
    </div>
  );
};

export default Profile;
