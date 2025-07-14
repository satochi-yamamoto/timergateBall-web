import '@testing-library/jest-dom'

// Mock Supabase client
vi.mock('@/lib/customSupabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => Promise.resolve({ data: [], error: null })),
      delete: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, style, ...props }) => 
      <div onClick={onClick} className={className} style={style} {...props}>{children}</div>,
    button: ({ children, onClick, className, style, ...props }) => 
      <button onClick={onClick} className={className} style={style} {...props}>{children}</button>,
    span: ({ children, className, style, ...props }) => 
      <span className={className} style={style} {...props}>{children}</span>,
    circle: ({ children, className, style, ...props }) => 
      <circle className={className} style={style} {...props}>{children}</circle>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock react-helmet
vi.mock('react-helmet', () => ({
  Helmet: ({ children }) => children,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Users: () => 'Users',
  LogOut: () => 'LogOut',
  Trash2: () => 'Trash2',
  Settings: () => 'Settings',
  Plus: () => 'Plus',
  Play: () => 'Play',
  Pause: () => 'Pause',
  RotateCcw: () => 'RotateCcw',
  Crown: () => 'Crown',
  UserPlus: () => 'UserPlus',
  UserMinus: () => 'UserMinus',
  Eye: () => 'Eye',
  EyeOff: () => 'EyeOff',
  Lock: () => 'Lock',
  Mail: () => 'Mail',
  ArrowLeft: () => 'ArrowLeft',
  Save: () => 'Save',
  X: () => 'X',
}))

// Mock NoSleep
vi.mock('nosleep.js', () => ({
  default: class NoSleep {
    enable() {}
    disable() {}
  },
}))

// Mock global objects
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock navigator.wakeLock
Object.defineProperty(navigator, 'wakeLock', {
  writable: true,
  value: {
    request: vi.fn().mockResolvedValue({
      release: vi.fn(),
    }),
  },
})

// Mock Audio
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn(),
  pause: vi.fn(),
  load: vi.fn(),
  volume: 1,
  currentTime: 0,
  duration: 0,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}))