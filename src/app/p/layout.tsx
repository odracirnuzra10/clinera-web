import { PartnerShell } from "@/components/partner/PartnerShell";

export default function PartnerSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PartnerShell>{children}</PartnerShell>;
}
