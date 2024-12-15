import React, { useState } from "react";
import { BackButton } from "../components/BackButton";
import { withDefaultLayout } from "../hoc/withDefaulLayout";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { User, updateUser } from "../store/userSlice";
import { supabase } from "../supabase";
import { uploadFile } from "../utils";
import BgImg from "../assets/loginUser.jpg";
import { NavLink } from "react-router-dom";
import MyPostCard from "../components/MyPostCard";

const Profile: React.FC = () => {
  const userStore = useSelector((state: RootState) => state.user);

  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<User>({
    ...userStore,
  });

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let profilePictureUrl = user.profilePictureUrl;
    if (file) {
      profilePictureUrl = await uploadFile(file);
      setUser((prev) => ({
        ...prev,
        profilePictureUrl,
      }));
    }
    try {
      const { error } = await supabase
        .from("users")
        .update({
          display_name: user.displayName,
          bio: user.bio,
          profile_picture_url: profilePictureUrl,
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

  return (
    <div className="w-full h-full bg-white">
      <div className="w-full  relative">
        <img
          src={BgImg}
          alt={BgImg}
          className="w-full  object-cover h-[150px] rounded-b-3xl overflow-hidden "
        />

        <div className=" absolute top-3 left-5 flex items-center justify-center text-[#f4f4f4] font-bold gap-2 ">
          <BackButton onBack={handleBack} />
        </div>
        <NavLink
          to="/profile/edit"
          className="absolute right-10 rounded-full  -bottom-10 border-gray-400 border w-[200px] flex justify-center items-center font-medium">
          {" "}
          Edit Profile
        </NavLink>
        <div className="absolute -bottom-10 left-5">
          <img
            src={user.profilePictureUrl ?? undefined}
            alt=""
            width={50}
            height={50}
            className="w-24 h-24 object-cover rounded-full"
          />
        </div>
      </div>
      <div className="mt-10 p-4 flex flex-col gap-6">
        <div>
          <h1 className="font-medium text-2xl">{user.displayName}</h1>
          <p>{user.bio}</p>
        </div>
        <div className="space-y-4">
          <h1 className="font-medium text-xl">My Posts</h1>
          <div className="grid grid-cols-2 gap-4">
            <MyPostCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDefaultLayout(Profile);
