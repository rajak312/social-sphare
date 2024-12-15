import { useSelector } from "react-redux";
import withAuth from "../hoc/withAuth";
import { withDefaultLayout } from "../hoc/withDefaulLayout";
import { RootState } from "../store";
import FeedCard from "../components/FeedCard";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import { PostWithRelations } from "../utils/types";

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
    <div className="p-4 h-full">
      <div className="h-full w-full flex flex-col gap-10">
        <div className="flex items-center gap-2">
          <img
            src={profilePictureUrl ?? "fallback-image-url.jpg"}
            alt=""
            className="w-14 h-14 rounded-full"
          />
          <div>
            <small>Welcome Back,</small>
            <h1 className="font-semibold text-xl">{displayName}</h1>
          </div>
        </div>
        <div className="space-y-4">
          {posts.map((post) => (
            <FeedCard post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuth(withDefaultLayout(Home));
