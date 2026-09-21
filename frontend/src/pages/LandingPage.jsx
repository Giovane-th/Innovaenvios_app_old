import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PricingExamples from '../components/PricingExamples';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import MediaMentions from '../components/MediaMentions';
import BlogSection from '../components/BlogSection';
import FAQ from '../components/FAQ';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <PricingExamples />
        <HowItWorks />
        <Features />
        <Testimonials />
        <MediaMentions />
        <BlogSection />
        <FAQ />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
