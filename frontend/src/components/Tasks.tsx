
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowUpRight,
  CheckCircle,
  Trash2,
  RefreshCw,
  LayoutDashboard,
  Users,
  UserRound,
  CheckSquare,
  BarChart3,
  Settings,
  Sparkles,
  MoreHorizontal,
  X,
  Menu,
  Search,
  Bell,
  LogOut,
  Pencil,
} from "lucide-react";
import {
  getTasks,
  updateTask,
  deleteTask,
  type Task,
} from "../lib/api";

function Tasks() {
  const navigate = useNavigate();

  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const handleLogout = () => {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    navigate("/login", { replace: true });
    };
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("auth_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await getTasks(token);
      setTasks(response.data.data);
    } catch (err) {
      console.error("Tasks loading failed:", err);
      setError("Unable to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [currentUser] = useState<{ name?: string } | null>(() => {
  const storedUser = sessionStorage.getItem("auth_user");

    try {
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
    });

   useEffect(() => {
        loadTasks();
    }, []);

    const handleEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditType(task.type);
    setEditPriority(task.priority);
    setEditStatus(task.status);

    setEditDueAt(
        task.due_at
        ? new Date(task.due_at).toISOString().slice(0, 16)
        : ""
    );

    setShowEditModal(true);
    };
    const handleUpdateTask = async () => {
  if (!editingTask) return;

  if (!editTitle.trim()) {
    alert("Task title is required.");
    return;
  }

  try {
    setEditSaving(true);

    const token = sessionStorage.getItem("auth_token");

    if (!token) {
      navigate("/login");
      return;
    }

    await updateTask(token, editingTask.id, {
      title: editTitle,
      description: editDescription,
      type: editType,
      priority: editPriority,
      status: editStatus,
      due_at: editDueAt || undefined,
    });

    setShowEditModal(false);
    setEditingTask(null);

    await loadTasks();

    alert("Task updated successfully.");
  } catch (err) {
    console.error("Task update failed:", err);
    alert("Unable to update task.");
  } finally {
    setEditSaving(false);
  }
};
  const handleComplete = async (taskId: number) => {
    try {
      const token = sessionStorage.getItem("auth_token");

      if (!token) {
        navigate("/login");
        return;
      }

      await updateTask(token, taskId, { status: "completed" });
      await loadTasks();
    } catch (err) {
      console.error("Task completion failed:", err);
      alert("Unable to complete task.");
    }
  };
  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Leads", icon: Users, path: "/leads" },
    { label: "Customers", icon: UserRound, path: "/customers" },
    { label: "Tasks", icon: CheckSquare, path: "/tasks" },
    { label: "Reports", icon: BarChart3, path: "/reports" },
    ];

  const handleDelete = async (taskId: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const token = sessionStorage.getItem("auth_token");

      if (!token) {
        navigate("/login");
        return;
      }

      await deleteTask(token, taskId);
      await loadTasks();
    } catch (err) {
      console.error("Task deletion failed:", err);
      alert("Unable to delete task.");
    }
  };

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editType, setEditType] = useState("follow_up");
    const [editPriority, setEditPriority] = useState("medium");
    const [editStatus, setEditStatus] = useState("pending");
    const [editDueAt, setEditDueAt] = useState("");
    const [editSaving, setEditSaving] = useState(false);

  

