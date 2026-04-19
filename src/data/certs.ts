export interface Cert {
  id: string;
  slug: string;
  name: string;
  code: string;
  color: string;
  icon: string;
  available: boolean;
  hasSubnet: boolean;
  domains: string[];
}

export const CERTS: Cert[] = [
  {
    id: "ccna",
    slug: "ccna",
    name: "Cisco CCNA",
    code: "200-301",
    color: "#00d4ff",
    icon: "⬡",
    available: true,
    hasSubnet: true,
    domains: [
      "Network Fundamentals",
      "Network Access",
      "IP Connectivity",
      "IP Services",
      "Security Fundamentals",
      "Automation & Programmability",
    ],
  },
  {
    id: "network-plus",
    slug: "network-plus",
    name: "CompTIA Network+",
    code: "N10-009",
    color: "#00ff9d",
    icon: "◈",
    available: false,
    hasSubnet: true,
    domains: [
      "Networking Concepts",
      "Network Implementation",
      "Network Operations",
      "Network Security",
      "Network Troubleshooting",
    ],
  },
  {
    id: "security-plus",
    slug: "security-plus",
    name: "CompTIA Security+",
    code: "SY0-701",
    color: "#ff3e8e",
    icon: "◆",
    available: false,
    hasSubnet: false,
    domains: [
      "General Security Concepts",
      "Threats, Vulnerabilities & Mitigations",
      "Security Architecture",
      "Security Operations",
      "Security Program Management",
    ],
  },
  {
    id: "a-plus",
    slug: "a-plus",
    name: "CompTIA A+",
    code: "220-1101 / 1102",
    color: "#ffd700",
    icon: "◇",
    available: false,
    hasSubnet: false,
    domains: [
      "Mobile Devices",
      "Networking",
      "Hardware",
      "Virtualization & Cloud",
      "Troubleshooting",
    ],
  },
  {
    id: "itec285",
    slug: "itec285",
    name: "ITEC 285 Pen Testing",
    code: "MHC Winter 2026",
    color: "#c084fc",
    icon: "☠",
    available: true,
    hasSubnet: false,
    domains: [
      "Introduction to Security",
      "The Seven Rules of Security",
      "Kali Linux & Virtual Machine Environment",
      "Penetration Testing -- Recon & OSINT",
      "Penetration Testing -- Scanning",
      "Cryptography Part I -- Classical Ciphers & Cryptanalysis",
      "Cryptography Part II -- PKI, Quantum Computing & Key Exchange",
      "Authentication, Hashing & PBKDFs",
      "Azure, TLS & Certificate Authorities",
      "Security Architecture -- Firewalls & Proxies",
      "Protecting Windows Networks -- GPO, Active Directory & AppLocker",
      "Wireless Security",
      "Traffic Capture, ARP & Man-in-the-Middle Attacks",
      "Lab: Windows Password Cracking",
      "Metasploit, Post-Exploitation & C2 Frameworks",
      "Web-Based Exploitation & Defence",
      "Final Review -- Mixed Topics",
    ],
  },
];

export function getCertBySlug(slug: string): Cert | undefined {
  return CERTS.find((c) => c.slug === slug);
}

export function getAvailableCertSlugs(): string[] {
  return CERTS.filter((c) => c.available).map((c) => c.slug);
}
