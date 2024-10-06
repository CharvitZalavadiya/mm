import { SignIn } from "@clerk/nextjs";
import "../../animations.css"

export default function Page() {
  return (
    <main className=" authCard overflow-hidden">
      <SignIn />
    </main>
  );
}
