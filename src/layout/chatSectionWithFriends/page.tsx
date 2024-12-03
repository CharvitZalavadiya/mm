import "@/context/UserContext"
import { useUserContext } from "@/context/UserContext";

const ChatSectionWithFriends = () => {
  const { selectedUser } = useUserContext();
  return (
    <div className="py-1 px-3 h-[85vh]">
      <p className="text-zinc-500 text-xl w-full h-full flex justify-center items-center">Share your thoughts with {selectedUser?.username}</p>
    </div>
  );
};

export default ChatSectionWithFriends;
