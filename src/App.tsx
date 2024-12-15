import AddUser from "./components/AddUser";
import LogIn from "./components/Auth/LogIn";
import { FileUpload } from "./components/FileUpload";

const App = () => {
  console.log("ENVIRONMENT: ", import.meta.env.ENV);
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-[392px] h-full border bg-red-50">
        {/* <LogIn /> */}
        <AddUser />
        {/* <FileUpload /> */}
      </div>
    </div>
  );
};

export default App;
