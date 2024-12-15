import AddUser from "../components/AddUser";
import withAuth from "../hoc/withAuth";
import { withDefaultLayout } from "../hoc/withDefaulLayout";

function Home() {
  return <AddUser />;
}

export default withAuth(withDefaultLayout(Home));
