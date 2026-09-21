import React from 'react';
import { blogPosts } from '../mock';
import { ArrowRight } from 'lucide-react';

const BlogSection = () => {
  return (
    <section id="blog" className="inn-section bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Descubra como <span className="inn-text-gradient">vender mais</span>
            </h2>
            <p className="mt-2 text-slate-600">Aprenda com nossos conteúdos exclusivos do blog In&apos;Nova.</p>
          </div>
          <a href="#" className="text-sm font-semibold text-[#2A5BC7] hover:text-[#F77820] inline-flex items-center gap-1">
            Ver todos os artigos <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <a key={post.title} href={post.link} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 inn-shadow-card">
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <span className="text-[10px] font-semibold tracking-widest text-[#F77820] uppercase">Blog In&apos;Nova</span>
                <h3 className="mt-2 font-bold text-slate-900 leading-snug group-hover:text-[#2A5BC7] transition-colors">{post.title}</h3>
                <p className="mt-3 text-sm font-semibold text-[#2A5BC7] inline-flex items-center gap-1 group-hover:gap-2 transition-all">Leia mais <ArrowRight className="w-4 h-4" /></p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
