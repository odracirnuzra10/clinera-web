import { CasoEstudioPage, casoMetadata } from "@/components/casos/CasoEstudioPage";
import { CASO_LUMINA } from "@/content/casos";

export const metadata = casoMetadata(CASO_LUMINA);

export default function ProtocoloLuminaCasoPage() {
  return <CasoEstudioPage caso={CASO_LUMINA} />;
}
