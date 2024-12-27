import { UserProvider } from "@/context/UserContext";

const ChatsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <UserProvider>{children}</UserProvider>
    </div>
  );
};

export default ChatsLayout;