return (
  <div className="app-layout">
    {menuOpen && (
      <div
        className="mobile-overlay"
        onClick={() => setMenuOpen(false)}
      />
    )}

    <div className={menuOpen ? "sidebar-holder open" : "sidebar-holder"}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Sparkles size={21} />
          </div>
          <span>SmartCRM <small>AI</small></span>
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </button>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">S</div>
          <div>
            <strong>Smart Solutions</strong>
            <small>Free workspace</small>
          </div>
          <MoreHorizontal size={19} />
        </div>

        <p className="menu-heading">WORKSPACE</p>

        <nav className="side-nav">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={location.pathname === item.path ? "active" : ""}
            >
              <item.icon size={19} />
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="menu-heading settings-heading">PREFERENCES</p>

        <nav className="side-nav">
          <Link to="/settings" onClick={() => setMenuOpen(false)}>
            <Settings size={19} />
            Settings
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <Sparkles size={20} />
            <strong>Unlock AI features</strong>
            <p>Work smarter with AI-powered insights.</p>
            <button>
              Explore features <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="profile-row">
            <div className="profile-avatar">
              {currentUser?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <strong>{currentUser?.name || "Admin User"}</strong>
              <small>SmartCRM Account</small>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="logout-btn"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
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
          Workspace <span>/</span> <strong>Tasks</strong>
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
            <div className="profile-avatar">
              {currentUser?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <span>{currentUser?.name || "Admin User"}</span>
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
        <div className="page-heading">
          <div>
            <h1>Task Management</h1>
            <p>Manage and track all your tasks in one place.</p>
          </div>
        </div>

        <section className="panel tasks-panel">
          <div className="panel-heading">
            <div>
              <h3>All Tasks</h3>
              <p>View and manage your activities</p>
            </div>
            <button
              className="text-btn"
              onClick={loadTasks}
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          <div className="task-filters">
            {["all", "pending", "in_progress", "completed"].map((status) => (
              <button
                key={status}
                className={filter === status ? "active" : ""}
                onClick={() => setFilter(status)}
              >
                {status === "all"
                  ? "All"
                  : status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>

          {loading ? (
            <p>Loading tasks...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : tasks.filter((task) =>
              filter === "all" ? true : task.status === filter
            ).length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={30} />
              <h3>No tasks found</h3>
              <p>There are no tasks in this category.</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks
                .filter((task) =>
                  filter === "all" ? true : task.status === filter
                )
                .map((task) => (
                  <div className="task-item" key={task.id}>
                    <div className="task-info">
                      <strong>{task.title}</strong>
                      <p>{task.description || "No description"}</p>
                      <div className="task-meta">
                        <span>{task.type.replace("_", " ")}</span>
                        <span>
                          {task.due_at
                            ? new Date(task.due_at).toLocaleString()
                            : "No due date"}
                        </span>
                      </div>
                    </div>

                    <div className="task-actions">
                        <span className={`priority-badge ${task.priority}`}>
                            {task.priority}
                        </span>

                        <span className={`status-badge ${task.status}`}>
                            {task.status.replace("_", " ")}
                        </span>

                        {/* Edit Task */}
                       {task.status !== "completed" && (
                            <button
                                className="edit-task-btn"
                                onClick={() => handleEdit(task)}
                                title="Edit task"
                            >
                                <Pencil size={16} />
                            </button>
                            )}

                        {/* Complete Task */}
                        {task.status !== "completed" && (
                            <button
                            className="complete-task-btn"
                            onClick={() => handleComplete(task.id)}
                            title="Mark completed"
                            >
                            <CheckCircle size={16} />
                            </button>
                        )}

                        {/* Delete Task */}
                        <button
                            className="delete-task-btn"
                            onClick={() => handleDelete(task.id)}
                            title="Delete task"
                        >
                            <Trash2 size={16} />
                        </button>
                        </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
      {showEditModal && (
  <div className="modal-overlay">
    <div className="task-modal">
      <div className="modal-header">
        <div>
          <h2>Edit Task</h2>
          <p>Update your task details</p>
        </div>

        <button
          type="button"
          className="modal-close"
          onClick={() => setShowEditModal(false)}
        >
          <X size={20} />
        </button>
      </div>

      <div className="task-form">
        <label>Task Title</label>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Enter task title"
        />

        <label>Description</label>
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Enter task description"
          rows={3}
        />

        <div className="form-row">
          <div>
            <label>Task Type</label>
            <select value={editType} onChange={(e) => setEditType(e.target.value)}>
              <option value="follow_up">Follow Up</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label>Priority</label>
            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Status</label>
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label>Due Date</label>
            <input
              type="datetime-local"
              value={editDueAt}
              onChange={(e) => setEditDueAt(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setShowEditModal(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="save-task-btn"
          onClick={handleUpdateTask}
          disabled={editSaving}
        >
          {editSaving ? "Updating..." : "Update Task"}
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  </div>
);
}

export default Tasks;
