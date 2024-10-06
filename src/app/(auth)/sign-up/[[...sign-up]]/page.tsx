import { SignUp } from "@clerk/nextjs";
import "../../animations.css"

export default function Page() {
  return (
    <main className="authCard my-7">
      <SignUp />
    </main>
  )
}