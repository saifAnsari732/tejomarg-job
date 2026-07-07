import React from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Truck, Megaphone, Laptop, Briefcase, Car, TrendingUp, Users, Wrench, Activity } from "lucide-react";

export default function TrendingRoles() {
  const roles = [
    { name: "Retail / Counter Sales", openings: "1,490", icon: ShoppingBag },
    { name: "Logistics / Warehouse", openings: "1,337", icon: Truck },
    { name: "Marketing", openings: "995", icon: Megaphone },
    { name: "Back Office", openings: "936", icon: Briefcase },
    { name: "Business Operations", openings: "684", icon: TrendingUp },
    { name: "Driver", openings: "677", icon: Car },
    { name: "Digital / Online Mark...", openings: "625", icon: Laptop },
    { name: "Human Resource", openings: "617", icon: Users },
    { name: "Technician", openings: "556", icon: Wrench },
    { name: "Lab Technician / Assi...", openings: "128", icon: Activity },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#28214c] text-center mb-10">
          Trending job roles on Tejomarg
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {roles.map((role, i) => (
            <Link 
              key={i} 
              href={`/jobs?search=${encodeURIComponent(role.name.split('/')[0].trim())}`}
              className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white hover:border-emerald-300 hover:shadow-md transition-all group w-[280px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:text-emerald-600 transition-colors">
                  <role.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {role.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {role.openings} openings
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
           <Link 
              href="/jobs" 
              className="inline-flex items-center justify-center px-10 py-2.5 border border-emerald-600 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
           >
              View all <ChevronRight className="h-4 w-4 ml-2" />
           </Link>
        </div>
      </div>
    </section>
  );
}
