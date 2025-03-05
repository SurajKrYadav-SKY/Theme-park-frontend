import React, { useEffect } from "react";
import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Home = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup the profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return <div>This is for home page</div>;
};

export default Home;
