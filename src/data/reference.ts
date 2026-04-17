// ═══════════════════════════════════════════════════════════════════════════
// ABBREVIATIONS & TERMS GLOSSARY
// ═══════════════════════════════════════════════════════════════════════════

export interface GlossaryEntry {
  abbr: string;
  full: string;
  category: string;
  description: string;
}

export const GLOSSARY: GlossaryEntry[] = [
  // ── Protocols & Standards ─────────────────────────────────────────────
  { abbr: "ARP", full: "Address Resolution Protocol", category: "Protocol", description: "Resolves IPv4 addresses to MAC addresses on a local network segment." },
  { abbr: "BGP", full: "Border Gateway Protocol", category: "Protocol", description: "Exterior gateway protocol used to exchange routing information between autonomous systems on the internet." },
  { abbr: "CAPWAP", full: "Control and Provisioning of Wireless Access Points", category: "Protocol", description: "Protocol used between lightweight APs and wireless LAN controllers (UDP 5246/5247)." },
  { abbr: "CDP", full: "Cisco Discovery Protocol", category: "Protocol", description: "Cisco-proprietary Layer 2 protocol that discovers directly connected Cisco devices." },
  { abbr: "CSMA/CD", full: "Carrier Sense Multiple Access with Collision Detection", category: "Protocol", description: "Media access method used on half-duplex Ethernet to detect and handle collisions." },
  { abbr: "DHCP", full: "Dynamic Host Configuration Protocol", category: "Protocol", description: "Automatically assigns IP addresses, subnet masks, gateways, and DNS to clients." },
  { abbr: "DNS", full: "Domain Name System", category: "Protocol", description: "Resolves hostnames to IP addresses and vice versa." },
  { abbr: "DTP", full: "Dynamic Trunking Protocol", category: "Protocol", description: "Cisco protocol that negotiates whether a link becomes a trunk or access port." },
  { abbr: "EIGRP", full: "Enhanced Interior Gateway Routing Protocol", category: "Protocol", description: "Cisco advanced distance-vector routing protocol using DUAL algorithm." },
  { abbr: "EAP", full: "Extensible Authentication Protocol", category: "Protocol", description: "Authentication framework used with 802.1X for network access control." },
  { abbr: "FTP", full: "File Transfer Protocol", category: "Protocol", description: "Transfers files between client and server using TCP ports 20 (data) and 21 (control)." },
  { abbr: "GRE", full: "Generic Routing Encapsulation", category: "Protocol", description: "Tunneling protocol that encapsulates packets but provides no encryption." },
  { abbr: "HSRP", full: "Hot Standby Router Protocol", category: "Protocol", description: "Cisco-proprietary FHRP that provides a virtual gateway for high availability." },
  { abbr: "HTTP", full: "Hypertext Transfer Protocol", category: "Protocol", description: "Application-layer protocol for web communication (TCP port 80)." },
  { abbr: "HTTPS", full: "Hypertext Transfer Protocol Secure", category: "Protocol", description: "HTTP encrypted with TLS/SSL (TCP port 443)." },
  { abbr: "ICMP", full: "Internet Control Message Protocol", category: "Protocol", description: "Used for diagnostics (ping, traceroute) and error reporting between network devices." },
  { abbr: "IGMP", full: "Internet Group Management Protocol", category: "Protocol", description: "Manages multicast group memberships between hosts and routers." },
  { abbr: "IKE", full: "Internet Key Exchange", category: "Protocol", description: "Negotiates IPSec security associations and exchanges session keys (UDP port 500)." },
  { abbr: "IMAP", full: "Internet Message Access Protocol", category: "Protocol", description: "Email retrieval protocol that keeps messages on the server (TCP port 143, 993 for secure)." },
  { abbr: "IPSec", full: "Internet Protocol Security", category: "Protocol", description: "Suite of protocols providing encryption, integrity, and authentication for IP traffic." },
  { abbr: "IS-IS", full: "Intermediate System to Intermediate System", category: "Protocol", description: "Link-state routing protocol used in large ISP and enterprise networks." },
  { abbr: "LACP", full: "Link Aggregation Control Protocol", category: "Protocol", description: "IEEE 802.3ad standard for negotiating EtherChannel/LAG bundles." },
  { abbr: "LDAP", full: "Lightweight Directory Access Protocol", category: "Protocol", description: "Accesses and manages directory services like Active Directory (TCP port 389, 636 for secure)." },
  { abbr: "LLDP", full: "Link Layer Discovery Protocol", category: "Protocol", description: "IEEE standard Layer 2 neighbor discovery protocol (vendor-neutral alternative to CDP)." },
  { abbr: "NDP", full: "Neighbor Discovery Protocol", category: "Protocol", description: "IPv6 protocol replacing ARP — discovers neighbors, routers, and performs address autoconfiguration." },
  { abbr: "NETCONF", full: "Network Configuration Protocol", category: "Protocol", description: "Protocol for configuring network devices using XML over SSH (TCP port 830)." },
  { abbr: "NTP", full: "Network Time Protocol", category: "Protocol", description: "Synchronizes clocks across network devices (UDP port 123)." },
  { abbr: "OSPF", full: "Open Shortest Path First", category: "Protocol", description: "Link-state routing protocol using Dijkstra's algorithm (AD 110)." },
  { abbr: "PAgP", full: "Port Aggregation Protocol", category: "Protocol", description: "Cisco-proprietary protocol for negotiating EtherChannel bundles." },
  { abbr: "POP3", full: "Post Office Protocol version 3", category: "Protocol", description: "Email retrieval protocol that downloads messages to the client (TCP port 110, 995 for secure)." },
  { abbr: "RADIUS", full: "Remote Authentication Dial-In User Service", category: "Protocol", description: "AAA protocol that encrypts only the password (UDP ports 1812/1813)." },
  { abbr: "RESTCONF", full: "REST Configuration Protocol", category: "Protocol", description: "RESTful API for network device configuration using YANG models over HTTPS (TCP port 443)." },
  { abbr: "RIP", full: "Routing Information Protocol", category: "Protocol", description: "Distance-vector routing protocol using hop count (max 15) as its metric." },
  { abbr: "RSTP", full: "Rapid Spanning Tree Protocol", category: "Protocol", description: "IEEE 802.1w — faster-converging version of the original Spanning Tree Protocol." },
  { abbr: "SFTP", full: "SSH File Transfer Protocol", category: "Protocol", description: "Encrypted file transfer running over SSH (TCP port 22)." },
  { abbr: "SIP", full: "Session Initiation Protocol", category: "Protocol", description: "Signaling protocol for initiating, maintaining, and terminating VoIP sessions." },
  { abbr: "SMB", full: "Server Message Block", category: "Protocol", description: "File and printer sharing protocol (TCP port 445)." },
  { abbr: "SMTP", full: "Simple Mail Transfer Protocol", category: "Protocol", description: "Email relay between mail servers (TCP port 25, 587 for submission)." },
  { abbr: "SNMP", full: "Simple Network Management Protocol", category: "Protocol", description: "Monitors and manages network devices (UDP ports 161 for queries, 162 for traps)." },
  { abbr: "SSH", full: "Secure Shell", category: "Protocol", description: "Encrypted remote management protocol (TCP port 22)." },
  { abbr: "STP", full: "Spanning Tree Protocol", category: "Protocol", description: "IEEE 802.1D — prevents Layer 2 switching loops by blocking redundant paths." },
  { abbr: "TACACS+", full: "Terminal Access Controller Access-Control System Plus", category: "Protocol", description: "Cisco-proprietary AAA protocol that encrypts the entire payload (TCP port 49)." },
  { abbr: "TCP", full: "Transmission Control Protocol", category: "Protocol", description: "Reliable, connection-oriented Layer 4 protocol with flow control and error recovery." },
  { abbr: "TFTP", full: "Trivial File Transfer Protocol", category: "Protocol", description: "Simple, unencrypted file transfer (UDP port 69). Common for firmware upgrades." },
  { abbr: "TLS", full: "Transport Layer Security", category: "Protocol", description: "Cryptographic protocol providing encryption, integrity, and authentication. Successor to SSL." },
  { abbr: "UDP", full: "User Datagram Protocol", category: "Protocol", description: "Connectionless, best-effort Layer 4 protocol — faster than TCP, used for real-time traffic." },
  { abbr: "VTP", full: "VLAN Trunking Protocol", category: "Protocol", description: "Cisco protocol for synchronizing VLAN databases across switches in a domain." },
  { abbr: "VRRP", full: "Virtual Router Redundancy Protocol", category: "Protocol", description: "Open-standard FHRP providing a virtual default gateway for high availability." },

  // ── Technologies & Concepts ───────────────────────────────────────────
  { abbr: "AAA", full: "Authentication, Authorization, and Accounting", category: "Security", description: "Framework for controlling access: verify identity, grant permissions, log activity." },
  { abbr: "ACL", full: "Access Control List", category: "Security", description: "Ordered list of permit/deny rules filtering traffic by IP, port, and protocol." },
  { abbr: "AD", full: "Administrative Distance", category: "Routing", description: "Trustworthiness rating of a routing source. Lower AD = more trusted (connected=0, static=1, EIGRP=90, OSPF=110, RIP=120)." },
  { abbr: "AES", full: "Advanced Encryption Standard", category: "Security", description: "Symmetric encryption algorithm used in WPA2, IPSec, and TLS." },
  { abbr: "AH", full: "Authentication Header", category: "Security", description: "IPSec protocol providing integrity and authentication but NOT encryption." },
  { abbr: "AP", full: "Access Point", category: "Wireless", description: "Device that provides wireless network connectivity to clients." },
  { abbr: "APIPA", full: "Automatic Private IP Addressing", category: "Networking", description: "Self-assigns a 169.254.x.x address when no DHCP server is reachable." },
  { abbr: "ABR", full: "Area Border Router", category: "Routing", description: "OSPF router with interfaces in two or more areas, one of which must be area 0." },
  { abbr: "ASBR", full: "Autonomous System Boundary Router", category: "Routing", description: "OSPF router that redistributes routes from outside sources into OSPF." },
  { abbr: "BDR", full: "Backup Designated Router", category: "Routing", description: "OSPF role — takes over if the DR fails on a broadcast segment." },
  { abbr: "BPDU", full: "Bridge Protocol Data Unit", category: "Switching", description: "STP message exchanged between switches to build a loop-free topology." },
  { abbr: "BSS", full: "Basic Service Set", category: "Wireless", description: "One AP and its associated wireless clients." },
  { abbr: "CA", full: "Certificate Authority", category: "Security", description: "Trusted entity that issues and signs digital certificates." },
  { abbr: "CAM", full: "Content Addressable Memory", category: "Switching", description: "Switch table that maps MAC addresses to ports for frame forwarding." },
  { abbr: "CEF", full: "Cisco Express Forwarding", category: "Routing", description: "High-speed switching mechanism using a FIB and adjacency table." },
  { abbr: "CIA", full: "Confidentiality, Integrity, Availability", category: "Security", description: "The three pillars of information security." },
  { abbr: "CIDR", full: "Classless Inter-Domain Routing", category: "Networking", description: "IP addressing method using variable-length subnet masks (e.g., /24, /20)." },
  { abbr: "CRL", full: "Certificate Revocation List", category: "Security", description: "Published list of revoked digital certificates." },
  { abbr: "DAI", full: "Dynamic ARP Inspection", category: "Security", description: "Switch feature that validates ARP packets against the DHCP snooping binding table." },
  { abbr: "DNAT", full: "Destination Network Address Translation", category: "Networking", description: "Translates the destination IP of incoming packets (e.g., port forwarding)." },
  { abbr: "DORA", full: "Discover, Offer, Request, Acknowledge", category: "Networking", description: "The four-step DHCP process for obtaining an IP address." },
  { abbr: "DR", full: "Designated Router", category: "Routing", description: "OSPF role on broadcast segments — reduces adjacency count by acting as a central point." },
  { abbr: "DSCP", full: "Differentiated Services Code Point", category: "QoS", description: "6-bit field in the IP header used to mark packets for QoS treatment." },
  { abbr: "DUAL", full: "Diffusing Update Algorithm", category: "Routing", description: "Algorithm used by EIGRP to compute loop-free successor and feasible successor routes." },
  { abbr: "EF", full: "Expedited Forwarding", category: "QoS", description: "DSCP value 46 — reserved for low-latency traffic like voice RTP." },
  { abbr: "ESP", full: "Encapsulating Security Payload", category: "Security", description: "IPSec protocol providing encryption, integrity, and authentication." },
  { abbr: "ESS", full: "Extended Service Set", category: "Wireless", description: "Multiple BSSs sharing the same SSID for roaming across APs." },
  { abbr: "EUI-64", full: "Extended Unique Identifier 64-bit", category: "Networking", description: "Method of generating a 64-bit IPv6 interface ID from a 48-bit MAC address." },
  { abbr: "FIB", full: "Forwarding Information Base", category: "Routing", description: "CEF data structure derived from the routing table for fast hardware lookups." },
  { abbr: "FHRP", full: "First Hop Redundancy Protocol", category: "Routing", description: "Category of protocols (HSRP, VRRP, GLBP) providing virtual gateway redundancy." },
  { abbr: "GLBP", full: "Gateway Load Balancing Protocol", category: "Routing", description: "Cisco FHRP that provides load balancing across multiple gateways." },
  { abbr: "IDS", full: "Intrusion Detection System", category: "Security", description: "Passively monitors network traffic and alerts on suspicious activity." },
  { abbr: "IPS", full: "Intrusion Prevention System", category: "Security", description: "Sits inline and can actively block or drop malicious traffic." },
  { abbr: "LSA", full: "Link-State Advertisement", category: "Routing", description: "OSPF message containing link-state information shared between routers." },
  { abbr: "MAC", full: "Media Access Control", category: "Networking", description: "Unique 48-bit hardware address assigned to network interface cards." },
  { abbr: "MFA", full: "Multi-Factor Authentication", category: "Security", description: "Requires two or more factor types (know, have, are) for authentication." },
  { abbr: "MIB", full: "Management Information Base", category: "Management", description: "Hierarchical database of SNMP-managed objects on a network device." },
  { abbr: "MTU", full: "Maximum Transmission Unit", category: "Networking", description: "Largest packet size (in bytes) a network interface can transmit. Ethernet default is 1500." },
  { abbr: "NAT", full: "Network Address Translation", category: "Networking", description: "Translates private IPs to public IPs for internet access." },
  { abbr: "NSSA", full: "Not-So-Stubby Area", category: "Routing", description: "OSPF area type that restricts external LSAs but allows limited redistribution." },
  { abbr: "OID", full: "Object Identifier", category: "Management", description: "Unique identifier for objects in an SNMP MIB tree." },
  { abbr: "OSPF", full: "Open Shortest Path First", category: "Routing", description: "Link-state routing protocol using Dijkstra's SPF algorithm." },
  { abbr: "PAT", full: "Port Address Translation", category: "Networking", description: "NAT overload — many private IPs share one public IP using unique source ports." },
  { abbr: "PKI", full: "Public Key Infrastructure", category: "Security", description: "Ecosystem of CAs, certificates, and revocation systems for managing digital trust." },
  { abbr: "PoE", full: "Power over Ethernet", category: "Networking", description: "Delivers electrical power and data over the same Ethernet cable." },
  { abbr: "QoS", full: "Quality of Service", category: "QoS", description: "Network mechanisms for prioritizing certain traffic types (voice, video) over others." },
  { abbr: "RDP", full: "Remote Desktop Protocol", category: "Protocol", description: "Microsoft protocol for remote desktop sessions (TCP port 3389)." },
  { abbr: "RODC", full: "Read-Only Domain Controller", category: "Infrastructure", description: "Active Directory DC that holds a read-only copy of the AD database." },
  { abbr: "RSA", full: "Rivest-Shamir-Adleman", category: "Security", description: "Asymmetric encryption algorithm using public/private key pairs." },
  { abbr: "SA", full: "Security Association", category: "Security", description: "IPSec agreement between two peers defining encryption, authentication, and keys." },
  { abbr: "SDN", full: "Software-Defined Networking", category: "Architecture", description: "Separates control plane from data plane, centralizing control in a software controller." },
  { abbr: "SLAAC", full: "Stateless Address Autoconfiguration", category: "Networking", description: "IPv6 mechanism where hosts auto-generate addresses using router advertisements." },
  { abbr: "SNAT", full: "Source Network Address Translation", category: "Networking", description: "Translates the source IP of outgoing packets (e.g., internal → public)." },
  { abbr: "SSID", full: "Service Set Identifier", category: "Wireless", description: "Human-readable name identifying a wireless network." },
  { abbr: "VLAN", full: "Virtual Local Area Network", category: "Switching", description: "Logically segments a physical switch into separate broadcast domains." },
  { abbr: "VPN", full: "Virtual Private Network", category: "Security", description: "Encrypted tunnel over untrusted networks providing confidentiality and integrity." },
  { abbr: "VXLAN", full: "Virtual Extensible LAN", category: "Architecture", description: "Overlay protocol extending L2 over L3 using UDP port 4789 (supports 16M segments)." },
  { abbr: "WLC", full: "Wireless LAN Controller", category: "Wireless", description: "Central device that manages lightweight APs via CAPWAP." },
  { abbr: "YANG", full: "Yet Another Next Generation", category: "Architecture", description: "Data modeling language used with NETCONF/RESTCONF to define configuration structure." },
];

