import { Button } from "@/components/ui/button";
import Link from 'next/link';
import "./responsive.css"

export default function Home() {


  return (
    <div className="cssMain flex items-center justify-around h-screen">
      <span className="cssLogoText text-5xl bg-headingTextGradient font-bold tracking-wider bg-clip-text text-transparent">Mind Maps</span>
      <span className="cssButtonGroup">
        <Link href="/sign-in">
        <Button className="cssButtons cssButtonsi bg-authButtonGradientBackground rounded-mdRadius px-10 font-smWeight text-smFont text-white tracking-wider mr-10">
          SIGN IN
        </Button>
        </Link>
        <Link href="/sign-up">
        <Button className="cssButtons bg-authButtonGradientBackground rounded-mdRadius px-10 font-smWeight text-smFont text-white tracking-wider">
          SIGN UP
        </Button>
        </Link>
      </span>
    </div>
  );
}
