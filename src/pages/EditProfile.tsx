import React, { useState } from "react";
import { BackButton } from "../components/BackButton";
import { withDefaultLayout } from "../hoc/withDefaulLayout";
import { ProfilePicture } from "../components/ProfilePicture";
import { RootState, store } from "../store";
import { useSelector } from "react-redux";
import { User, updateUser } from "../store/userSlice";
import { supabase } from "../supabase";
import { uploadImage } from "../utils";

const EditProfile: React.FC = () => {
  const userStore = useSelector((state: RootState) => state.user);
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<User>({
    ...userStore,
  });

  const handleSave = async () => {
    let profilePictureUrl = user.profilePictureUrl;
    if (file) {
      profilePictureUrl = await uploadImage(file);
      setUser((prev) => ({
        ...prev,
        profilePictureUrl,
      }));
    }
    try {
      const { error } = await supabase
        .from("users")
        .update({
          display_name: user.display_name,
          bio: user.bio,
          profilePictureUrl,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating user:", error);
      } else {
        console.log("User updated successfully");
        store.dispatch(updateUser(user));
      }
    } catch (err) {
      console.error("Error in handleSave:", err);
    }
  };

  const handleBack = () => {
    console.log("Back button clicked");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, display_name: e.target.value });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUser({ ...user, bio: e.target.value });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-start p-4 border-b bg-white">
        <BackButton onClick={handleBack} />
        <h1 className="flex-1 text-center text-lg font-bold">Edit Profile</h1>
        <div className="w-10" /> {/* spacer for symmetry */}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col items-center space-y-6">
        <ProfilePicture url={user.profilePictureUrl || ""} onEdit={setFile} />
        <div className="w-full">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-black"
            value={user.display_name || ""}
            onChange={handleNameChange}
          />
        </div>

        {/* Bio Input */}
        <div className="w-full">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            className="w-full border border-gray-300 rounded-md p-2 h-32 resize-none focus:outline-none focus:border-black"
            value={user.bio || ""}
            onChange={handleBioChange}
          />
        </div>
      </div>

      {/* Footer / Save Button */}
      <div className="p-4 border-t bg-white">
        <button
          onClick={handleSave}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900"
        >
          SAVE
        </button>
      </div>
    </div>
  );
};

export default withDefaultLayout(EditProfile);
