import { useUserContext } from "@/context/UserContext";
import Image from "next/image";

const ChatDetailsOfFriends = () => {
  const { selectedUser } = useUserContext();

  return (
    <div className="w-full inline-flex items-center gap-3">
      {selectedUser && (
        <Image
          src={selectedUser.imageUrl}
          alt={selectedUser.username || "No Username"}
          width={56}
          height={56}
          className="max-w-10 border-[1.5px] border-slate-500 max-h-10 object-cover select-none rounded-full"
        />
      )}
      <h3 className="text-xl">{selectedUser?.username}</h3>
      <h4 className="inline-flex gap-1 text-slate-400">
        <p className="text-sm">{selectedUser?.firstname}</p>
        <p className="text-sm">{selectedUser?.lastname}</p>
      </h4>
    </div>
  );
};

export default ChatDetailsOfFriends;
