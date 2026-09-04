import { CasoEstudioPage, casoMetadata } from "@/components/casos/CasoEstudioPage";
import { CASO_HEBE } from "@/content/casos";

export const metadata = casoMetadata(CASO_HEBE);

export default function MetodoHebeCasoPage() {
  return <CasoEstudioPage caso={CASO_HEBE} />;
}
