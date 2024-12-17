import React, { FormEvent, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { withDefaultLayout } from "../../hoc/withDefaulLayout";
import { ProfilePicture } from "../../components/ProfilePicture";
import { RootState, store } from "../../store";
import { useSelector } from "react-redux";
import { User, updateUser } from "../../store/userSlice";
import { supabase } from "../../supabase";
import { uploadFile } from "../../utils";
import BgImg from "../../assets/loginUser.jpg";
import withAuth from "../../hoc/withAuth";
import { useNavigate } from "react-router-dom";

const EditProfile: React.FC = () => {
  const userStore = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<User>({
    ...userStore,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUploadBackground = async (file: File) => {
    setIsUpdating(true);
    try {
      const background_image = await uploadFile(file);
      setUser((prev) => ({
        ...prev,
        backgroundImage: background_image,
      }));
      const { error } = await supabase
        .from("users")
        .update({
          background_image,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating user:", error);
      } else {
        store.dispatch(updateUser(user));
      }
    } catch (err) {
      console.error("Error in handleUploadBackground:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    let profilePictureUrl = user.profilePictureUrl;
    try {
      if (file) {
        profilePictureUrl = await uploadFile(file);
        setUser((prev) => ({
          ...prev,
          profilePictureUrl,
        }));
      }

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
        store.dispatch(updateUser(user));
      }
    } catch (err) {
      console.error("Error in handleSave:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBack = () => {
    navigate("/profile");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, displayName: e.target.value });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUser({ ...user, bio: e.target.value });
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="w-full relative">
        <img
          src={user.backgroundImage || BgImg}
          alt="Background"
          className="w-full object-cover h-[150px] rounded-b-3xl overflow-hidden"
        />
        <div className="bg-[#f4f4f4] w-7 h-7 rounded-full absolute bottom-3 right-5 flex items-center justify-center">
          <ProfilePicture withoutPreview onEdit={handleUploadBackground} />
        </div>
        <div className="absolute top-3 left-5 flex items-center justify-center text-[#f4f4f4] font-bold gap-2">
          <BackButton onBack={handleBack} title="Edit Profile" />
        </div>
        <div className="absolute -bottom-10 left-5">
          <div className="relative">
            <ProfilePicture
              url={user.profilePictureUrl || ""}
              onEdit={setFile}
            />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="flex flex-col justify-between flex-grow p-6 w-full"
      >
        <div className="my-10 space-y-4 flex-grow w-full">
          <div className="w-full flex gap-2 flex-col">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={user.displayName || ""}
              onChange={handleNameChange}
              className="bg-transparent border-b-[1px] focus:outline-none w-full"
              disabled={isUpdating}
            />
          </div>
          <div className="w-full flex gap-2 flex-col">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={user.bio || ""}
              onChange={handleBioChange}
              className="bg-transparent border-b-[1px] overflow-hidden focus:outline-none w-full min-h-[6rem]"
              disabled={isUpdating}
            />
          </div>
        </div>

        <div className="mt-auto w-full">
          <button
            type="submit"
            className={`bg-black text-white p-2 rounded-full font-semibold w-full ${
              isUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "SAVE"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAuth(withDefaultLayout(EditProfile));
