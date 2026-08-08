import React from "react";
import Link from "next/link";
import { ChevronRight, TrendingUp } from "lucide-react";

export default function PopularSearches() {
  const searches = [
    {
      id: 1,
      title: "Jobs for Freshers",
      trending: "TRENDING AT #1",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop", 
      bgWord: "Freshers",
      link: "/jobs?experienceLevel=Entry-level",
      gradient: "from-blue-50 to-indigo-50",
      accent: "text-blue-600",
      btnHighlight: "text-blue-700 bg-blue-100/50 hover:bg-blue-100",
    },
    {
      id: 2,
      title: "Remote Work",
      trending: "TRENDING AT #2",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop", 
      bgWord: "Remote",
      link: "/jobs?jobType=Remote",
      gradient: "from-emerald-50 to-teal-50",
      accent: "text-emerald-600",
      btnHighlight: "text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100",
    },
    {
      id: 3,
      title: "Part Time Roles",
      trending: "TRENDING AT #3",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=300&h=300&fit=crop", 
      bgWord: "Part Time",
      link: "/jobs?jobType=Part-time",
      gradient: "from-purple-50 to-fuchsia-50",
      accent: "text-purple-600",
      btnHighlight: "text-purple-700 bg-purple-100/50 hover:bg-purple-100",
    },
    {
      id: 4,
      title: "Women in Tech",
      trending: "TRENDING AT #4",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop",
      bgWord: "Diversity",
      link: "/jobs",
      gradient: "from-rose-50 to-pink-50",
      accent: "text-rose-600",
      btnHighlight: "text-rose-700 bg-rose-100/50 hover:bg-rose-100",
    },
    {
      id: 5,
      title: "Executive Roles",
      trending: "TRENDING AT #5",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
      bgWord: "Executive",
      link: "/jobs?jobType=Full-time",
      gradient: "from-amber-50 to-orange-50",
      accent: "text-amber-600",
      btnHighlight: "text-amber-700 bg-amber-100/50 hover:bg-amber-100",
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
          
          {/* Left Title */}
          <div className="lg:col-span-1 flex flex-col justify-center text-center lg:text-left mb-6 lg:mb-0 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mx-auto lg:mx-0 w-max mb-6 shadow-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-xs font-bold uppercase tracking-wider">Top Queries</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
              Explore by <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#208f60]">Demand</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Discover the most searched categories on our platform today. Stay ahead of the curve.
            </p>
          </div>

          {/* Right Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              
              {searches.map((item, index) => (
                <Link 
                  key={item.id} 
                  href={item.link}
                  className={`block relative bg-gradient-to-br ${item.gradient} border border-white/50 rounded-3xl p-6 overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up ${index === 0 ? 'md:col-span-2' : 'col-span-1'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Faint Background Text */}
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full px-4 select-none pointer-events-none z-0">
                     <span className={`text-[50px] font-black whitespace-nowrap overflow-hidden inline-block opacity-[0.03] text-slate-900`}>{item.bgWord}</span>
                  </div>

                  {/* Content Container */}
                  <div className="relative z-10 h-full flex flex-col min-h-[160px]">
                    <span className={`text-[10px] font-black tracking-widest uppercase mb-2 ${item.accent}`}>{item.trending}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 w-2/3 leading-tight mb-auto">{item.title}</h3>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <div className={`px-4 py-2 rounded-full font-semibold text-xs flex items-center gap-1 transition-colors duration-300 ${item.btnHighlight}`}>
                        Explore <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Image Mask */}
                  <div className="absolute right-0 bottom-0 w-32 h-32 md:w-40 md:h-40 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 rounded-tl-full mix-blend-overlay"></div>
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded-tl-[100px]"
                    />
                  </div>
                </Link>
              ))}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
