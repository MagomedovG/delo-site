import DeloCategories from "@/components/LandingComponents/DeloCategories";
import DeloHowItWorks from "@/components/LandingComponents/DeloHowItWorks";
import { DeloWhyChooseUs } from "@/components/LandingComponents/DeloWhyChooseUs";
import MainSection from "@/components/LandingComponents/MainSection";
import { redirect } from "next/navigation";

export default function Page() {
  // redirect("/login");
  return (
    <>
      <MainSection/>
      <DeloHowItWorks/>
      <DeloCategories/>
      <DeloWhyChooseUs/>
    </>
  )
}

