import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PopularSearches() {
  const searches = [
    {
      id: 1,
      title: "Jobs for Freshers",
      trending: "TRENDING AT #1",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop", // student girl
      bgWord: "Jobs for F",
      link: "/jobs?experienceLevel=Entry-level",
      btnStyle: "bg-orange-200 hover:bg-orange-300 text-orange-900 border-transparent",
      cardBorder: "border-orange-200"
    },
    {
      id: 2,
      title: "Work from home Jobs",
      trending: "TRENDING AT #2",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop", // guy on laptop
      bgWord: "Work from",
      link: "/jobs?jobType=Remote",
      btnStyle: "bg-transparent text-slate-900 hover:bg-slate-50 border-transparent",
      cardBorder: "border-slate-100"
    },
    {
      id: 3,
      title: "Part time Jobs",
      trending: "TRENDING AT #3",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=300&h=300&fit=crop", // guy with phone
      bgWord: "Part time J",
      link: "/jobs?jobType=Part-time",
      btnStyle: "bg-transparent text-slate-900 hover:bg-slate-50 border-transparent",
      cardBorder: "border-slate-100"
    },
    {
      id: 4,
      title: "Jobs for Women",
      trending: "TRENDING AT #4",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop", // professional woman
      bgWord: "Jobs for W",
      link: "/jobs",
      btnStyle: "bg-transparent text-slate-900 hover:bg-slate-50 border-transparent",
      cardBorder: "border-slate-100"
    },
    {
      id: 5,
      title: "Full time Jobs",
      trending: "TRENDING AT #5",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop", // professional man
      bgWord: "Full time J",
      link: "/jobs?jobType=Full-time",
      btnStyle: "bg-transparent text-slate-900 hover:bg-slate-50 border-transparent",
      cardBorder: "border-slate-100"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Title */}
          <div className="lg:col-span-1 flex flex-col justify-center">
            <h2 className="text-4xl lg:text-5xl font-black text-[#28214c] leading-tight mb-8 lg:mb-0">
              Popular Searches on Tejomarg
            </h2>
          </div>

          {/* Right Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              
              {/* Force the first card to take full width of the first row on md screens if we wanted, 
                  but screenshot shows it spans 2 cols roughly, or just regular grid.
                  The screenshot shows Jobs for freshers is wider, maybe col-span-2. Let's make it col-span-2 on md */}
              {searches.map((item, index) => (
                <Link 
                  key={item.id} 
                  href={item.link}
                  className={`block relative bg-white border ${item.cardBorder} rounded-3xl p-6 overflow-hidden group hover:shadow-lg transition-shadow ${index === 0 ? 'md:col-span-2' : 'col-span-1'}`}
                >
                  {/* Faint Background Text */}
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full px-4 select-none pointer-events-none z-0">
                     <span className="text-[50px] font-black text-slate-50 whitespace-nowrap opacity-60 overflow-hidden inline-block">{item.bgWord}</span>
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-between min-h-[160px]">
                    <div className={`max-w-[55%] sm:max-w-[60%] ${index === 0 ? 'md:max-w-[70%]' : ''}`}>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">{item.trending}</p>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{item.title}</h3>
                    </div>
                    
                    <div className="mt-8">
                      <span className={`inline-flex items-center text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full ${item.btnStyle}`}>
                        View all <ChevronRight className="h-4 w-4 ml-1" />
                      </span>
                    </div>
                  </div>

                  {/* Absolute Image */}
                  <div className="absolute bottom-0 right-0 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 z-0 drop-shadow-md overflow-hidden flex items-end justify-end">
                    {/* Using object-top to keep faces visible */}
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="object-cover object-top w-full h-full rounded-tl-[40px] sm:rounded-tl-[50px] md:rounded-tl-[60px]"
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