// ═══════════════════════════════════════════════════════════════════════════
// PORTS & PROTOCOLS REFERENCE
// ═══════════════════════════════════════════════════════════════════════════

export interface PortEntry {
  port: string;
  protocol: string;
  transport: string;
  fullName: string;
  notes: string;
}

export const PORTS: PortEntry[] = [
  { port: "20", protocol: "FTP", transport: "TCP", fullName: "File Transfer Protocol (Data)", notes: "Active mode data transfer" },
  { port: "21", protocol: "FTP", transport: "TCP", fullName: "File Transfer Protocol (Control)", notes: "Command/control channel" },
  { port: "22", protocol: "SSH/SFTP/SCP", transport: "TCP", fullName: "Secure Shell", notes: "Encrypted remote access and file transfer" },
  { port: "23", protocol: "Telnet", transport: "TCP", fullName: "Telnet", notes: "Cleartext remote access — use SSH instead" },
  { port: "25", protocol: "SMTP", transport: "TCP", fullName: "Simple Mail Transfer Protocol", notes: "Mail relay between servers" },
  { port: "49", protocol: "TACACS+", transport: "TCP", fullName: "Terminal Access Controller Access-Control System Plus", notes: "Cisco AAA — full payload encryption" },
  { port: "53", protocol: "DNS", transport: "UDP/TCP", fullName: "Domain Name System", notes: "UDP for queries, TCP for zone transfers" },
  { port: "67", protocol: "DHCP", transport: "UDP", fullName: "Dynamic Host Configuration Protocol (Server)", notes: "Server listens here" },
  { port: "68", protocol: "DHCP", transport: "UDP", fullName: "Dynamic Host Configuration Protocol (Client)", notes: "Client listens here" },
  { port: "69", protocol: "TFTP", transport: "UDP", fullName: "Trivial File Transfer Protocol", notes: "Simple file transfer, no auth — used for firmware" },
  { port: "80", protocol: "HTTP", transport: "TCP", fullName: "Hypertext Transfer Protocol", notes: "Unencrypted web traffic" },
  { port: "110", protocol: "POP3", transport: "TCP", fullName: "Post Office Protocol v3", notes: "Downloads email to client" },
  { port: "123", protocol: "NTP", transport: "UDP", fullName: "Network Time Protocol", notes: "Clock synchronization" },
  { port: "143", protocol: "IMAP", transport: "TCP", fullName: "Internet Message Access Protocol", notes: "Email — keeps messages on server" },
  { port: "161", protocol: "SNMP", transport: "UDP", fullName: "Simple Network Management Protocol (Queries)", notes: "Manager → Agent queries" },
  { port: "162", protocol: "SNMP Trap", transport: "UDP", fullName: "Simple Network Management Protocol (Traps)", notes: "Agent → Manager alerts" },
  { port: "389", protocol: "LDAP", transport: "TCP/UDP", fullName: "Lightweight Directory Access Protocol", notes: "Directory services (AD)" },
  { port: "443", protocol: "HTTPS", transport: "TCP", fullName: "Hypertext Transfer Protocol Secure", notes: "Encrypted web traffic (TLS)" },
  { port: "445", protocol: "SMB", transport: "TCP", fullName: "Server Message Block", notes: "File/printer sharing (modern, direct)" },
  { port: "500", protocol: "IKE/ISAKMP", transport: "UDP", fullName: "Internet Key Exchange", notes: "IPSec key negotiation" },
  { port: "514", protocol: "Syslog", transport: "UDP", fullName: "Syslog", notes: "Centralized logging" },
  { port: "587", protocol: "SMTP", transport: "TCP", fullName: "Simple Mail Transfer Protocol (Submission)", notes: "Authenticated client mail submission" },
  { port: "636", protocol: "LDAPS", transport: "TCP", fullName: "Lightweight Directory Access Protocol Secure", notes: "LDAP over TLS" },
  { port: "830", protocol: "NETCONF", transport: "TCP", fullName: "Network Configuration Protocol", notes: "Over SSH — device config via XML/YANG" },
  { port: "993", protocol: "IMAPS", transport: "TCP", fullName: "Internet Message Access Protocol Secure", notes: "IMAP over TLS" },
  { port: "995", protocol: "POP3S", transport: "TCP", fullName: "Post Office Protocol v3 Secure", notes: "POP3 over TLS" },
  { port: "1433", protocol: "SQL Server", transport: "TCP", fullName: "Microsoft SQL Server", notes: "Default instance" },
  { port: "1812", protocol: "RADIUS", transport: "UDP", fullName: "Remote Authentication Dial-In User Service (Auth)", notes: "Authentication" },
  { port: "1813", protocol: "RADIUS", transport: "UDP", fullName: "Remote Authentication Dial-In User Service (Acct)", notes: "Accounting" },
  { port: "3306", protocol: "MySQL", transport: "TCP", fullName: "MySQL Database", notes: "Default port" },
  { port: "3389", protocol: "RDP", transport: "TCP", fullName: "Remote Desktop Protocol", notes: "Windows remote desktop" },
  { port: "4500", protocol: "IPSec NAT-T", transport: "UDP", fullName: "IPSec NAT Traversal", notes: "IKE + ESP over NAT" },
  { port: "4789", protocol: "VXLAN", transport: "UDP", fullName: "Virtual Extensible LAN", notes: "L2 overlay over L3" },
  { port: "5060", protocol: "SIP", transport: "TCP/UDP", fullName: "Session Initiation Protocol", notes: "VoIP signaling (unencrypted)" },
  { port: "5246", protocol: "CAPWAP", transport: "UDP", fullName: "Control and Provisioning of Wireless APs (Control)", notes: "AP → WLC control channel" },
  { port: "5247", protocol: "CAPWAP", transport: "UDP", fullName: "Control and Provisioning of Wireless APs (Data)", notes: "AP → WLC data channel" },
  { port: "5432", protocol: "PostgreSQL", transport: "TCP", fullName: "PostgreSQL Database", notes: "Default port" },
  { port: "5900", protocol: "VNC", transport: "TCP", fullName: "Virtual Network Computing", notes: "Remote desktop (cross-platform)" },
];

