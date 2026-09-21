import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { faqs } from '../mock';
import { HelpCircle } from 'lucide-react';

const FAQ = () => {
  return (
    <section id="faq" className="inn-section bg-gradient-to-b from-white to-[#EAF1FF]/30">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#FFF1E5] items-center justify-center mb-4">
            <HelpCircle className="w-7 h-7 text-[#F77820]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Dúvidas Frequentes</h2>
          <p className="mt-3 text-slate-600">
            Ainda tem dúvidas sobre como usar a plataforma In&apos;Nova Envios? Confira as principais respostas:
          </p>
        </div>

        <Accordion type="single" collapsible className="bg-white rounded-2xl border border-slate-100 inn-shadow-card divide-y divide-slate-100">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-0 px-5">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-[#2A5BC7] hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
