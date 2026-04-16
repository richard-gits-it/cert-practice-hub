export type Difficulty = "easy" | "medium" | "hard";

export interface SubnetQuestion {
  id: string;
  question: string;
  answer: string;
  hint: string;
}

export interface SubnetProblem {
  ip: string;
  cidr: number;
  mask: string;
  networkAddr: string;
  broadcastAddr: string;
  usableHosts: number;
  wildcardMask: string;
  firstUsable: string;
  lastUsable: string;
  questions: SubnetQuestion[];
  difficulty: Difficulty;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cidrToMask(cidr: number): number[] {
  const mask: number[] = [];
  for (let i = 0; i < 4; i++) {
    const bits = Math.min(8, Math.max(0, cidr - i * 8));
    mask.push(256 - Math.pow(2, 8 - bits));
  }
  return mask;
}

function getNetworkAddress(octets: number[], cidr: number): number[] {
  const mask = cidrToMask(cidr);
  return octets.map((o, i) => o & mask[i]);
}

function getBroadcastAddress(octets: number[], cidr: number): number[] {
  const mask = cidrToMask(cidr);
  return octets.map((o, i) => (o & mask[i]) | (255 - mask[i]));
}

function incrementIP(octets: number[]): number[] {
  const r = [...octets];
  for (let i = 3; i >= 0; i--) {
    r[i]++;
    if (r[i] <= 255) break;
    r[i] = 0;
  }
  return r;
}

function decrementIP(octets: number[]): number[] {
  const r = [...octets];
  for (let i = 3; i >= 0; i--) {
    r[i]--;
    if (r[i] >= 0) break;
    r[i] = 255;
  }
  return r;
}

export function toBinary(addr: string): string {
  return addr
    .split(".")
    .map((o) => Number(o).toString(2).padStart(8, "0"))
    .join(".");
}

export function generateSubnetProblem(difficulty: Difficulty = "medium"): SubnetProblem {
  let cidr: number;
  let octets: number[];

  if (difficulty === "easy") {
    cidr = [8, 16, 24][randomInt(0, 2)];
    octets = [randomInt(1, 223), randomInt(0, 255), randomInt(0, 255), randomInt(1, 254)];
  } else if (difficulty === "medium") {
    cidr = randomInt(17, 30);
    octets = [randomInt(1, 223), randomInt(0, 255), randomInt(0, 255), randomInt(1, 254)];
  } else {
    cidr = randomInt(20, 30);
    octets = [192 + randomInt(0, 31), randomInt(0, 255), randomInt(0, 255), randomInt(1, 254)];
  }

  const ip = octets.join(".");
  const mask = cidrToMask(cidr);
  const networkAddr = getNetworkAddress(octets, cidr);
  const broadcastAddr = getBroadcastAddress(octets, cidr);
  const usableHosts = Math.max(0, Math.pow(2, 32 - cidr) - 2);
  const wildcardMask = mask.map((o) => 255 - o).join(".");
  const firstUsable = usableHosts > 0 ? incrementIP(networkAddr) : null;
  const lastUsable = usableHosts > 0 ? decrementIP(broadcastAddr) : null;

  const allQuestions: SubnetQuestion[] = [
    { id: "network", question: "Network address?", answer: networkAddr.join("."), hint: "AND the IP with the subnet mask" },
    { id: "broadcast", question: "Broadcast address?", answer: broadcastAddr.join("."), hint: "Set all host bits to 1" },
    { id: "usable", question: "Usable host count?", answer: String(usableHosts), hint: "2^(32 − CIDR) − 2" },
    { id: "wildcard", question: "Wildcard mask?", answer: wildcardMask, hint: "255.255.255.255 minus subnet mask" },
    { id: "mask", question: "Subnet mask (dotted decimal)?", answer: mask.join("."), hint: `/${cidr} → ${cidr} ones, ${32 - cidr} zeros` },
    { id: "first_usable", question: "First usable host?", answer: firstUsable ? firstUsable.join(".") : "N/A", hint: "Network address + 1" },
    { id: "last_usable", question: "Last usable host?", answer: lastUsable ? lastUsable.join(".") : "N/A", hint: "Broadcast address − 1" },
  ];

  const selected = allQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, difficulty === "easy" ? 3 : 4);

  return {
    ip,
    cidr,
    mask: mask.join("."),
    networkAddr: networkAddr.join("."),
    broadcastAddr: broadcastAddr.join("."),
    usableHosts,
    wildcardMask,
    firstUsable: firstUsable ? firstUsable.join(".") : "N/A",
    lastUsable: lastUsable ? lastUsable.join(".") : "N/A",
    questions: selected,
    difficulty,
  };
}