// ═══════════════════════════════════════════════════════════════════════════
// SUBNETTING QUICK REFERENCE
// ═══════════════════════════════════════════════════════════════════════════

export interface SubnetRefEntry {
  cidr: number;
  mask: string;
  wildcard: string;
  blockSize: number;
  usableHosts: number;
  numSubnetsFromClassC: string;
}

export const SUBNET_CHART: SubnetRefEntry[] = [
  { cidr: 8, mask: "255.0.0.0", wildcard: "0.255.255.255", blockSize: 16777216, usableHosts: 16777214, numSubnetsFromClassC: "—" },
  { cidr: 9, mask: "255.128.0.0", wildcard: "0.127.255.255", blockSize: 8388608, usableHosts: 8388606, numSubnetsFromClassC: "—" },
  { cidr: 10, mask: "255.192.0.0", wildcard: "0.63.255.255", blockSize: 4194304, usableHosts: 4194302, numSubnetsFromClassC: "—" },
  { cidr: 11, mask: "255.224.0.0", wildcard: "0.31.255.255", blockSize: 2097152, usableHosts: 2097150, numSubnetsFromClassC: "—" },
  { cidr: 12, mask: "255.240.0.0", wildcard: "0.15.255.255", blockSize: 1048576, usableHosts: 1048574, numSubnetsFromClassC: "—" },
  { cidr: 13, mask: "255.248.0.0", wildcard: "0.7.255.255", blockSize: 524288, usableHosts: 524286, numSubnetsFromClassC: "—" },
  { cidr: 14, mask: "255.252.0.0", wildcard: "0.3.255.255", blockSize: 262144, usableHosts: 262142, numSubnetsFromClassC: "—" },
  { cidr: 15, mask: "255.254.0.0", wildcard: "0.1.255.255", blockSize: 131072, usableHosts: 131070, numSubnetsFromClassC: "—" },
  { cidr: 16, mask: "255.255.0.0", wildcard: "0.0.255.255", blockSize: 65536, usableHosts: 65534, numSubnetsFromClassC: "—" },
  { cidr: 17, mask: "255.255.128.0", wildcard: "0.0.127.255", blockSize: 32768, usableHosts: 32766, numSubnetsFromClassC: "—" },
  { cidr: 18, mask: "255.255.192.0", wildcard: "0.0.63.255", blockSize: 16384, usableHosts: 16382, numSubnetsFromClassC: "—" },
  { cidr: 19, mask: "255.255.224.0", wildcard: "0.0.31.255", blockSize: 8192, usableHosts: 8190, numSubnetsFromClassC: "—" },
  { cidr: 20, mask: "255.255.240.0", wildcard: "0.0.15.255", blockSize: 4096, usableHosts: 4094, numSubnetsFromClassC: "—" },
  { cidr: 21, mask: "255.255.248.0", wildcard: "0.0.7.255", blockSize: 2048, usableHosts: 2046, numSubnetsFromClassC: "—" },
  { cidr: 22, mask: "255.255.252.0", wildcard: "0.0.3.255", blockSize: 1024, usableHosts: 1022, numSubnetsFromClassC: "—" },
  { cidr: 23, mask: "255.255.254.0", wildcard: "0.0.1.255", blockSize: 512, usableHosts: 510, numSubnetsFromClassC: "—" },
  { cidr: 24, mask: "255.255.255.0", wildcard: "0.0.0.255", blockSize: 256, usableHosts: 254, numSubnetsFromClassC: "1" },
  { cidr: 25, mask: "255.255.255.128", wildcard: "0.0.0.127", blockSize: 128, usableHosts: 126, numSubnetsFromClassC: "2" },
  { cidr: 26, mask: "255.255.255.192", wildcard: "0.0.0.63", blockSize: 64, usableHosts: 62, numSubnetsFromClassC: "4" },
  { cidr: 27, mask: "255.255.255.224", wildcard: "0.0.0.31", blockSize: 32, usableHosts: 30, numSubnetsFromClassC: "8" },
  { cidr: 28, mask: "255.255.255.240", wildcard: "0.0.0.15", blockSize: 16, usableHosts: 14, numSubnetsFromClassC: "16" },
  { cidr: 29, mask: "255.255.255.248", wildcard: "0.0.0.7", blockSize: 8, usableHosts: 6, numSubnetsFromClassC: "32" },
  { cidr: 30, mask: "255.255.255.252", wildcard: "0.0.0.3", blockSize: 4, usableHosts: 2, numSubnetsFromClassC: "64" },
  { cidr: 31, mask: "255.255.255.254", wildcard: "0.0.0.1", blockSize: 2, usableHosts: 0, numSubnetsFromClassC: "128 (point-to-point)" },
  { cidr: 32, mask: "255.255.255.255", wildcard: "0.0.0.0", blockSize: 1, usableHosts: 0, numSubnetsFromClassC: "256 (host route)" },
];

