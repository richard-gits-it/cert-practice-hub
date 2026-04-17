/**
 * Subnetting Engine v2
 *
 * Modes:
 *   - classic:    Random 3-4 questions per problem (original)
 *   - full:       All 6 fields — network, first, last, broadcast, mask, wildcard
 *   - vlsm:      Given a network + department sizes, subnet with VLSM
 *   - rapidfire:  Match CIDR ↔ dotted decimal mask (speed drill)
 */

export type Difficulty = "easy" | "medium" | "hard";
export type DrillMode = "classic" | "full" | "vlsm" | "rapidfire";

// ═══════════════════════════════════════════════════════════════════════════
// Core helpers
// ═══════════════════════════════════════════════════════════════════════════

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function cidrToMask(cidr: number): number[] {
  const mask: number[] = [];
  for (let i = 0; i < 4; i++) {
    const bits = Math.min(8, Math.max(0, cidr - i * 8));
    mask.push(256 - Math.pow(2, 8 - bits));
  }
  return mask;
}

export function maskToCidr(mask: number[]): number {
  let cidr = 0;
  for (const octet of mask) {
    let val = octet;
    while (val > 0) {
      cidr += val & 1;
      val >>= 1;
    }
  }
  return cidr;
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

function ipToNum(octets: number[]): number {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

function numToIp(num: number): number[] {
  return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255];
}

// ═══════════════════════════════════════════════════════════════════════════
// Classic / Full drill problems
// ═══════════════════════════════════════════════════════════════════════════

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

function generateOctets(difficulty: Difficulty): { octets: number[]; cidr: number } {
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

  return { octets, cidr };
}

function buildAllQuestions(
  ip: string,
  cidr: number,
  mask: number[],
  networkAddr: number[],
  broadcastAddr: number[],
  usableHosts: number,
  wildcardMask: string,
  firstUsable: number[] | null,
  lastUsable: number[] | null
): SubnetQuestion[] {
  return [
    { id: "network", question: "Network address?", answer: networkAddr.join("."), hint: "AND the IP with the subnet mask" },
    { id: "broadcast", question: "Broadcast address?", answer: broadcastAddr.join("."), hint: "Set all host bits to 1" },
    { id: "usable", question: "Usable host count?", answer: String(usableHosts), hint: "2^(32 − CIDR) − 2" },
    { id: "wildcard", question: "Wildcard mask?", answer: wildcardMask, hint: "255.255.255.255 minus subnet mask" },
    { id: "mask", question: "Subnet mask (dotted decimal)?", answer: mask.join("."), hint: `/${cidr} → ${cidr} ones, ${32 - cidr} zeros` },
    { id: "first_usable", question: "First usable host?", answer: firstUsable ? firstUsable.join(".") : "N/A", hint: "Network address + 1" },
    { id: "last_usable", question: "Last usable host?", answer: lastUsable ? lastUsable.join(".") : "N/A", hint: "Broadcast address − 1" },
  ];
}

export function generateSubnetProblem(difficulty: Difficulty, mode: "classic" | "full" = "classic"): SubnetProblem {
  const { octets, cidr } = generateOctets(difficulty);
  const ip = octets.join(".");
  const mask = cidrToMask(cidr);
  const networkAddr = getNetworkAddress(octets, cidr);
  const broadcastAddr = getBroadcastAddress(octets, cidr);
  const usableHosts = Math.max(0, Math.pow(2, 32 - cidr) - 2);
  const wildcardMask = mask.map((o) => 255 - o).join(".");
  const firstUsable = usableHosts > 0 ? incrementIP(networkAddr) : null;
  const lastUsable = usableHosts > 0 ? decrementIP(broadcastAddr) : null;

  const allQuestions = buildAllQuestions(ip, cidr, mask, networkAddr, broadcastAddr, usableHosts, wildcardMask, firstUsable, lastUsable);

  let selected: SubnetQuestion[];
  if (mode === "full") {
    // All 7 questions, fixed order
    selected = allQuestions;
  } else {
    // Classic: random 3-4
    selected = shuffle(allQuestions).slice(0, difficulty === "easy" ? 3 : 4);
  }

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

// ═══════════════════════════════════════════════════════════════════════════
// Rapid Fire — CIDR ↔ dotted decimal mask memorization
// ═══════════════════════════════════════════════════════════════════════════

export type RapidFireDirection = "cidr_to_mask" | "mask_to_cidr" | "mixed";

export interface RapidFireQuestion {
  prompt: string;
  answer: string;
  cidr: number;
  mask: string;
}

const ALL_CIDR_MASKS: { cidr: number; mask: string }[] = [];
for (let c = 1; c <= 32; c++) {
  ALL_CIDR_MASKS.push({ cidr: c, mask: cidrToMask(c).join(".") });
}

export function generateRapidFireSet(
  count: number = 10,
  direction: RapidFireDirection = "mixed",
  range: "all" | "common" = "common"
): RapidFireQuestion[] {
  // Common = /8 through /30 (skip /31 and /32 for beginners)
  const pool = range === "common"
    ? ALL_CIDR_MASKS.filter((m) => m.cidr >= 8 && m.cidr <= 30)
    : ALL_CIDR_MASKS;

  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((entry) => {
    let dir: "cidr_to_mask" | "mask_to_cidr";
    if (direction === "mixed") {
      dir = Math.random() > 0.5 ? "cidr_to_mask" : "mask_to_cidr";
    } else {
      dir = direction;
    }

    if (dir === "cidr_to_mask") {
      return {
        prompt: `What is the dotted decimal mask for /${entry.cidr}?`,
        answer: entry.mask,
        cidr: entry.cidr,
        mask: entry.mask,
      };
    } else {
      return {
        prompt: `What CIDR notation equals ${entry.mask}?`,
        answer: `/${entry.cidr}`,
        cidr: entry.cidr,
        mask: entry.mask,
      };
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// VLSM — Variable Length Subnet Masking
// ═══════════════════════════════════════════════════════════════════════════

export interface VLSMDepartment {
  name: string;
  hostsNeeded: number;
}

export interface VLSMSubnetAnswer {
  department: string;
  hostsNeeded: number;
  cidr: number;
  mask: string;
  networkAddr: string;
  firstUsable: string;
  lastUsable: string;
  broadcastAddr: string;
  usableHosts: number;
}

export interface VLSMProblem {
  givenNetwork: string;
  givenCidr: number;
  departments: VLSMDepartment[];
  answers: VLSMSubnetAnswer[];
  totalAddressesAvailable: number;
  totalAddressesUsed: number;
}

const DEPARTMENT_NAMES = [
  "Sales", "Engineering", "Marketing", "HR", "Finance",
  "IT", "Support", "Operations", "Executive", "R&D",
  "Legal", "Warehouse", "Shipping", "QA", "Design",
  "Server Room", "Guest WiFi", "VoIP", "Security Cameras", "Printers",
];

/** Find the smallest CIDR that fits N hosts */
function cidrForHosts(hosts: number): number {
  for (let cidr = 30; cidr >= 1; cidr--) {
    const usable = Math.pow(2, 32 - cidr) - 2;
    if (usable >= hosts) return cidr;
  }
  return 1;
}

export function generateVLSMProblem(difficulty: Difficulty): VLSMProblem {
  let baseCidr: number;
  let deptCount: number;
  let hostRanges: [number, number];

  if (difficulty === "easy") {
    baseCidr = randomInt(16, 20);
    deptCount = 3;
    hostRanges = [10, 100];
  } else if (difficulty === "medium") {
    baseCidr = randomInt(16, 22);
    deptCount = randomInt(4, 5);
    hostRanges = [5, 200];
  } else {
    baseCidr = randomInt(18, 24);
    deptCount = randomInt(5, 7);
    hostRanges = [2, 500];
  }

  // Generate random first octet in Class A/B/C range
  const firstOctet = randomInt(10, 200);
  const secondOctet = randomInt(0, 255);
  const baseOctets = getNetworkAddress(
    [firstOctet, secondOctet, 0, 0],
    baseCidr
  );
  const baseNetwork = baseOctets.join(".");

  // Pick department names and sizes
  const names = shuffle(DEPARTMENT_NAMES).slice(0, deptCount);
  const departments: VLSMDepartment[] = names.map((name) => ({
    name,
    hostsNeeded: randomInt(hostRanges[0], hostRanges[1]),
  }));

  // Sort departments largest-first (VLSM rule)
  departments.sort((a, b) => b.hostsNeeded - a.hostsNeeded);

  // Allocate subnets
  let currentNetNum = ipToNum(baseOctets);
  const totalAvailable = Math.pow(2, 32 - baseCidr);
  const answers: VLSMSubnetAnswer[] = [];
  let totalUsed = 0;

  for (const dept of departments) {
    const subCidr = cidrForHosts(dept.hostsNeeded);
    const subSize = Math.pow(2, 32 - subCidr);
    const usable = subSize - 2;

    // Align to subnet boundary
    const alignedStart = Math.ceil(currentNetNum / subSize) * subSize;
    const netOctets = numToIp(alignedStart);
    const bcastOctets = numToIp(alignedStart + subSize - 1);
    const firstOctets = numToIp(alignedStart + 1);
    const lastOctets = numToIp(alignedStart + subSize - 2);

    answers.push({
      department: dept.name,
      hostsNeeded: dept.hostsNeeded,
      cidr: subCidr,
      mask: cidrToMask(subCidr).join("."),
      networkAddr: netOctets.join("."),
      firstUsable: firstOctets.join("."),
      lastUsable: lastOctets.join("."),
      broadcastAddr: bcastOctets.join("."),
      usableHosts: usable,
    });

    currentNetNum = alignedStart + subSize;
    totalUsed += subSize;
  }

  return {
    givenNetwork: baseNetwork,
    givenCidr: baseCidr,
    departments,
    answers,
    totalAddressesAvailable: totalAvailable,
    totalAddressesUsed: totalUsed,
  };
}
