import { useSelector } from "react-redux";
import withAuth from "../hoc/withAuth";
import { withDefaultLayout } from "../hoc/withDefaulLayout";
import { RootState } from "../store";
import FeedCard from "../components/FeedCard";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import { PostWithRelations } from "../utils/types";
import { NavLink } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";

function Home() {
  const { displayName, profilePictureUrl } = useSelector(
    (state: RootState) => state.user
  );
  const [posts, setPosts] = useState<PostWithRelations[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("posts").select(`
    *,
    post_images(*),
    likes(*)
  `);
      setPosts(data as PostWithRelations[]);
      console.log("data", data);
    })();
  }, []);

  return (
    <div className="p-4 h-full ">
      <NavLink
        to="/post"
        className="flex absolute justify-center items-center bottom-10 ml-72 h-10 w-10 rounded-full bg-black text-white">
        <IoMdAdd className="text-2xl" />
      </NavLink>
      <div className="h-full w-full flex flex-col gap-6">
        <NavLink to="/profile" className="flex items-center gap-2">
          <img
            src={profilePictureUrl ?? "fallback-image-url.jpg"}
            alt=""
            className="w-14 h-14 rounded-full"
          />
          <div>
            <small>Welcome Back,</small>
            <h1 className="font-semibold text-xl">{displayName}</h1>
          </div>
        </NavLink>
        <h1 className="font-bold text-2xl">Feeds</h1>
        <div className="space-y-4">
          {posts.map((post, idx) => (
            <FeedCard key={idx} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuth(withDefaultLayout(Home));
