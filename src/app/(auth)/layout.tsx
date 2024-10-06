import "./animations.css"
import StarBG from "@/components/comps/starBg";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="authCard min-h-dvh flex items-center bg-primaryBackground justify-center">
      <StarBG />
      {children}
    </div>
  );
};

export default AuthLayout;
