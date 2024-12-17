import { useSelector } from "react-redux";
import withAuth from "../hoc/withAuth";
import { withDefaultLayout } from "../hoc/withDefaulLayout";
import { RootState } from "../store";
import FeedCard from "../components/FeedCard";
import { supabase } from "../supabase";
import { useEffect, useState, useCallback, useRef } from "react";
import { Post, PostWithRelations } from "../utils/types";
import { NavLink } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";

function Home() {
  const { displayName, profilePictureUrl } = useSelector(
    (state: RootState) => state.user
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const pageSize = 20;

  // Function to fetch posts from Supabase
  const fetchPosts = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(pageSize); // Limit the posts to pageSize (20)

    if (error) {
      console.error("Error fetching posts:", error.message);
      setLoading(false);
      return;
    }

    // Set the posts when first fetched
    setPosts((prevPosts) => {
      return [...prevPosts, ...(data as PostWithRelations[])];
    });

    setLoading(false);
  }, [loading]);

  // Initial fetch when the component mounts
  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts(); // Fetch the initial posts only if no posts exist
    }
  }, [fetchPosts, posts]);

  // Scroll event handler
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!scrollRef.current) return;
      const bottom =
        e.currentTarget.scrollHeight ===
        e.currentTarget.scrollTop + e.currentTarget.clientHeight;

      if (bottom && !loading) {
        // If the scroll reaches the bottom, loop the posts endlessly
        setPosts((prevPosts) => [...prevPosts, ...prevPosts]);
      }
    },
    [loading]
  );

  return (
    <div
      ref={scrollRef}
      className="h-full p-4 overflow-y-auto"
      onScroll={handleScroll}
    >
      <NavLink
        to="/post"
        className="flex absolute justify-center items-center bottom-10 ml-72 h-10 w-10 rounded-full bg-black text-white"
      >
        <IoMdAdd className="text-2xl" />
      </NavLink>
      <div className="h-full w-full flex flex-col gap-6">
        <NavLink to="/profile" className="flex items-center gap-2">
          <img
            src={profilePictureUrl ?? "fallback-image-url.jpg"}
            alt=""
            className="w-14 h-14 object-cover rounded-full"
          />
          <div>
            <small>Welcome Back,</small>
            <h1 className="font-semibold text-xl">{displayName}</h1>
          </div>
        </NavLink>
        <h1 className="font-bold text-2xl">Feeds</h1>
        <div className="space-y-4">
          {posts.map((post, index) => (
            <FeedCard key={`${post.id}-${index}`} postId={post.id} />
          ))}
        </div>
        {loading && (
          <div className="text-center py-4">Loading more posts...</div>
        )}
      </div>
    </div>
  );
}

export default withAuth(withDefaultLayout(Home));
