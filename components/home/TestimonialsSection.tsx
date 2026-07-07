import React from "react";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Shiwangi Singla",
      tag: "PLACED",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop", // placeholder
      text: `"Thanks Tejomarg for helping me find a job without much hassle. If you are a fresher or a skilled person with expert knowledge in a specific field, you can easily find a job through the app."`
    },
    {
      name: "Jenil Chovariya",
      tag: "PLACED",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", // placeholder
      text: `"This app is very helpful if you are looking for a job and the team is also very supportive and friendly. They guided me through every stage. It is very easy to find a job on Tejomarg."`
    },
    {
      name: "Kaynat Mansuri",
      tag: "PLACED",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", // placeholder
      text: `"It is definitely a great app with correct and true information on the job details. I am happy to use it and I would also recommend my friends to use it for their career development."`
    },
  ];

  return (
    <section className="bg-slate-50 relative overflow-hidden">
      {/* Background split (Green left, light right) */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[35%] bg-[#208f60]"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row relative z-10">
        
        {/* Left Column (Green Area) */}
        <div className="lg:w-[35%] py-16 px-8 lg:pr-12 lg:pl-8 text-white flex flex-col justify-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-8">
            <span className="text-3xl font-serif text-white leading-none -mt-2">"</span>
          </div>
          
          <h2 className="text-3xl font-bold leading-snug mb-16">
            Join the community of 5 crore satisfied job seekers...
          </h2>
          
          <div>
            <p className="text-sm font-semibold mb-2">Play Store Ratings</p>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
          </div>
        </div>

        {/* Right Column (Cards) */}
        <div className="lg:w-[65%] py-16 px-4 sm:px-8 lg:pl-12 flex items-center bg-slate-50">
          <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x w-full">
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl shadow-md border border-slate-100 p-6 min-w-[300px] w-[300px] sm:min-w-[340px] sm:w-[340px] shrink-0 snap-start flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      {t.name} 
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase">
                        {t.tag}
                      </span>
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-bold text-slate-700">{t.rating}</span>
                      <div className="flex items-center text-amber-400">
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-600 text-sm italic leading-relaxed">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
