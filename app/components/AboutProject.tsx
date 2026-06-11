export default function AboutProject() {
  return (
    <section className="max-w-6xl mx-auto py-24 px-6">
      <h1 className="text-6xl font-bold text-center mb-20 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
        About Our Project
      </h1>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">
          Project Overview
        </h2>

        <p className="text-zinc-400 leading-8 text-lg">
          This project is a web application designed to report crime incidents,
          manage user profiles, including civilians and police officers.
          It allows users to update their details, view dashboards and
          manage reports.
          The platform integrates crime maps, notifications and AI powered
          assistance while maintaining a secure and modern experience.
        </p>
      </div>
    </section>
  );
}