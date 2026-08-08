import React from "react";
import { Star, Quote } from "lucide-react";

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
    <section className="bg-slate-50 py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-blue-100/50 rounded-bl-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-sky-100/50 rounded-tr-full blur-3xl -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            Join the community of <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">5 crore</span> satisfied job seekers
          </h2>
          
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-bold mb-2 text-slate-500 uppercase tracking-widest">Play Store Ratings</p>
            <div className="flex items-center gap-1.5 text-amber-400 mb-2">
              <Star className="h-6 w-6 fill-current drop-shadow-sm" />
              <Star className="h-6 w-6 fill-current drop-shadow-sm" />
              <Star className="h-6 w-6 fill-current drop-shadow-sm" />
              <Star className="h-6 w-6 fill-current drop-shadow-sm" />
              <Star className="h-6 w-6 fill-current drop-shadow-sm" />
            </div>
            <p className="text-sm text-slate-500 font-medium">Based on 1.2M+ reviews</p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(79,70,229,0.1)] hover:-translate-y-2 transition-all duration-300 border border-slate-100 p-8 flex flex-col relative group animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              {/* Gradient Top Border on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl"></div>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-50 shadow-sm" />
                <div>
                  <h4 className="font-bold text-slate-800 text-base flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    {t.name} 
                    <span className="text-[10px] w-max bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {t.tag}
                    </span>
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-bold text-slate-700">{t.rating}</span>
                    <div className="flex items-center text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current text-amber-400/30" />
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-600 text-sm sm:text-base italic leading-relaxed relative z-10 flex-1">
                {t.text}
              </p>
              
              <Quote className="absolute bottom-6 right-6 w-16 h-16 text-blue-50 -z-0 rotate-180 transition-colors group-hover:text-blue-100/50" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
