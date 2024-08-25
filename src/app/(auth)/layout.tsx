const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen py-6 flex items-center bg-primaryBackground justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
