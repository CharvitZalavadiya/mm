import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "authButtonGradientBackground": "var(--authButtonGradientBackground)",
        "headingTextGradient": "var(--headingTextGradient)",
        "sidebarGradient": "var(--sidebarGradient)",
        "dividerGradient": "var(--dividerGradient)",
        "noteBackgroundGradient": "var(--noteBackgroundGradient)",
        "tagSelectorGradient": "var(--tagSelectorGradient)",
        "chatFriendDetailsGradient": "var(--chatFriendDetailsGradient)",
      },
      colors: {
        "navBlockBackground": "var(--navBlockBackground)",
        "navBlockBackgroundHover": "var(--navBlockBackgroundHover)",
        "selectedFunctionalityBackgroundColor": "var(--selectedFunctionalityBackgroundColor)",
        "primaryBackground": "var(--primaryBackground)",
        "noteBackground": "var(--noteBackground)",
        "noteEditMode": "var(--noteEditMode)",
        "chatSectionInputField": "var(--chatSectionInputField)",
      },
      borderColor: {
        "noteBorderWhite": "var(--noteBorderWhite)",
        "noteBorderDarkgray": "var(--noteBorderDarkgray)",
        "noteBorderGreen": "var(--noteBorderGreen)",
        "noteBorderYellow": "var(--noteBorderYellow)",
        "noteBorderPurple": "var(--noteBorderPurple)",
        "noteBorderRed": "var(--noteBorderRed)",
        "noteBorderPink": "var(--noteBorderPink)",
        "noteBorderCyan": "var(--noteBorderCyan)",
        "chatSectionMessageBorder": "var(--chatSectionMessageBorder)",
      },
      backgroundColor: {
        "noteBackgroundWhite": "var(--noteBackgroundWhite)",
        "noteBackgroundDarkgray": "var(--noteBackgroundDarkgray)",
        "noteBackgroundGreen": "var(--noteBackgroundGreen)",
        "noteBackgroundYellow": "var(--noteBackgroundYellow)",
        "noteBackgroundPurple": "var(--noteBackgroundPurple)",
        "noteBackgroundRed": "var(--noteBackgroundRed)",
        "noteBackgroundPink": "var(--noteBackgroundPink)",
        "noteBackgroundCyan": "var(--noteBackgroundCyan)",
        "chatMainPopupBackground": "var(--chatMainPopupBackground)",
        "chatSectionMessageBG": "var(--chatSectionMessageBG)",
      },
      borderRadius: {
        "smRadius": "var(--smRadius)",
        "mdRadius": "var(--mdRadius)",
        "lgRadius": "var(--lgRadius)"
      },
      fontSize: {
        "smFont": "var(--smFont)",
        "mdFont": "var(--mdFont)",
        "lgFont": "var(--lgFont)"
      },
      fontWeight: {
        "smWeight": "var(--smWeight)",
        "mdWeight": "var(--mdWeight)",
        "lgWeight": "var(--lgWeight)"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config