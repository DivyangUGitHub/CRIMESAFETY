import AboutProject from "../components/AboutProject";
import TechStack from "../components/TechStack";
// import ProjectStats from "../components/ProjectStats";
import Navbar from "../components/Navbar";
import HoverFooter from "../components/hover-footer";
export default function AboutPage() {
  return (
    <main className="bg-black min-h-screen text-white">
        <Navbar />
      <AboutProject />

      <TechStack />

      {/* <ProjectStats /> */}

      <HoverFooter />
    </main>
  );
}