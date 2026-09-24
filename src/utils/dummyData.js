export const DUMMY_USERS = [
  {
    id: 'user-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0D8ABC&color=fff'
  },
  {
    id: 'user-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=2A9D8F&color=fff'
  },
  {
    id: 'user-3',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Chen&background=E76F51&color=fff'
  },
  {
    id: 'user-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Elena+Rostova&background=9C27B0&color=fff'
  },
  {
    id: 'user-5',
    name: 'David Vance',
    email: 'david.vance@example.com',
    avatar: 'https://ui-avatars.com/api/?name=David+Vance&background=3F51B5&color=fff'
  },
  {
    id: 'user-6',
    name: 'Jessica Alba',
    email: 'jessica.alba@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jessica+Alba&background=009688&color=fff'
  },
  {
    id: 'user-7',
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Liam+OConnor&background=FF9800&color=fff'
  },
  {
    id: 'user-8',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Mendez&background=4CAF50&color=fff'
  },
  {
    id: 'user-9',
    name: 'Hannah Abbott',
    email: 'hannah.abbott@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Hannah+Abbott&background=E91E63&color=fff'
  },
  {
    id: 'user-10',
    name: 'Kevin Durant',
    email: 'kevin.durant@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Kevin+Durant&background=607D8B&color=fff'
  }
]

export const DUMMY_THREADS = [
  {
    id: 'dummy-thread-1',
    title: 'Best Practices for Structuring Modern React Applications in 2026',
    body: 'What project folder structures are you using for large scale React apps? Share your experience with feature-based vs layer-based architecture!',
    category: 'react',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    ownerId: 'user-1',
    upVotesBy: ['user-2', 'user-3', 'user-4', 'user-5'],
    downVotesBy: [],
    totalComments: 14
  },
  {
    id: 'dummy-thread-2',
    title: 'Mastering Async JavaScript: Promises, Async/Await, and Microtasks',
    body: 'Understanding how the Event Loop handles microtasks vs macrotasks is essential for high-performance web applications.',
    category: 'javascript',
    createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    ownerId: 'user-2',
    upVotesBy: ['user-1', 'user-3', 'user-6'],
    downVotesBy: [],
    totalComments: 9
  },
  {
    id: 'dummy-thread-3',
    title: 'The Future of Web Development: Server Components & Edge Computing',
    body: 'Edge runtime allows rendering content closer to users with near zero latency. Are you using serverless or edge deployments in production?',
    category: 'webdev',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    ownerId: 'user-3',
    upVotesBy: ['user-1', 'user-2', 'user-4', 'user-5', 'user-7'],
    downVotesBy: [],
    totalComments: 21
  },
  {
    id: 'dummy-thread-4',
    title: 'UI/UX Design Trends: Glassmorphism, Micro-interactions, and Accessibility',
    body: 'Great UI is invisible. Micro-animations and high-contrast color palettes enhance usability without overwhelming the user.',
    category: 'design',
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    ownerId: 'user-4',
    upVotesBy: ['user-2', 'user-6', 'user-8'],
    downVotesBy: [],
    totalComments: 11
  },
  {
    id: 'dummy-thread-5',
    title: 'Integrating Generative AI Assistants into Modern Web Apps',
    body: 'AI agents and LLMs are revolutionizing search, code completion, and productivity tools. What AI features are you building this year?',
    category: 'ai',
    createdAt: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    ownerId: 'user-5',
    upVotesBy: ['user-1', 'user-3', 'user-7', 'user-9'],
    downVotesBy: [],
    totalComments: 18
  },
  {
    id: 'dummy-thread-6',
    title: 'CSS Subgrid and Container Queries: Game Changers for Responsive Layouts',
    body: 'Container queries allow components to adapt based on their parent container size rather than viewport width!',
    category: 'css',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    ownerId: 'user-6',
    upVotesBy: ['user-4', 'user-5'],
    downVotesBy: [],
    totalComments: 7
  },
  {
    id: 'dummy-thread-7',
    title: 'How to Prepare for Senior Frontend Engineer Code Reviews',
    body: 'Code reviews are opportunities for collaboration. Focus on clean code, automated testing, and descriptive PR descriptions.',
    category: 'career',
    createdAt: new Date(Date.now() - 1000 * 60 * 750).toISOString(),
    ownerId: 'user-7',
    upVotesBy: ['user-1', 'user-2', 'user-3', 'user-8', 'user-10'],
    downVotesBy: [],
    totalComments: 25
  },
  {
    id: 'dummy-thread-8',
    title: 'Node.js Performance Optimization and Memory Leak Debugging',
    body: 'Profiling memory usage using heap snapshots can help pinpoint uncollected event listeners and unclosed streams.',
    category: 'node',
    createdAt: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    ownerId: 'user-8',
    upVotesBy: ['user-5', 'user-9'],
    downVotesBy: [],
    totalComments: 5
  },
  {
    id: 'dummy-thread-9',
    title: 'Choosing the Right Database: PostgreSQL Relational vs MongoDB NoSQL',
    body: 'Relational integrity vs document flexibility. How do you evaluate database selection for new web projects?',
    category: 'database',
    createdAt: new Date(Date.now() - 1000 * 60 * 1100).toISOString(),
    ownerId: 'user-9',
    upVotesBy: ['user-3', 'user-7', 'user-10'],
    downVotesBy: [],
    totalComments: 13
  },
  {
    id: 'dummy-thread-10',
    title: 'Frontend Security Essentials: Preventing XSS and CSRF Attacks',
    body: 'Sanitizing user input, using Content Security Policy (CSP) headers, and storing tokens securely in HttpOnly cookies.',
    category: 'frontend',
    createdAt: new Date(Date.now() - 1000 * 60 * 1300).toISOString(),
    ownerId: 'user-10',
    upVotesBy: ['user-1', 'user-2', 'user-6', 'user-8'],
    downVotesBy: [],
    totalComments: 16
  }
]

export const DEFAULT_LEADERBOARDS = [
  { user: DUMMY_USERS[0], score: 2850 },
  { user: DUMMY_USERS[1], score: 2410 },
  { user: DUMMY_USERS[2], score: 1980 },
  { user: DUMMY_USERS[3], score: 1650 },
  { user: DUMMY_USERS[4], score: 1320 },
  { user: DUMMY_USERS[5], score: 940 },
  { user: DUMMY_USERS[6], score: 620 },
  { user: DUMMY_USERS[7], score: 350 },
  { user: DUMMY_USERS[8], score: 0 },
  { user: DUMMY_USERS[9], score: 0 }
]
