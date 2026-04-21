// Static data for the Vertex Network Solutions site

const NAV_LINKS = [
  { href: "index.html", label: "Home", match: ["", "index.html"] },
  { href: "services.html", label: "Services", match: ["services.html"] },
  { href: "products.html", label: "Products", match: ["products.html"] },
  { href: "about.html", label: "About", match: ["about.html"] },
  { href: "contact.html", label: "Contact", match: ["contact.html"] },
];

const SERVICES = [
  {
    id: "network-setup",
    title: "Network Setup & Architecture",
    description:
      "Enterprise-grade network infrastructure design and deployment. We build resilient, high-performance networks tailored to your business requirements with redundancy and scalability built in.",
    icon: "network",
    features: [
      "Custom network topology design",
      "High-availability architecture",
      "VLAN segmentation & micro-segmentation",
      "SD-WAN implementation",
      "Wireless infrastructure deployment",
      "Network performance optimization",
    ],
  },
  {
    id: "security-monitoring",
    title: "Security & Monitoring",
    description:
      "24/7 threat detection and response with advanced SIEM integration. Our SOC team monitors your infrastructure around the clock, ensuring rapid incident response and compliance.",
    icon: "shield",
    features: [
      "24/7 Security Operations Center",
      "SIEM & log management",
      "Intrusion detection & prevention",
      "Vulnerability assessments",
      "Penetration testing",
      "Compliance auditing (SOC 2, ISO 27001)",
    ],
  },
  {
    id: "cloud-deployment",
    title: "Cloud & Server Deployment",
    description:
      "Seamless cloud migration and hybrid infrastructure management. From bare-metal servers to multi-cloud orchestration, we handle deployment, scaling, and maintenance.",
    icon: "cloud",
    features: [
      "Multi-cloud architecture (AWS, Azure, GCP)",
      "Kubernetes orchestration",
      "CI/CD pipeline setup",
      "Infrastructure as Code (Terraform)",
      "Disaster recovery planning",
      "Auto-scaling & load balancing",
    ],
  },
];

const PRODUCTS = [
  {
    id: "securenet-router-pro",
    name: "SecureNet Router Pro",
    description:
      "Enterprise-grade router with built-in firewall, IDS/IPS, and zero-trust network access. Handles up to 10Gbps throughput with deep packet inspection enabled.",
    price: 2499,
    icon: "shield",
    features: [
      "10Gbps throughput",
      "Built-in IDS/IPS",
      "Zero-trust access control",
      "WPA3 Enterprise WiFi 6E",
      "VPN concentrator (500 tunnels)",
      "Automated threat intelligence feeds",
    ],
    category: "Hardware",
  },
  {
    id: "netwatch-dashboard",
    name: "NetWatch Dashboard",
    description:
      "Real-time network monitoring and analytics platform. Visualize traffic patterns, detect anomalies, and respond to incidents from a single unified dashboard.",
    price: 899,
    icon: "server",
    features: [
      "Real-time traffic visualization",
      "AI-powered anomaly detection",
      "Custom alerting rules",
      "API integration support",
      "Historical trend analysis",
      "Multi-tenant support",
    ],
    category: "Software",
  },
  {
    id: "officeconnect-starter",
    name: "OfficeConnect Starter Kit",
    description:
      "Complete networking solution for small to medium offices. Includes managed switch, access point, and firewall — preconfigured for immediate deployment.",
    price: 1299,
    icon: "wifi",
    features: [
      "Managed 24-port PoE switch",
      "WiFi 6 access point",
      "Next-gen firewall appliance",
      "Cloud management portal",
      "Automated setup wizard",
      "1-year premium support included",
    ],
    category: "Bundle",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Mohamed Alqubaisi",
    role: "CEO & Founder",
    bio: "20+ years in enterprise networking. Former infrastructure lead at Cisco Systems.",
  },
  {
    name: "Victor",
    role: "CTO",
    bio: "Cloud architecture expert. Previously led platform engineering at AWS.",
  },
  {
    name: "Julian",
    role: "Head of Security",
    bio: "CISSP, CEH certified. Former cybersecurity analyst at the NSA.",
  },
  {
    name: "Ingrid",
    role: "VP of Engineering",
    bio: "Specializes in network automation and SD-WAN. 15 years of experience.",
  },
  {
    name: "Stephen",
    role: "Lead Solutions Architect",
    bio: "Expert in hybrid cloud design and zero-trust architecture. 12 years in enterprise IT.",
  },
];

