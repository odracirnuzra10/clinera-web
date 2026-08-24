import { evento } from "@/config/evento";
import Reveal from "./Reveal";
import { ArrowRight } from "./Icons";

export default function CtaFinal() {
  return (
    <section className="bg-[#111111] pt-24 pb-24 sm:pt-28 sm:pb-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <p className="mono-eyebrow text-[#8A8A8A]">{evento.metadataMono}</p>
        </Reveal>

        <Reveal delay={70}>
          <p className="mt-6 max-w-3xl text-[34px] leading-[1.1] font-bold tracking-[-0.035em] text-white sm:text-[46px]">
            {evento.cupos.total} sillas. Una noche. La IA que ya trabaja en
            clínicas como la tuya.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <a
            href="#postular"
            className="group mt-9 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-[15px] font-medium text-[#111111] transition-transform duration-150 hover:bg-[#F7F6F3] active:scale-[0.98]"
          >
            Postular a mi cupo
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
