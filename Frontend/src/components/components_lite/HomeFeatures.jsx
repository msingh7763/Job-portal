import React from "react";
import { Search, Briefcase, Rocket, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Search fast",
    description:
      "Quickly find the roles that match your skills using smart search and filters.",
  },
  {
    icon: Briefcase,
    title: "Curated opportunities",
    description:
      "We handpick the best roles from top companies so you spend less time searching.",
  },
  {
    icon: Rocket,
    title: "Apply in seconds",
    description:
      "Save your profile and apply to jobs in just a few clicks with our streamlined process.",
  },
  {
    icon: ShieldCheck,
    title: "Stay organized",
    description:
      "Track applications, interviews, and offers from one clean dashboard.",
  },
];

const HomeFeatures = () => {
  return (
    <section className="bg-slate-900/70 border border-slate-800 rounded-3xl shadow-sm backdrop-blur-sm p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100">
            Why people love JobPortal
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-2">
            From curated role recommendations to fast applications, get everything you
            need to land your next role—all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:shadow-lg" 
              >
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeFeatures;