const MOCK_DEVICES = [
  {
    id: "dev_001",
    name: "Core Router Alpha",
    type: "router",
    status: "online",
    ip: "10.0.1.1",
    uptime: "99.99% (142 days)",
    traffic: "4.2 Gbps",
  },
  {
    id: "dev_002",
    name: "Firewall Primary",
    type: "firewall",
    status: "online",
    ip: "10.0.1.2",
    uptime: "99.97% (142 days)",
    traffic: "3.8 Gbps",
  },
  {
    id: "dev_003",
    name: "Distribution Switch B",
    type: "switch",
    status: "warning",
    ip: "10.0.2.1",
    uptime: "98.5% (89 days)",
    traffic: "1.2 Gbps",
  },
  {
    id: "dev_004",
    name: "App Server Cluster",
    type: "server",
    status: "online",
    ip: "10.0.3.10",
    uptime: "99.95% (67 days)",
    traffic: "2.1 Gbps",
  },
  {
    id: "dev_005",
    name: "Edge Switch Floor 3",
    type: "switch",
    status: "offline",
    ip: "10.0.4.1",
    uptime: "0%",
    traffic: "0 Mbps",
  },
  {
    id: "dev_006",
    name: "Backup Firewall",
    type: "firewall",
    status: "online",
    ip: "10.0.1.3",
    uptime: "99.99% (142 days)",
    traffic: "0.1 Gbps",
  },
];

const MOCK_ALERTS = [
  {
    id: "alt_001",
    type: "critical",
    message: "Edge Switch Floor 3 is unreachable — possible hardware failure",
    timestamp: "2026-03-27T00:15:00Z",
    resolved: false,
  },
  {
    id: "alt_002",
    type: "warning",
    message: "Distribution Switch B reporting high CPU utilization (92%)",
    timestamp: "2026-03-26T23:45:00Z",
    resolved: false,
  },
  {
    id: "alt_003",
    type: "warning",
    message: "SSL certificate for portal.vertex.com expires in 14 days",
    timestamp: "2026-03-26T18:00:00Z",
    resolved: false,
  },
  {
    id: "alt_004",
    type: "info",
    message: "Scheduled firmware update completed on Core Router Alpha",
    timestamp: "2026-03-26T06:00:00Z",
    resolved: true,
  },
  {
    id: "alt_005",
    type: "critical",
    message:
      "Brute-force login attempt detected — 47 failed attempts from 185.220.101.x",
    timestamp: "2026-03-26T02:30:00Z",
    resolved: true,
  },
  {
    id: "alt_006",
    type: "info",
    message: "Backup completed successfully — all data replicated to DR site",
    timestamp: "2026-03-25T22:00:00Z",
    resolved: true,
  },
];

const MOCK_STATS = {
  totalDevices: 48,
  onlineDevices: 46,
  activeAlerts: 3,
  networkUptime: "99.94%",
  bandwidthUsage: 72,
  threatsBlocked: 12847,
};

const MILESTONES = [
  {
    year: "2014",
    title: "Founded",
    description:
      "Vertex Network Solutions was founded in San Francisco with a mission to democratize enterprise security.",
  },
  {
    year: "2017",
    title: "First 100 Clients",
    description:
      "Reached 100 enterprise clients and launched our managed security operations center.",
  },
  {
    year: "2020",
    title: "Cloud Expansion",
    description:
      "Expanded services to include multi-cloud architecture and Kubernetes orchestration.",
  },
  {
    year: "2023",
    title: "SecureNet Launch",
    description:
      "Released SecureNet Router Pro and NetWatch Dashboard, our flagship hardware and software products.",
  },
  {
    year: "2025",
    title: "Global Reach",
    description:
      "Surpassed 500 enterprise clients with operations spanning 40+ countries worldwide.",
  },
];

const VALUES = [
  {
    icon: "lock",
    title: "Security First",
    description:
      "Every decision we make prioritizes the security and integrity of our clients' data and infrastructure.",
  },
  {
    icon: "zap",
    title: "Innovation",
    description:
      "We stay ahead of emerging threats by investing in R&D and adopting cutting-edge security technologies.",
  },
  {
    icon: "globe",
    title: "Reliability",
    description:
      "Our 99.99% uptime SLA reflects our commitment to keeping your business operations running without interruption.",
  },
  {
    icon: "check-circle",
    title: "Transparency",
    description:
      "We believe in clear communication, honest assessments, and no hidden costs. Our clients always know where they stand.",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Assessment",
    description:
      "We analyze your current infrastructure, identify vulnerabilities, and map your requirements.",
  },
  {
    step: "02",
    title: "Architecture",
    description:
      "Our engineers design a tailored solution with redundancy, security, and scalability built in.",
  },
  {
    step: "03",
    title: "Deployment",
    description:
      "We implement the solution with zero-downtime migration and thorough testing at every phase.",
  },
  {
    step: "04",
    title: "Monitoring",
    description:
      "24/7 proactive monitoring, regular audits, and continuous optimization of your infrastructure.",
  },
];
