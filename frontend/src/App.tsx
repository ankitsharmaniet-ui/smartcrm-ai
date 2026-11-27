
import { useEffect, useState, type ReactNode } from "react";
import Tasks from "./components/Tasks";
import Leads from "./components/Leads";
import { registerUser, loginUser, logoutUser, getCurrentUser, getDashboardData, createTask,updateTask   } from "./lib/api";
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
  CheckCircle,
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

// const chartData = [
//   { month: "Jan", leads: 120, customers: 75 },
//   { month: "Feb", leads: 180, customers: 110 },
//   { month: "Mar", leads: 150, customers: 95 },
//   { month: "Apr", leads: 260, customers: 170 },
//   { month: "May", leads: 220, customers: 150 },
//   { month: "Jun", leads: 320, customers: 230 },
//   { month: "Jul", leads: 390, customers: 280 },
// ];


// const leads = [
//   { name: "Rahul Sharma", email: "rahul@gmail.com", company: "Tech Solutions", status: "New", amount: "₹25,000", color: "blue" },
//   { name: "Priya Verma", email: "priya@gmail.com", company: "Digital World", status: "Contacted", amount: "₹42,000", color: "purple" },
//   { name: "Amit Kumar", email: "amit@gmail.com", company: "Soft Tech", status: "Qualified", amount: "₹65,000", color: "green" },
//   { name: "Neha Singh", email: "neha@gmail.com", company: "Creative Studio", status: "New", amount: "₹18,000", color: "blue" },
// ];

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = sessionStorage.getItem("auth_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

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
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskType, setTaskType] = useState("follow_up");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskDueAt, setTaskDueAt] = useState("");

  const [taskSaving, setTaskSaving] = useState(false);
  const [taskError, setTaskError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    total_leads: 0,
    total_customers: 0,
    open_tasks: 0,
  });
  const [chartData, setChartData] = useState<
    {
      month: string;
      leads: number;
      customers: number;
    }[]
  >([]);
  const [upcomingTasks, setUpcomingTasks] = useState<
    {
      id: number;
      title: string;
      due_at: string;
      priority: string;
      status: string;
      assigned_to: string | null;
    }[]
  >([]);
  const [recentLeads, setRecentLeads] = useState<
    {
      id: number;
      name: string;
      email: string | null;
      company: string | null;
      status: string;
      source: string | null;
    }[]
  >([]);

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  // const stats = [
  //   { title: "Total Leads", value: "2,450", change: "+12.8%", icon: Users, tone: "blue", positive: true },
  //   { title: "Total Customers", value: "1,240", change: "+8.2%", icon: UserRound, tone: "purple", positive: true },
  //   { title: "Open Tasks", value: "48", change: "-3.4%", icon: CheckSquare, tone: "orange", positive: false },
  //   { title: "Revenue", value: "₹8.45L", change: "+18.6%", icon: BarChart3, tone: "green", positive: true },
  // ];

  const stats = [
    {
      title: "Total Leads",
      value: dashboardLoading ? "..." : dashboardData.total_leads.toLocaleString("en-IN"),
      change: "Live database",
      icon: Users,
      tone: "blue",
      positive: true,
    },
    {
      title: "Total Customers",
      value: dashboardLoading ? "..." : dashboardData.total_customers.toLocaleString("en-IN"),
      change: "Live database",
      icon: UserRound,
      tone: "purple",
      positive: true,
    },
    {
      title: "Open Tasks",
      value: dashboardLoading ? "..." : dashboardData.open_tasks.toLocaleString("en-IN"),
      change: "Live database",
      icon: CheckSquare,
      tone: "orange",
      positive: true,
    },
    {
      title: "Revenue",
      value: "—",
      change: "Not configured",
      icon: BarChart3,
      tone: "green",
      positive: true,
    },
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


  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");

    if (!token) {
      setDashboardLoading(false);
      return;
    }

    getDashboardData(token)
  .then((response) => {
    setDashboardData({
      total_leads: response.data.total_leads,
      total_customers: response.data.total_customers,
      open_tasks: response.data.open_tasks,
    });

    setChartData(response.data.monthly_performance);

    setRecentLeads(response.data.recent_leads);
    setUpcomingTasks(response.data.upcoming_tasks);

    setDashboardError("");
  })
      .catch((error) => {
        setDashboardError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data"
        );
      })
      .finally(() => {
        setDashboardLoading(false);
      });
  }, []);



const handleCreateTask = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  const token = sessionStorage.getItem("auth_token");

  if (!token) {
    setTaskError("Session expired. Please login again.");
    return;
  }

  setTaskSaving(true);
  setTaskError("");

  try {
    await createTask(token, {
      title: taskTitle,
      description: taskDescription,
      type: taskType,
      priority: taskPriority,
      due_at: taskDueAt
        ? new Date(taskDueAt).toISOString()
        : undefined,
    });

    setTaskTitle("");
    setTaskDescription("");
    setTaskType("follow_up");
    setTaskPriority("medium");
    setTaskDueAt("");
    setShowTaskModal(false);

    // Refresh dashboard data
    const dashboardResponse = await getDashboardData(token);

    setDashboardData({
      total_leads: dashboardResponse.data.total_leads,
      total_customers: dashboardResponse.data.total_customers,
      open_tasks: dashboardResponse.data.open_tasks,
    });

    setUpcomingTasks(dashboardResponse.data.upcoming_tasks);

  } catch (error) {
    setTaskError(
      error instanceof Error
        ? error.message
        : "Unable to create task."
    );
  } finally {
    setTaskSaving(false);
  }
};

