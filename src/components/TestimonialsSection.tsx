import Image from 'next/image';
import type { Testimonial } from '@/lib/testimonials';
import { getPublishableTestimonials } from '@/lib/testimonials';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

// Fase 8 (plan-seo.md): componente inerte hasta que exista al menos un
// testimonio real con permission=true — no trae datos por defecto, así
// que usarlo sin props reales simplemente no renderiza nada. Ver
// src/lib/testimonials.ts para el porqué de este diseño.
export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const publishable = getPublishableTestimonials(testimonials);

  if (publishable.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#0A0A23] mb-10">
          Lo que dicen nuestros clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishable.map((t) => (
            <figure
              key={`${t.clientName}-${t.date}`}
              className="rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <blockquote className="text-gray-700 text-sm leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                {t.logo && (
                  <Image
                    src={t.logo}
                    alt={t.company}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain shrink-0"
                  />
                )}
                <div>
                  <p className="font-semibold text-[#0A0A23] text-sm">{t.clientName}</p>
                  <p className="text-gray-400 text-xs">
                    {t.role} · {t.company}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
