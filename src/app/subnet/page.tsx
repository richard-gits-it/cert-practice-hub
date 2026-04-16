import SubnetDrill from "@/components/modes/SubnetDrill";

export const metadata = {
  title: "Subnetting Drill — Infinite Practice",
  description:
    "Algorithmically generated subnetting problems with binary breakdowns. Free practice for CCNA, Network+, and any networking cert.",
};

export default function SubnetPage() {
  return <SubnetDrill backHref="/" />;
}
