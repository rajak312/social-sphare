import LogIn from "./components/Auth/LogIn";

const App = () => {
  console.log("ENVIRONMENT: ", import.meta.env.ENV);
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-[392px] h-full border bg-red-50">
        <LogIn />
        <p>Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}</p>
        <p>ProjectId: {import.meta.env.VITE_FIREBASE_PROJECT_ID}</p>
      </div>
    </div>
  );
};

export default App;
