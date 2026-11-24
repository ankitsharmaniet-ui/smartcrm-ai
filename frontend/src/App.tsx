
import { useEffect, useState } from "react";
import { registerUser, loginUser, logoutUser, getCurrentUser  } from "./lib/api";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserRound,
  CheckSquare,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Mail,
  Lock,
  User,
  Sparkles,
  MoreHorizontal,
  CalendarDays,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import "./App.css";

const chartData = [
  { month: "Jan", leads: 120, customers: 75 },
  { month: "Feb", leads: 180, customers: 110 },
  { month: "Mar", leads: 150, customers: 95 },
  { month: "Apr", leads: 260, customers: 170 },
  { month: "May", leads: 220, customers: 150 },
  { month: "Jun", leads: 320, customers: 230 },
  { month: "Jul", leads: 390, customers: 280 },
];


const leads = [
  { name: "Rahul Sharma", email: "rahul@gmail.com", company: "Tech Solutions", status: "New", amount: "₹25,000", color: "blue" },
  { name: "Priya Verma", email: "priya@gmail.com", company: "Digital World", status: "Contacted", amount: "₹42,000", color: "purple" },
  { name: "Amit Kumar", email: "amit@gmail.com", company: "Soft Tech", status: "Qualified", amount: "₹65,000", color: "green" },
  { name: "Neha Singh", email: "neha@gmail.com", company: "Creative Studio", status: "New", amount: "₹18,000", color: "blue" },
];


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      // Temporary token storage for local development.
      sessionStorage.setItem("auth_token", response.token);
      sessionStorage.setItem("auth_user", JSON.stringify(response.user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="brand-logo"><Sparkles size={25} /> SmartCRM AI</div>
        <div className="auth-brand-content">
          <span className="eyebrow">SMARTER CUSTOMER MANAGEMENT</span>
          <h1>Build better relationships. Grow your business.</h1>
          <p>Manage your leads, customers and daily activities from one intelligent workspace.</p>
          <div className="auth-feature"><span>✓</span> Manage your entire sales pipeline</div>
          <div className="auth-feature"><span>✓</span> Track tasks and customer activities</div>
          <div className="auth-feature"><span>✓</span> Make smarter decisions with analytics</div>
        </div>
        <p className="auth-copyright">© 2026 SmartCRM AI. All rights reserved.</p>
      </div>

      <div className="auth-form-panel">
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="mobile-brand"><Sparkles /> SmartCRM AI</div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="muted">Enter your details to access your dashboard.</p>

          {error && <p role="alert" style={{ color: "#dc2626" }}>{error}</p>}

          <label>Email address</label>
          <div className="input-wrap">
            <Mail size={18} />
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="input-wrap">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-options">
            <label className="remember"><input type="checkbox" /> Remember me</label>
            <a href="#forgot">Forgot password?</a>
          </div>

          <button className="primary-btn full-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowUpRight size={17} />}
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}


function Register() {
  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess(response.message);
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="brand-logo"><Sparkles size={25} /> SmartCRM AI</div>
        <div className="auth-brand-content">
          <span className="eyebrow">GET STARTED TODAY</span>
          <h1>Your business deserves a smarter CRM.</h1>
          <p>Create your workspace and bring your customer relationships together.</p>
          <div className="auth-feature"><span>✓</span> Simple customer management</div>
          <div className="auth-feature"><span>✓</span> Organized sales pipeline</div>
          <div className="auth-feature"><span>✓</span> AI-powered productivity</div>
        </div>
        <p className="auth-copyright">© 2026 SmartCRM AI. All rights reserved.</p>
      </div>

      <div className="auth-form-panel">
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="mobile-brand"><Sparkles /> SmartCRM AI</div>
          <span className="eyebrow">CREATE YOUR ACCOUNT</span>
          <h2>Get started for free</h2>
          <p className="muted">Enter your details to create your account.</p>

          {error && <p role="alert" style={{ color: "#dc2626" }}>{error}</p>}
          {success && <p role="status" style={{ color: "#16a34a" }}>{success}</p>}

          <label>Full name</label>
          <div className="input-wrap">
            <User size={18} />
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <label>Email address</label>
          <div className="input-wrap">
            <Mail size={18} />
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="input-wrap">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <label>Confirm password</label>
          <div className="input-wrap">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Confirm your password"
              value={passwordConfirmation}
              onChange={e => setPasswordConfirmation(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button className="primary-btn full-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowUpRight size={17} />}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}


function Sidebar({ close, onLogout }: { close: () => void; onLogout: () => void }) {
  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Leads", icon: Users, path: "/leads" },
    { label: "Customers", icon: UserRound, path: "/customers" },
    { label: "Tasks", icon: CheckSquare, path: "/tasks" },
    { label: "Reports", icon: BarChart3, path: "/reports" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><Sparkles size={21} /></div>
        <span>SmartCRM <small>AI</small></span>
        <button className="close-menu" onClick={close}><X /></button>
      </div>

      <div className="workspace">
        <div className="workspace-avatar">S</div>
        <div><strong>Smart Solutions</strong><small>Free workspace</small></div>
        <MoreHorizontal size={19} />
      </div>

      <p className="menu-heading">WORKSPACE</p>
      <nav className="side-nav">
        {menuItems.map(item => (
          <Link key={item.label} to={item.path} onClick={close} className={item.label === "Dashboard" ? "active" : ""}>
            <item.icon size={19} /> {item.label}
          </Link>
        ))}
      </nav>

      <p className="menu-heading settings-heading">PREFERENCES</p>
      <nav className="side-nav">
        <Link to="/settings" onClick={close}><Settings size={19} /> Settings</Link>
      </nav>

      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <Sparkles size={20} />
          <strong>Unlock AI features</strong>
          <p>Work smarter with AI-powered insights.</p>
          <button>Explore features <ArrowUpRight size={14} /></button>
        </div>
        <div className="profile-row">
  <div className="profile-avatar">AS</div>
  <div>
    <strong>Admin User</strong>
    <small>admin@smartcrm.com</small>
  </div>
  <button
    type="button"
    onClick={onLogout}
    title="Logout"
    className="logout-btn"
  >
    <LogOut size={18} />
  </button>
</div>
      </div>
    </aside>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const stats = [
    { title: "Total Leads", value: "2,450", change: "+12.8%", icon: Users, tone: "blue", positive: true },
    { title: "Total Customers", value: "1,240", change: "+8.2%", icon: UserRound, tone: "purple", positive: true },
    { title: "Open Tasks", value: "48", change: "-3.4%", icon: CheckSquare, tone: "orange", positive: false },
    { title: "Revenue", value: "₹8.45L", change: "+18.6%", icon: BarChart3, tone: "green", positive: true },
  ];


    async function handleLogout() {
    const token = sessionStorage.getItem("auth_token");

    try {
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
      navigate("/login");
    }
  }
  const [currentUser, setCurrentUser] = useState<{
  id: number;
  name: string;
  email: string;
} | null>(null);

useEffect(() => {
  const token = sessionStorage.getItem("auth_token");

  if (!token) {
    navigate("/login", { replace: true });
    return;
  }

  getCurrentUser(token)
    .then((response) => {
      setCurrentUser(response.user);
      sessionStorage.setItem(
        "auth_user",
        JSON.stringify(response.user)
      );
    })
    .catch(() => {
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
      navigate("/login", { replace: true });
    });
}, [navigate]);




  return (
    <div className="app-layout">
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
      <div className={menuOpen ? "sidebar-holder open" : "sidebar-holder"}>
        <Sidebar close={() => setMenuOpen(false)} onLogout={handleLogout} />
      </div>

      <main className="main-area">
       
<header className="topbar">
  <button
    className="mobile-menu"
    onClick={() => setMenuOpen(true)}
  >
    <Menu />
  </button>

  <div className="breadcrumb">
    Workspace <span>/</span> <strong>Dashboard</strong>
  </div>

  <div className="topbar-actions">
    <div className="search-box">
      <Search size={17} />
      <input placeholder="Search anything..." />
    </div>

    <button className="icon-btn notification">
      <Bell size={19} />
      <i />
    </button>

    <div className="top-profile">
      <div className="profile-avatar">{currentUser?.name?.charAt(0).toUpperCase() || "A"}</div>
      <span>{currentUser?.name || "Loading..."}</span>
    </div>

    <button
      type="button"
      className="icon-btn logout-topbar"
      onClick={handleLogout}
      title="Logout"
      aria-label="Logout"
    >
      <LogOut size={19} />
    </button>
  </div>
</header>


        <div className="dashboard-content">
          <div className="welcome-row">
            <div>
              <span className="eyebrow">OVERVIEW</span>
              <h1>Good morning, Admin <span>✦</span></h1>
              <p>Here's what's happening with your business today.</p>
            </div>
            <button className="primary-btn"><Plus size={18} /> Add new lead</button>
          </div>

          <div className="stats-grid">
            {stats.map(stat => (
              <div className="stat-card" key={stat.title}>
                <div className="stat-top">
                  <span>{stat.title}</span>
                  <div className={`stat-icon ${stat.tone}`}><stat.icon size={20} /></div>
                </div>
                <h2>{stat.value}</h2>
                <div className="stat-bottom">
                  <span className={stat.positive ? "positive" : "negative"}>
                    {stat.positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                    {stat.change}
                  </span>
                  <span>vs last month</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <section className="panel chart-panel">
              <div className="panel-heading">
                <div><h3>Performance overview</h3><p>Leads and customers growth</p></div>
                <select defaultValue="7months"><option value="7months">Last 7 months</option><option>Last 30 days</option></select>
              </div>
              <div className="chart-legend">
                <span><i className="legend-leads" /> Leads</span>
                <span><i className="legend-customers" /> Customers</span>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#635bdb" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#635bdb" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#20b89a" stopOpacity={0.16} />
                        <stop offset="100%" stopColor="#20b89a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9298a7", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9298a7", fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="leads" stroke="#635bdb" strokeWidth={2.5} fill="url(#leadGradient)" />
                    <Area type="monotone" dataKey="customers" stroke="#20b89a" strokeWidth={2.5} fill="url(#customerGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel tasks-panel">
              <div className="panel-heading">
                <div><h3>Upcoming tasks</h3><p>Your pending activities</p></div>
                <button className="text-btn">View all</button>
              </div>
              <div className="task-item">
                <span className="task-check" />
                <div><strong>Follow up with Rahul</strong><small><CalendarDays size={13} /> Today, 11:30 AM</small></div>
                <span className="priority high">High</span>
              </div>
              <div className="task-item">
                <span className="task-check" />
                <div><strong>Send proposal to Priya</strong><small><CalendarDays size={13} /> Today, 02:00 PM</small></div>
                <span className="priority medium">Medium</span>
              </div>
              <div className="task-item">
                <span className="task-check" />
                <div><strong>Team sales meeting</strong><small><CalendarDays size={13} /> Tomorrow, 10:00 AM</small></div>
                <span className="priority low">Low</span>
              </div>
              <button className="add-task"><Plus size={16} /> Add a new task</button>
            </section>
          </div>

          <section className="panel leads-panel">
            <div className="panel-heading">
              <div><h3>Recent leads</h3><p>Keep track of your latest prospects</p></div>
              <button className="text-btn">View all leads <ArrowUpRight size={15} /></button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>CONTACT</th><th>COMPANY</th><th>STATUS</th><th>DEAL VALUE</th><th></th></tr></thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.email}>
                      <td><div className="lead-contact"><div className={`lead-avatar ${lead.color}`}>{lead.name.split(" ").map(n => n[0]).join("")}</div><div><strong>{lead.name}</strong><small>{lead.email}</small></div></div></td>
                      <td>{lead.company}</td>
                      <td><span className={`status ${lead.status.toLowerCase()}`}>{lead.status}</span></td>
                      <td><strong>{lead.amount}</strong></td>
                      <td><button className="dots-btn"><MoreHorizontal size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="dashboard-footer">© 2026 SmartCRM AI <span>Built for smarter customer relationships.</span></footer>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
