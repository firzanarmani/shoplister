import { LoginButton } from "@telegram-auth/react";

function App() {
  return (
    <div className="h-screen bg-white">
      <LoginButton
        botUsername="shoplisterapp_bot"
        authCallbackUrl="/api/v1/login/"
        buttonSize="large"
        cornerRadius={10}
        requestAccess={"write"}
        showAvatar
      />
    </div>
  );
}

export default App;
