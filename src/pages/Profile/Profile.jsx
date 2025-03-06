import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import {
  UPDATE_PROFILE_ROUTE,
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  GENERATE_PROFILE_IMAGE_ROUTE,
} from "../../utils/constants";
import "./Profile.scss";
import { useAppStore } from "../../store";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(""); // Always a string
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [gen, setGen] = useState(false);
  const fileInputRef = useRef(null);

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo?.profileSetup) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setSelectedColor(userInfo.selectedColor || 0);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo?.image) {
      const newImage = `${HOST}/${userInfo.image}`;
      console.log("Setting image to:", newImage);
      setImage(newImage);
    } else {
      console.log("No image, setting to empty string");
      setImage("");
    }
  }, [userInfo?.image]); // Optional chaining to handle undefined userInfo

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const handleFirstName = (event) => setFirstName(event.target.value);
  const handleLastName = (event) => setLastName(event.target.value);

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleBackArrow = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup the profile");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profile-image", file);

    try {
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload response:", response.data);
      console.log("Upload response:", response.data.image);
      if (response.status === 200 && response.data.image) {
        // setUserInfo((prev) => ({ ...prev, image: response.data.image }));
        const newImagePath = response.data.image;
        const fullImageUrl = `${HOST}/${newImagePath}`;
        setUserInfo((prev) => ({
          ...prev,
          image: newImagePath, // Store the relative path
        }));

        // Update local image state immediately
        setImage(fullImageUrl);
        toast.success("Profile image updated successfully");
        console.log("image path:", image);
        console.log("image path in userInfo:", userInfo.image);
      }
    } catch (error) {
      toast.error("Failed to upload profile image");
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserInfo((prev) => ({ ...prev, image: null }));
        setImage("");
        toast.success("Profile image removed successfully.");
      }
    } catch (error) {
      toast.error("Failed to delete profile image");
    }
  };

  const handleGenerateProfile = () => {
    setGen(!gen);
  };

  const generateProfileImage = async () => {
    setLoading(true);
    try {
      console.log(description);
      const response = await apiClient.post(
        GENERATE_PROFILE_IMAGE_ROUTE,
        { description },
        { withCredentials: true }
      ); //axios.post('http://localhost:3000/api/generate-profile-pic'
      setImageUrl(response.data.data);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div onClick={handleBackArrow} className="back-arrow">
          <IoArrowBack className="back-arrow-icon" />
        </div>
        <div className="profile-content">
          <div className="profile-pic">
            <div
              className="avatar-wrapper"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div className={`avatar ${image ? "" : "default-avatar"}`}>
                {image ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="avatar-image"
                    onError={() => console.log("Image failed to load:", image)} // for debugging
                  />
                ) : (
                  <div className={`avatar-placeholder color-${selectedColor}`}>
                    {firstName ? firstName[0] : userInfo.email[0]}
                  </div>
                )}
              </div>
              {hovered && (
                <div
                  className="avatar-overlay"
                  onClick={image ? handleDeleteImage : handleFileInputClick}
                >
                  {image ? (
                    <FaTrash className="icon" />
                  ) : (
                    <FaPlus className="icon" />
                  )}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="file-input"
                onChange={handleImageChange}
                accept=".png, .jpg, .jpeg, .webp, .svg"
              />
            </div>
            <div className="generate-button-wrapper">
              <button
                className="generate-button"
                onClick={handleGenerateProfile}
              >
                {gen ? "Cancel" : "Generate"}
              </button>
            </div>
          </div>
          <div className="profile-info">
            <input
              placeholder="Email"
              type="email"
              disabled
              value={userInfo.email || ""}
              className="input"
            />
            <input
              placeholder="First Name"
              type="text"
              onChange={handleFirstName}
              value={firstName}
              className="input"
            />
            <input
              placeholder="Last Name"
              type="text"
              onChange={handleLastName}
              value={lastName}
              className="input"
            />
            <div className="color-picker">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className={`color-circle color-${index}`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <button className="save-button" onClick={saveChanges}>
          Save Changes
        </button>
      </div>
      {gen ? (
        <div className="input-container">
          <input
            type="text"
            className="input-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your description for the profile pic..."
          />
          <button className="send-button" onClick={generateProfileImage}>
            {loading ? "Generating..." : "Generate Pic"}
          </button>
        </div>
      ) : (
        ""
      )}
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Generated Profile" width="200" />
          <button onClick={() => setProfilePic(imageUrl)}>
            Set as Profile Picture
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
