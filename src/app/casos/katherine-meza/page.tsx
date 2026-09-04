import { CasoEstudioPage, casoMetadata } from "@/components/casos/CasoEstudioPage";
import { CASO_KM } from "@/content/casos";

export const metadata = casoMetadata(CASO_KM);

export default function KatherineMezaCasoPage() {
  return <CasoEstudioPage caso={CASO_KM} />;
}