// ═══════════════════════════════════════════════════════════════════════════
// AD (Administrative Distance) CHART
// ═══════════════════════════════════════════════════════════════════════════

export interface ADEntry {
  source: string;
  ad: number;
}

export const AD_CHART: ADEntry[] = [
  { source: "Directly Connected", ad: 0 },
  { source: "Static Route", ad: 1 },
  { source: "EIGRP Summary Route", ad: 5 },
  { source: "eBGP (External BGP)", ad: 20 },
  { source: "EIGRP (Internal)", ad: 90 },
  { source: "IGRP", ad: 100 },
  { source: "OSPF", ad: 110 },
  { source: "IS-IS", ad: 115 },
  { source: "RIP", ad: 120 },
  { source: "EIGRP (External)", ad: 170 },
  { source: "iBGP (Internal BGP)", ad: 200 },
  { source: "Unknown / Unreachable", ad: 255 },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER — Build abbreviation expansion map for question explanations
// ═══════════════════════════════════════════════════════════════════════════

const _abbrMap = new Map<string, string>();
GLOSSARY.forEach((g) => _abbrMap.set(g.abbr, g.full));

/** Returns "ABBR (Full Name)" if the abbreviation is known, or just the input */
export function expandAbbr(abbr: string): string {
  const full = _abbrMap.get(abbr);
  return full ? `${abbr} (${full})` : abbr;
}
