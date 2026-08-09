import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      {/* Skeleton Hero Header */}
      <div className="relative bg-slate-200 animate-pulse pt-16 pb-20 mb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left h-24 flex flex-col justify-center gap-4">
          <div className="h-10 w-3/4 sm:w-1/2 bg-slate-300 rounded-lg"></div>
          <div className="h-6 w-full sm:w-2/3 bg-slate-300 rounded-md"></div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Skeleton Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-[800px] animate-pulse">
               <div className="h-6 w-32 bg-slate-200 rounded mb-8"></div>
               <div className="space-y-8">
                 {[1,2,3,4,5].map(i => (
                    <div key={i}>
                       <div className="h-5 w-24 bg-slate-200 rounded mb-4"></div>
                       <div className="h-2 w-full bg-slate-100 rounded mb-3"></div>
                       <div className="h-2 w-3/4 bg-slate-100 rounded mb-3"></div>
                       <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                    </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Skeleton Jobs List */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Skeleton Section Header */}
            <div className="bg-white p-4 sm:px-6 rounded-2xl border border-slate-200 shadow-sm h-16 animate-pulse flex items-center justify-between">
               <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
               <div className="h-8 w-32 bg-slate-100 rounded-md hidden sm:block"></div>
            </div>

            {/* Skeleton Job Cards */}
            <div className="space-y-4">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 animate-pulse flex flex-col justify-between">
                    <div className="flex gap-4">
                       <div className="w-14 h-14 rounded-xl bg-slate-200 shrink-0"></div>
                       <div className="flex-1 space-y-3">
                          <div className="h-6 w-3/4 sm:w-1/2 bg-slate-200 rounded"></div>
                          <div className="h-4 w-1/2 sm:w-1/3 bg-slate-100 rounded"></div>
                       </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                       <div className="h-6 w-20 bg-slate-100 rounded-md"></div>
                       <div className="h-6 w-24 bg-slate-100 rounded-md"></div>
                       <div className="h-6 w-16 bg-slate-100 rounded-md"></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
