export const mockUsers = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Full-Stack Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "online" as const,
    bio: "Passionate about clean code and scalable architectures. 8+ years building web platforms.",
  },
  {
    id: "2",
    name: "Alex Rivera",
    role: "DevOps Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "online" as const,
    bio: "Infrastructure as code enthusiast. Kubernetes, Terraform, and CI/CD pipelines.",
  },
  {
    id: "3",
    name: "Jordan Kim",
    role: "Frontend Specialist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    status: "away" as const,
    bio: "React & TypeScript expert. Crafting pixel-perfect user interfaces.",
  },
  {
    id: "4",
    name: "Maya Patel",
    role: "Backend Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    status: "online" as const,
    bio: "Building robust APIs and microservices. Go and Rust enthusiast.",
  },
  {
    id: "5",
    name: "Liam Foster",
    role: "AI/ML Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    status: "dnd" as const,
    bio: "Making machines learn. NLP, computer vision, and generative AI.",
  },
  {
    id: "6",
    name: "Emma Wilson",
    role: "Security Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    status: "offline" as const,
    bio: "Securing applications from code to cloud. Penetration testing & threat modeling.",
  },
  {
    id: "7",
    name: "Noah Zhang",
    role: "Mobile Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
    status: "online" as const,
    bio: "React Native and Flutter developer. Cross-platform mobile apps.",
  },
  {
    id: "8",
    name: "Olivia Brooks",
    role: "Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    status: "away" as const,
    bio: "Design systems, prototyping, and user research. Figma power user.",
  },
];

export const currentUser = mockUsers[0];

export type ConversationType = "dm" | "channel";

export interface Conversation {
  id: string;
  name: string;
  type: ConversationType;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  pinned: boolean;
  status?: "online" | "away" | "dnd" | "offline";
  typing?: boolean;
  participants: string[];
}

export const mockConversations: Conversation[] = [
  {
    id: "c1",
    name: "frontend-team",
    type: "channel",
    lastMessage: "Jordan: Just pushed the new component library updates",
    timestamp: "2m ago",
    unread: 5,
    pinned: true,
    participants: ["1", "3", "7", "8"],
  },
  {
    id: "c2",
    name: "Alex Rivera",
    type: "dm",
    avatar: mockUsers[1].avatar,
    lastMessage: "The CI pipeline is green now 🎉",
    timestamp: "15m ago",
    unread: 2,
    pinned: true,
    status: "online",
    participants: ["1", "2"],
  },
  {
    id: "c3",
    name: "backend-crew",
    type: "channel",
    lastMessage: "Maya: New API endpoints are ready for review",
    timestamp: "1h ago",
    unread: 0,
    pinned: false,
    participants: ["1", "2", "4", "5"],
  },
  {
    id: "c4",
    name: "Maya Patel",
    type: "dm",
    avatar: mockUsers[3].avatar,
    lastMessage: "Can you review my PR? It's the auth service refactor",
    timestamp: "2h ago",
    unread: 1,
    pinned: false,
    status: "online",
    typing: true,
    participants: ["1", "4"],
  },
  {
    id: "c5",
    name: "devops-alerts",
    type: "channel",
    lastMessage: "⚠️ Memory usage spike detected on prod-east-2",
    timestamp: "3h ago",
    unread: 0,
    pinned: false,
    participants: ["1", "2", "6"],
  },
  {
    id: "c6",
    name: "Liam Foster",
    type: "dm",
    avatar: mockUsers[4].avatar,
    lastMessage: "The new ML model is performing 23% better!",
    timestamp: "Yesterday",
    unread: 0,
    pinned: false,
    status: "dnd",
    participants: ["1", "5"],
  },
  {
    id: "c7",
    name: "Project Alpha",
    type: "channel",
    lastMessage: "Emma: Security audit completed - 2 issues found",
    timestamp: "Yesterday",
    unread: 0,
    pinned: false,
    participants: ["1", "2", "3", "4", "5", "6"],
  },
];

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "text" | "code" | "system" | "file";
  language?: string;
  reactions?: { emoji: string; users: string[] }[];
  read?: boolean;
}

