import { useSelector } from "react-redux";
import withAuth from "../hoc/withAuth";
import { withDefaultLayout } from "../hoc/withDefaulLayout";
import { RootState } from "../store";
import FeedCard from "../components/FeedCard";

function Home() {
  const { displayName, profilePictureUrl } = useSelector(
    (state: RootState) => state.user
  );

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
          <FeedCard />
        </div>
      </div>
    </div>
  );
}

export default withAuth(withDefaultLayout(Home));
