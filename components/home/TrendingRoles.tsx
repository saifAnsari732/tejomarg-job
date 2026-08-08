import React from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Truck, Megaphone, Laptop, Briefcase, Car, TrendingUp, Users, Wrench, Activity } from "lucide-react";

export default function TrendingRoles() {
  const roles = [
    { name: "Retail / Counter Sales", openings: "1,490", icon: ShoppingBag, color: "text-rose-500", bg: "bg-rose-50" },
    { name: "Logistics / Warehouse", openings: "1,337", icon: Truck, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Marketing", openings: "995", icon: Megaphone, color: "text-sky-500", bg: "bg-sky-50" },
    { name: "Back Office", openings: "936", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Business Operations", openings: "684", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Driver", openings: "677", icon: Car, color: "text-amber-500", bg: "bg-amber-50" },
    { name: "Digital Marketing", openings: "625", icon: Laptop, color: "text-cyan-500", bg: "bg-cyan-50" },
    { name: "Human Resource", openings: "617", icon: Users, color: "text-pink-500", bg: "bg-pink-50" },
    { name: "Technician", openings: "556", icon: Wrench, color: "text-slate-600", bg: "bg-slate-100" },
    { name: "Lab Technician", openings: "128", icon: Activity, color: "text-violet-500", bg: "bg-violet-50" },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Job Roles</span>
          </h2>
          <p className="text-slate-500 text-lg">Find the most in-demand roles on our platform.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {roles.map((role, i) => (
            <Link 
              key={i} 
              href={`/jobs?search=${encodeURIComponent(role.name.split('/')[0].trim())}`}
              className="flex items-center justify-between p-4 border border-slate-200/70 rounded-2xl bg-white hover:border-blue-300 hover:shadow-[0_10px_20px_rgba(79,70,229,0.08)] hover:-translate-y-1 transition-all duration-300 group w-[280px] sm:w-[300px] animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role.bg} ${role.color} group-hover:scale-110 transition-transform`}>
                  <role.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {role.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {role.openings} active openings
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
           <Link 
              href="/jobs" 
              className="inline-flex items-center justify-center px-10 py-3 border border-blue-200 text-blue-600 font-semibold rounded-full hover:bg-blue-50 hover:border-blue-300 shadow-sm transition-all"
           >
              Explore all roles <ChevronRight className="h-4 w-4 ml-2" />
           </Link>
        </div>
      </div>
    </section>
  );
}