export const mockMessages: Message[] = [
  {
    id: "m1", conversationId: "c1", senderId: "3",
    content: "Hey team, I just finished the new component library. Check out the updated Button and Card components!",
    timestamp: "10:30 AM", type: "text", read: true,
  },
  {
    id: "m2", conversationId: "c1", senderId: "3",
    content: `import { Button } from '@/components/ui/button';\n\nexport function HeroSection() {\n  return (\n    <section className="flex flex-col items-center gap-6">\n      <h1 className="text-5xl font-bold">Welcome</h1>\n      <Button variant="default" size="lg">\n        Get Started\n      </Button>\n    </section>\n  );\n}`,
    timestamp: "10:31 AM", type: "code", language: "tsx", read: true,
  },
  {
    id: "m3", conversationId: "c1", senderId: "1",
    content: "This looks amazing, Jordan! Love the new gradient variants. Let me test it in the staging environment.",
    timestamp: "10:35 AM", type: "text", read: true,
    reactions: [{ emoji: "🔥", users: ["3", "7"] }],
  },
  {
    id: "m4", conversationId: "c1", senderId: "8",
    content: "The design system tokens are all updated in Figma too. Everything should be in sync now.",
    timestamp: "10:40 AM", type: "text", read: true,
  },
  {
    id: "m5", conversationId: "c1", senderId: "7",
    content: "Quick question — are we supporting dark mode variants for all components?",
    timestamp: "10:42 AM", type: "text", read: true,
  },
  {
    id: "m6", conversationId: "c1", senderId: "3",
    content: "Yes! Every component has both light and dark variants. The theme automatically switches based on system preference or the toggle.",
    timestamp: "10:44 AM", type: "text", read: true,
    reactions: [{ emoji: "👍", users: ["7", "1"] }],
  },
  {
    id: "m7", conversationId: "c1", senderId: "1",
    content: `// Here's the performance comparison\nconst results = await benchmark({\n  oldComponents: { renderTime: '45ms', bundleSize: '12.4kb' },\n  newComponents: { renderTime: '18ms', bundleSize: '8.2kb' },\n});\n\nconsole.log('Performance improved by', results.improvement + '%');\n// Output: Performance improved by 60%`,
    timestamp: "10:50 AM", type: "code", language: "typescript",
    reactions: [{ emoji: "🚀", users: ["3", "7", "8"] }],
  },
  {
    id: "m8", conversationId: "c1", senderId: "7",
    content: "60% improvement! That's incredible. Great work on the tree-shaking.",
    timestamp: "10:52 AM", type: "text", read: false,
  },
  {
    id: "m9", conversationId: "c1", senderId: "3",
    content: "Just pushed the new component library updates. Ready for final review!",
    timestamp: "10:55 AM", type: "text", read: false,
  },
];

export const mockPullRequests = [
  {
    id: "pr1",
    title: "feat: Add OAuth2 authentication flow",
    description: "Implements Google, GitHub, and Microsoft OAuth2 providers with JWT session management.",
    author: mockUsers[0],
    status: "open" as const,
    additions: 234,
    deletions: 56,
    reviewers: [mockUsers[1], mockUsers[5]],
    timestamp: "2 hours ago",
    labels: ["feature", "auth"],
  },
  {
    id: "pr2",
    title: "fix: Resolve memory leak in useEffect cleanup",
    description: "Fixed subscription cleanup in real-time messaging hook that caused memory leaks.",
    author: mockUsers[2],
    status: "merged" as const,
    additions: 18,
    deletions: 42,
    reviewers: [mockUsers[0]],
    timestamp: "5 hours ago",
    labels: ["bugfix", "performance"],
  },
  {
    id: "pr3",
    title: "chore: Update dependencies and fix audit warnings",
    description: "Updated all npm packages to latest versions. Fixed 3 moderate security vulnerabilities.",
    author: mockUsers[1],
    status: "open" as const,
    additions: 145,
    deletions: 130,
    reviewers: [mockUsers[5]],
    timestamp: "1 day ago",
    labels: ["dependencies", "security"],
  },
];
