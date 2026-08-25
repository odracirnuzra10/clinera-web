import { PartnerShell } from "@/components/partner/PartnerShell";

export default function PartnerVanityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PartnerShell>{children}</PartnerShell>;
}
