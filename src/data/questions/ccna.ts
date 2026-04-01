import { Question } from "../types";

const ccnaQuestions: Question[] = [
  // ── Network Fundamentals ──────────────────────────────────────────────
  {
    id: "ccna-001",
    cert: "ccna",
    domain: "Network Fundamentals",
    type: "flashcard",
    prompt: "What layer of the OSI model does a switch primarily operate at?",
    options: [],
    correct_answer: "Layer 2 (Data Link)",
    explanation:
      "Switches use MAC addresses to forward frames, operating at Layer 2. Layer 3 switches can also route, but traditional switches are L2 devices.",
  },
  {
    id: "ccna-002",
    cert: "ccna",
    domain: "Network Fundamentals",
    type: "multiple_choice",
    prompt: "Which protocol resolves IP addresses to MAC addresses?",
    options: ["DNS", "ARP", "DHCP", "ICMP"],
    correct_answer: "ARP",
    explanation:
      "Address Resolution Protocol (ARP) maps a known IP address to a MAC address on the local network segment.",
  },
  {
    id: "ccna-003",
    cert: "ccna",
    domain: "Network Fundamentals",
    type: "multiple_choice",
    prompt: "What is the subnet mask for a /20 network?",
    options: ["255.255.240.0", "255.255.248.0", "255.255.224.0", "255.255.252.0"],
    correct_answer: "255.255.240.0",
    explanation:
      "/20 = 20 network bits. Third octet: 4 borrowed bits = 11110000 = 240. So 255.255.240.0.",
  },
  {
    id: "ccna-004",
    cert: "ccna",
    domain: "Network Fundamentals",
    type: "flashcard",
    prompt: "What is the purpose of a VLAN?",
    options: [],
    correct_answer:
      "To logically segment a network at Layer 2, reducing broadcast domains and improving security.",
    explanation:
      "VLANs allow you to group ports on a switch into separate broadcast domains without needing separate physical switches.",
  },
  {
    id: "ccna-005",
    cert: "ccna",
    domain: "Network Fundamentals",
    type: "multiple_choice",
    prompt: "Which layer of the OSI model is responsible for end-to-end delivery and flow control?",
    options: ["Network", "Transport", "Session", "Data Link"],
    correct_answer: "Transport",
    explanation:
      "Layer 4 (Transport) handles end-to-end communication, flow control, and error recovery. TCP and UDP operate here.",
  },

  // ── Network Access ────────────────────────────────────────────────────
  {
    id: "ccna-006",
    cert: "ccna",
    domain: "Network Access",
    type: "multiple_choice",
    prompt: "What does STP (802.1D) prevent?",
    options: ["IP conflicts", "Layer 2 loops", "VLAN hopping", "ARP spoofing"],
    correct_answer: "Layer 2 loops",
    explanation:
      "Spanning Tree Protocol prevents switching loops by placing redundant ports in a blocking state, creating a loop-free logical topology.",
  },
  {
    id: "ccna-007",
    cert: "ccna",
    domain: "Network Access",
    type: "flashcard",
    prompt: "What is the difference between an access port and a trunk port?",
    options: [],
    correct_answer:
      "An access port carries traffic for a single VLAN. A trunk port carries traffic for multiple VLANs using 802.1Q tagging.",
    explanation:
      "Access ports connect end devices. Trunk ports connect switches to each other (or to routers) and tag frames with VLAN IDs.",
  },
  {
    id: "ccna-008",
    cert: "ccna",
    domain: "Network Access",
    type: "multiple_choice",
    prompt: "Which 802.1Q field is added to an Ethernet frame for VLAN tagging?",
    options: [
      "4-byte tag with TPID and TCI",
      "2-byte VLAN ID only",
      "8-byte extended header",
      "16-byte security field",
    ],
    correct_answer: "4-byte tag with TPID and TCI",
    explanation:
      "802.1Q inserts a 4-byte tag between the source MAC and EtherType fields. It includes a 2-byte TPID (0x8100) and 2-byte TCI containing priority, DEI, and 12-bit VLAN ID.",
  },
  {
    id: "ccna-009",
    cert: "ccna",
    domain: "Network Access",
    type: "multiple_choice",
    prompt: "What is the maximum number of VLANs supported by 802.1Q?",
    options: ["1024", "2048", "4094", "4096"],
    correct_answer: "4094",
    explanation:
      "The 12-bit VLAN ID field supports 4096 values (0–4095), but VLAN 0 and 4095 are reserved, leaving 4094 usable VLANs.",
  },
  {
    id: "ccna-010",
    cert: "ccna",
    domain: "Network Access",
    type: "flashcard",
    prompt: "What is EtherChannel and why is it used?",
    options: [],
    correct_answer:
      "EtherChannel bundles multiple physical links into one logical link, increasing bandwidth and providing redundancy without triggering STP.",
    explanation:
      "Without EtherChannel, STP would block redundant parallel links. EtherChannel treats them as a single link, so STP sees no loop.",
  },

  // ── IP Connectivity ───────────────────────────────────────────────────
  {
    id: "ccna-011",
    cert: "ccna",
    domain: "IP Connectivity",
    type: "multiple_choice",
    prompt: "What is the default administrative distance of OSPF?",
    options: ["90", "100", "110", "120"],
    correct_answer: "110",
    explanation:
      "OSPF has an AD of 110. EIGRP internal is 90, RIP is 120, static routes are 1, and directly connected is 0.",
  },
  {
    id: "ccna-012",
    cert: "ccna",
    domain: "IP Connectivity",
    type: "flashcard",
    prompt:
      "What is the difference between a routing protocol and a routed protocol?",
    options: [],
    correct_answer:
      "A routing protocol (OSPF, EIGRP) discovers and maintains routes. A routed protocol (IP, IPv6) is the protocol whose packets are being forwarded.",
    explanation:
      "Routing protocols build the routing table. Routed protocols are the actual data being forwarded based on that table.",
  },
  {
    id: "ccna-013",
    cert: "ccna",
    domain: "IP Connectivity",
    type: "multiple_choice",
    prompt: "In OSPF, what type of LSA is generated by an ABR to advertise inter-area routes?",
    options: ["Type 1 (Router LSA)", "Type 2 (Network LSA)", "Type 3 (Summary LSA)", "Type 5 (External LSA)"],
    correct_answer: "Type 3 (Summary LSA)",
    explanation:
      "Area Border Routers generate Type 3 Summary LSAs to advertise routes from one OSPF area into another.",
  },
  {
    id: "ccna-014",
    cert: "ccna",
    domain: "IP Connectivity",
    type: "multiple_choice",
    prompt: "What metric does OSPF use to determine the best path?",
    options: ["Hop count", "Bandwidth", "Cost (based on bandwidth)", "Delay + bandwidth"],
    correct_answer: "Cost (based on bandwidth)",
    explanation:
      "OSPF cost = reference bandwidth / interface bandwidth. The default reference bandwidth is 100 Mbps. Lower cost = preferred path.",
  },
  {
    id: "ccna-015",
    cert: "ccna",
    domain: "IP Connectivity",
    type: "flashcard",
    prompt: "What is a floating static route?",
    options: [],
    correct_answer:
      "A static route configured with a higher administrative distance than the primary routing protocol, so it only activates as a backup if the primary route fails.",
    explanation:
      "Example: ip route 0.0.0.0 0.0.0.0 10.1.1.1 210 — AD 210 means it won't be used while OSPF (AD 110) has a route to the same destination.",
  },

  // ── IP Services ───────────────────────────────────────────────────────
  {
    id: "ccna-016",
    cert: "ccna",
    domain: "IP Services",
    type: "multiple_choice",
    prompt: "Which DHCP message is sent first by a client?",
    options: ["DHCPREQUEST", "DHCPOFFER", "DHCPDISCOVER", "DHCPACK"],
    correct_answer: "DHCPDISCOVER",
    explanation:
      "DORA: Discover → Offer → Request → Acknowledge. The client broadcasts a DHCPDISCOVER to find available DHCP servers.",
  },
  {
    id: "ccna-017",
    cert: "ccna",
    domain: "IP Services",
    type: "flashcard",
    prompt: "What is NAT and what problem does it solve?",
    options: [],
    correct_answer:
      "Network Address Translation converts private IPs to public IPs, allowing multiple internal devices to share a single public IP for internet access.",
    explanation:
      "NAT conserves IPv4 address space and provides a layer of security by hiding internal network structure.",
  },
  {
    id: "ccna-018",
    cert: "ccna",
    domain: "IP Services",
    type: "multiple_choice",
    prompt: "What is the purpose of an NTP server?",
    options: [
      "Assign IP addresses to clients",
      "Synchronize clocks across network devices",
      "Resolve hostnames to IPs",
      "Monitor network traffic",
    ],
    correct_answer: "Synchronize clocks across network devices",
    explanation:
      "Network Time Protocol (NTP) ensures all devices have consistent timestamps, which is critical for logging, authentication, and troubleshooting.",
  },
  {
    id: "ccna-019",
    cert: "ccna",
    domain: "IP Services",
    type: "multiple_choice",
    prompt: "Which DNS record type maps a hostname to an IPv4 address?",
    options: ["AAAA", "CNAME", "A", "MX"],
    correct_answer: "A",
    explanation:
      "An A record maps a domain name to an IPv4 address. AAAA maps to IPv6. CNAME is an alias. MX is for mail servers.",
  },
  {
    id: "ccna-020",
    cert: "ccna",
    domain: "IP Services",
    type: "flashcard",
    prompt: "What is the difference between SNAT, DNAT, and PAT?",
    options: [],
    correct_answer:
      "SNAT changes the source IP, DNAT changes the destination IP, and PAT (overload) maps multiple private IPs to one public IP using different port numbers.",
    explanation:
      "PAT is the most common form of NAT in home and enterprise networks, allowing thousands of internal hosts to share a single public IP.",
  },

  // ── Security Fundamentals ─────────────────────────────────────────────
  {
    id: "ccna-021",
    cert: "ccna",
    domain: "Security Fundamentals",
    type: "multiple_choice",
    prompt: "Which command enables SSH on a Cisco router?",
    options: [
      "ip ssh version 2",
      "transport input ssh",
      "crypto key generate rsa",
      "line vty 0 4",
    ],
    correct_answer: "crypto key generate rsa",
    explanation:
      "You must generate RSA keys before SSH will function. 'transport input ssh' restricts VTY lines to SSH only, but key generation is the enabling step.",
  },
  {
    id: "ccna-022",
    cert: "ccna",
    domain: "Security Fundamentals",
    type: "flashcard",
    prompt: "What is the difference between an ACL and a firewall?",
    options: [],
    correct_answer:
      "ACLs are simple permit/deny rules on router interfaces filtering by IP/port. Firewalls are stateful devices that track connections and offer deeper inspection (IPS, application filtering).",
    explanation:
      "ACLs are a basic first line of filtering. Firewalls maintain state tables and can make more intelligent forwarding decisions.",
  },
  {
    id: "ccna-023",
    cert: "ccna",
    domain: "Security Fundamentals",
    type: "multiple_choice",
    prompt: "What does AAA stand for in network security?",
    options: [
      "Access, Audit, Alert",
      "Authentication, Authorization, Accounting",
      "Assign, Authenticate, Authorize",
      "Access, Authorization, Accounting",
    ],
    correct_answer: "Authentication, Authorization, Accounting",
    explanation:
      "AAA: Authentication verifies identity, Authorization defines permissions, Accounting tracks what users do. Implemented via RADIUS or TACACS+.",
  },
  {
    id: "ccna-024",
    cert: "ccna",
    domain: "Security Fundamentals",
    type: "multiple_choice",
    prompt: "Which port does HTTPS use by default?",
    options: ["80", "443", "8080", "8443"],
    correct_answer: "443",
    explanation: "HTTPS uses TCP port 443. HTTP uses port 80. 8080 and 8443 are common alternative/proxy ports.",
  },
  {
    id: "ccna-025",
    cert: "ccna",
    domain: "Security Fundamentals",
    type: "flashcard",
    prompt: "What is port security on a Cisco switch?",
    options: [],
    correct_answer:
      "Port security limits the number of MAC addresses allowed on a switch port and defines violation actions (shutdown, restrict, protect) to prevent unauthorized access.",
    explanation:
      "Configured with 'switchport port-security'. It can learn MACs dynamically, use sticky learning, or be statically configured.",
  },

  // ── Automation & Programmability ──────────────────────────────────────
  {
    id: "ccna-026",
    cert: "ccna",
    domain: "Automation & Programmability",
    type: "flashcard",
    prompt: "What data format does a REST API typically return?",
    options: [],
    correct_answer: "JSON (JavaScript Object Notation)",
    explanation:
      "REST APIs commonly use JSON for data exchange due to its lightweight, human-readable structure. XML is also possible but less common in modern APIs.",
  },
  {
    id: "ccna-027",
    cert: "ccna",
    domain: "Automation & Programmability",
    type: "multiple_choice",
    prompt: "Which HTTP method is used to create a new resource via a REST API?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correct_answer: "POST",
    explanation:
      "POST creates a new resource. GET reads, PUT updates/replaces, PATCH partially updates, and DELETE removes a resource.",
  },
  {
    id: "ccna-028",
    cert: "ccna",
    domain: "Automation & Programmability",
    type: "flashcard",
    prompt: "What is Ansible and how does it configure network devices?",
    options: [],
    correct_answer:
      "Ansible is an agentless automation tool that uses SSH to push configuration changes to network devices via declarative YAML playbooks.",
    explanation:
      "Unlike Puppet or Chef, Ansible doesn't require an agent on the managed device. It connects over SSH and executes tasks defined in playbooks.",
  },
  {
    id: "ccna-029",
    cert: "ccna",
    domain: "Automation & Programmability",
    type: "multiple_choice",
    prompt: "What does SDN stand for?",
    options: [
      "Software Defined Networking",
      "System Deployment Network",
      "Secure Data Node",
      "Service Distribution Network",
    ],
    correct_answer: "Software Defined Networking",
    explanation:
      "SDN separates the control plane from the data plane, allowing centralized programmable management of network infrastructure.",
  },
  {
    id: "ccna-030",
    cert: "ccna",
    domain: "Automation & Programmability",
    type: "multiple_choice",
    prompt: "In a REST API response, which HTTP status code means 'Created'?",
    options: ["200", "201", "204", "301"],
    correct_answer: "201",
    explanation:
      "201 Created means the request succeeded and a new resource was created. 200 is generic OK, 204 is No Content, 301 is a redirect.",
  },
];

export default ccnaQuestions;
