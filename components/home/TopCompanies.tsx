"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function TopCompanies() {
  const companies = [
    {
      id: "1",
      name: "Bajaj Allianz Life Insurance",
      desc: "Provider of life insurance and financial services.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Bajaj_Allianz_Life_Insurance_Company_Logo.svg/512px-Bajaj_Allianz_Life_Insurance_Company_Logo.svg.png",
      color: "text-blue-700"
    },
    {
      id: "2",
      name: "Paytm Service Pvt. Ltd.",
      desc: "Digital payment and e-commerce facilitator.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png",
      color: "text-blue-500"
    },
    {
      id: "3",
      name: "Zomato",
      desc: "Online food delivery marketplace.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Zomato_Logo.svg/512px-Zomato_Logo.svg.png",
      color: "text-red-500"
    },
    {
      id: "4",
      name: "Swiggy",
      desc: "Food delivery and online ordering platform.",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Swiggy_logo.svg/512px-Swiggy_logo.svg.png",
      color: "text-orange-500"
    },
    {
      id: "5",
      name: "Kotak Mahindra Bank",
      desc: "Leading banking and financial services company.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Kotak_Mahindra_Bank_logo.svg/512px-Kotak_Mahindra_Bank_logo.svg.png",
      color: "text-red-600"
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#28214c] text-center mb-12">
          Job Openings in Top companies
        </h2>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 hide-scrollbar snap-x">
          {companies.map((company) => (
            <div 
              key={company.id} 
              className="bg-white border border-slate-100 rounded-xl p-6 min-w-[280px] w-[280px] shrink-0 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between snap-start h-[260px]"
            >
              <div>
                <div className="h-12 flex items-center justify-start mb-6">
                  {/* Fallback to text if img fails, but attempting to use real logos from wikimedia */}
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="max-h-8 max-w-[120px] object-contain object-left" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <span className={`hidden font-black text-xl ${company.color}`}>{company.name.split(' ')[0]}</span>
                </div>
                
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">{company.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {company.desc}
                </p>
              </div>

              <div className="mt-6">
                <Link 
                  href={`/jobs?search=${company.name.split(' ')[0]}`}
                  className="text-emerald-700 font-semibold text-sm hover:text-emerald-800 flex items-center"
                >
                  View jobs <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel indicators (visual only) */}
        <div className="flex justify-center mt-2">
           <div className="h-1.5 w-16 bg-slate-200 rounded-full flex">
             <div className="h-full w-1/3 bg-emerald-700 rounded-full"></div>
           </div>
        </div>

        <div className="text-center mt-12">
           <Link 
              href="/jobs" 
              className="inline-flex items-center justify-center px-8 py-2.5 border border-emerald-600 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
           >
              View all <ChevronRight className="h-4 w-4 ml-2" />
           </Link>
        </div>
      </div>
    </section>
  );
}
