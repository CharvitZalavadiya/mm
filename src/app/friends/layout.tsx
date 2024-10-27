import { UserProvider } from "../context/UserContext";

const FriendsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <UserProvider>{children}</UserProvider>
    </div>
  );
};

export default FriendsLayout;
