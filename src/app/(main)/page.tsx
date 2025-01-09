import { Button } from "@/components/ui/button";
import Link from "next/link";
import "./responsive.css";
import "./animations.css"
import StarBG from "@/components/comps/starBg";

export default function Home() {
  const paraText = ["Effortless Notes, Instant Chats - Capture, Organize, and Connect Seamlessly!"];
  const paraTextWords = paraText[0].split(" ");

  return (
    <div className="cssMain flex items-center justify-center gap-10 flex-col h-dvh w-screen">
      <StarBG />
      <span className="cssLogoText text-5xl bg-headingTextGradient font-bold tracking-wider flex bg-clip-text text-transparent">
        <div className="teamName-fl text-[#12b7f7]">M</div>
        <div className="teamNameDiv-rl overflow-hidden inline-block whitespace-nowrap">
          <span className="teamName-rl bg-headingTextGradient bg-clip-text text-transparent">
            ind Maps
          </span>
        </div>
      </span>

      <span>
        <p
          className="paraText text-xl px-8 font-semibold tracking-wide flex justify-center flex-wrap text-[#3ab2b9]"
        >
          {paraTextWords.map((word, index) => (
            <span
              key={index}
              style={{
                animationDelay: `${1.5 + 0.1 * (index + 1)}s`,
              }}
            >
              {word}&nbsp;
            </span>
          ))}
        </p>
      </span>

      <span className="cssButtonGroup btnAnimation">
        <Link href="/sign-in">
          <Button className="cssButtons cssButtonsi bg-authButtonGradientBackground rounded-full px-10 font-smWeight text-smFont text-white tracking-wider">
            Get Started
          </Button>
        </Link>
      </span>
    </div>
  );
}
