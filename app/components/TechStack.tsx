import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiPrisma,
  SiLeaflet,
  SiGithub,
  SiFramer,
  SiVercel,
  SiEslint,
  SiPrettier
} from "react-icons/si";

const techs = [
  {
    name: "Next.js",
    icon: <SiNextdotjs size={45} />
  },
  {
    name: "TypeScript",
    icon: <SiTypescript size={45} />
  },
  {
    name: "Tailwind",
    icon: <SiTailwindcss size={45} />
  },
  {
    name: "MongoDB",
    icon: <SiMongodb size={45} />
  },
  {
    name: "Prisma",
    icon: <SiPrisma size={45} />
  },
  {
    name: "Leaflet",
    icon: <SiLeaflet size={45} />
  },
  {
    name: "Framer Motion",
    icon: <SiFramer size={45} />
  },
  {
    name: "GitHub",
    icon: <SiGithub size={45} />
  },
  {
    name: "ESLint",
    icon: <SiEslint size={45} />
  },
  {
    name: "Prettier",
    icon: <SiPrettier size={45} />
  },
  {
    name: "Vercel",
    icon: <SiVercel size={45} />
  }
];

export default function TechStack() {
  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <h2 className="text-4xl font-bold mb-12">
        Tech Stack
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {techs.map((tech) => (
          <div
            key={tech.name}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center gap-4 hover:border-red-500 transition"
          >
            {tech.icon}

            <span className="text-sm text-center">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}