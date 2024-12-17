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
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(
    async (pageNumber: number) => {
      if (loading || !hasMore) return;
      setLoading(true);
      const pageSize = 20;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("updated_at", { ascending: false })
        .range((pageNumber - 1) * pageSize, pageNumber * pageSize - 1);

      if (error) {
        console.error("Error fetching posts:", error.message);
      } else {
        setPosts([...(data as PostWithRelations[])]);
        if (data && data.length < pageSize) {
          setHasMore(false);
        }
      }
      setLoading(false);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (posts.length) return;
    fetchPosts(page);
  }, [fetchPosts, page, posts]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!scrollRef.current) return;
      const bottom =
        e.currentTarget.scrollHeight ===
        e.currentTarget.scrollTop + e.currentTarget.clientHeight;

      if (bottom && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [hasMore, loading]
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
            <FeedCard key={`${post}-${index}`} postId={post.id} />
          ))}
        </div>
        {loading && (
          <div className="text-center py-4">Loading more posts...</div>
        )}
        {!hasMore && !loading && (
          <div className="text-center py-4">No more posts to load.</div>
        )}
      </div>
    </div>
  );
}

export default withAuth(withDefaultLayout(Home));
