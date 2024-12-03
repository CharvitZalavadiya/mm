// import SideBar from "@/layout/sidebar/page";

export default function Dashboard() {
  return (
    <div className="flex p-3">
      <header className="">
        {/* <SideBar /> */}

      </header>

      <span className="w-auto relative text-4xl text-gray-500 p-40 tracking-wide text-center leading-relaxed select-none">
        Select the service to start your productivity{" "}
        <span className="material-symbols-rounded text-6xl text-center flex justify-center">
          arrow_back
        </span>
      </span>
    </div>
  );
}
