import LogIn from "./components/Auth/LogIn";

const App = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-[392px] h-full border bg-red-50">
        <LogIn />
      </div>
    </div>
  );
};

export default App;