const handleCompleteTask = async (taskId: number) => {
  try {
    const token = sessionStorage.getItem("auth_token");

    if (!token) {
      throw new Error("Please login again.");
    }

    await updateTask(token, taskId, {
      status: "completed",
    });

    const response = await getDashboardData(token);

    if (response.status) {
      setDashboardData(response.data);
      setUpcomingTasks(response.data.upcoming_tasks);
      setRecentLeads(response.data.recent_leads);
    }
  } catch (error) {
    console.error("Task completion failed:", error);
    alert("Unable to complete task. Please try again.");
  }
};

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
            {dashboardError && (
              <p role="alert" style={{ color: "#dc2626", marginBottom: "15px" }}>
                {dashboardError}
              </p>
            )}
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
                <div>
                  <h3>Upcoming tasks</h3>
                  <p>Your pending activities</p>
                </div>
                <button className="text-btn"
                 onClick={() => navigate("/tasks")}>View all</button>
              </div>

              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div className="task-item" key={task.id}>
                    <span className="task-check" />

                    <div>
                      <strong>{task.title}</strong>

                      <small>
                        <CalendarDays size={13} />
                        {new Date(task.due_at).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>

                      <small>
                        Assigned to: {task.assigned_to || "Unassigned"}
                      </small>
                    </div>

                    <span className={`priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <button
                    className="complete-task-btn"
                    onClick={() => handleCompleteTask(task.id)}
                    title="Mark as completed"
                  >
                    <CheckCircle size={15} />
                    Complete
                  </button>
                  </div>
                ))
              ) : (
                <p className="muted">No upcoming tasks found.</p>
              )}

              <button className="add-task"
              onClick={() => setShowTaskModal(true)}
              >
                <Plus size={16} /> Add a new task
              </button>
            </section>

          </div>

          
<section className="panel leads-panel">
  <div className="panel-heading">
    <div>
      <h3>Recent leads</h3>
      <p>Keep track of your latest prospects</p>
    </div>
    <button className="text-btn">
      View all leads <ArrowUpRight size={15} />
    </button>
  </div>

  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>CONTACT</th>
          <th>COMPANY</th>
          <th>STATUS</th>
          <th>SOURCE</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {recentLeads.length > 0 ? (
          recentLeads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <div className="lead-contact">
                  <div className="lead-avatar blue">
                    {lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>{lead.name}</strong>
                    <small>{lead.email || "No email available"}</small>
                  </div>
                </div>
              </td>

              <td>{lead.company || "N/A"}</td>

              <td>
                <span className={`status ${lead.status.toLowerCase()}`}>
                  {lead.status}
                </span>
              </td>

              <td>{lead.source || "N/A"}</td>

              <td>
                <button className="dots-btn">
                  <MoreHorizontal size={18} />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} style={{ textAlign: "center" }}>
              No recent leads found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</section>


          {showTaskModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <div>
                    <h2>Create New Task</h2>
                    <p>Add a new activity to your CRM</p>
                  </div>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => {
                      setShowTaskModal(false);
                      setTaskError("");
                    }}
                    aria-label="Close task form"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleCreateTask}>
                  <div className="form-group">
                    <label htmlFor="task-title">Task Title *</label>
                    <input
                      id="task-title"
                      type="text"
                      placeholder="Enter task title"
                      value={taskTitle}
                      onChange={(event) => setTaskTitle(event.target.value)}
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="task-description">Description</label>
                    <textarea
                      id="task-description"
                      placeholder="Enter task description"
                      value={taskDescription}
                      onChange={(event) => setTaskDescription(event.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="task-type">Task Type</label>
                      <select
                        id="task-type"
                        value={taskType}
                        onChange={(event) => setTaskType(event.target.value)}
                      >
                        <option value="follow_up">Follow Up</option>
                        <option value="call">Call</option>
                        <option value="meeting">Meeting</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="task-priority">Priority</label>
                      <select
                        id="task-priority"
                        value={taskPriority}
                        onChange={(event) => setTaskPriority(event.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="task-due-at">Due Date &amp; Time</label>
                    <input
                      id="task-due-at"
                      type="datetime-local"
                      value={taskDueAt}
                      onChange={(event) => setTaskDueAt(event.target.value)}
                    />
                  </div>

                  {taskError && (
                    <p className="form-error" role="alert">{taskError}</p>
                  )}

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setShowTaskModal(false);
                        setTaskError("");
                      }}
                      disabled={taskSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={taskSaving}
                    >
                      {taskSaving ? "Creating..." : "Create Task"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
              }
        />
        <Route path="/tasks" element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route path="/leads" element={
              <ProtectedRoute>
                <Leads />
              </ProtectedRoute>
            }
          />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
