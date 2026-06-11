"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

const codeData = [
  {
    name: "TypeScript",
    value: 521774
  }
];

const commitData = [
  { week: "Jul 28", commits: 1 },
  { week: "Aug 4", commits: 4 },
  { week: "Aug 11", commits: 3 },
  { week: "Sep 1", commits: 1 },
  { week: "Oct 20", commits: 18 },
  { week: "Oct 27", commits: 23 },
  { week: "Nov 3", commits: 23 },
  { week: "Nov 10", commits: 59 },
  { week: "Nov 17", commits: 32 },
  { week: "Nov 24", commits: 14 }
];

export default function ProjectStats() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="border border-red-900 rounded-3xl bg-black/60 backdrop-blur-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-5xl font-bold">
            Project Statistics
          </h2>

          <p className="text-zinc-400 mt-2">
            An overview of our project's composition and activity
          </p>
        </div>

        <div className="grid lg:grid-cols-2 border-t border-zinc-800">
          <div className="p-8 border-r border-zinc-800">
            <h3 className="text-3xl font-bold mb-8">
              Lines of Code
            </h3>

            <div className="h-[350px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={codeData}
                    innerRadius={90}
                    outerRadius={140}
                    dataKey="value"
                  >
                    <Cell fill="#2563eb" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <h4 className="text-center text-5xl font-bold">
              5,21,774
            </h4>
          </div>

          <div className="p-8">
            <h3 className="text-3xl font-bold mb-8">
              GitHub Commit Activity
            </h3>

            <div className="h-[350px]">
              <ResponsiveContainer>
                <LineChart data={commitData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="commits"
                    stroke="#14b8a6"
                    strokeWidth={4}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xl font-semibold mt-4">
              Average 18 commits per active week
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}