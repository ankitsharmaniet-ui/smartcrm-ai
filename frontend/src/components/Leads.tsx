
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowUpRight,
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
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getUsers,
  type Lead,
  type LeadInput,
  type TeamUser,
} from "../lib/api";

function Leads() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<LeadInput>({
    first_name: "",
    last_name: "",
    company: "",
    email: "",
    phone: "",
    job_title: "",
    source: "Website",
    status: "new",
    notes: "",
    assigned_to: undefined,
  });

  const [currentUser] = useState<{ name?: string } | null>(() => {
    const storedUser = sessionStorage.getItem("auth_user");

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    navigate("/login", { replace: true });
  };

  const loadTeamUsers = async () => {
    try {
        const token = sessionStorage.getItem("auth_token");

        if (!token) return;

        const response = await getUsers(token);
        setTeamUsers(response.data);
    } catch (error) {
        console.error("Team users loading failed:", error);
    }
    };

  const loadLeads = async (
    page = currentPage,
    searchValue = search,
    statusValue = statusFilter,
    sourceValue = sourceFilter
  ) => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("auth_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await getLeads(token, {
        page,
        search: searchValue || undefined,
        status: statusValue || undefined,
        source: sourceValue || undefined,
      });

      setLeads(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setTotal(response.data.total);
    } catch (err) {
      console.error("Leads loading failed:", err);
      setError("Unable to load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads(1, "", "", "");
    loadTeamUsers();
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
    loadLeads(1, searchInput, statusFilter, sourceFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    loadLeads(1, search, value, sourceFilter);
  };

  const handleSourceFilter = (value: string) => {
    setSourceFilter(value);
    setCurrentPage(1);
    loadLeads(1, search, statusFilter, value);
  };

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      company: "",
      email: "",
      phone: "",
      job_title: "",
      source: "Website",
      status: "new",
      notes: "",
      assigned_to: undefined,
    });
    setEditingLead(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);

    setForm({
      first_name: lead.first_name,
      last_name: lead.last_name || "",
      company: lead.company || "",
      email: lead.email || "",
      phone: lead.phone || "",
      job_title: lead.job_title || "",
      source: lead.source || "Website",
      status: lead.status,
      notes: lead.notes || "",
      assigned_to: lead.assigned_to || undefined,
    });

    setShowModal(true);
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.first_name.trim()) {
      alert("First name is required.");
      return;
    }

    try {
      setSaving(true);

      const token = sessionStorage.getItem("auth_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const payload: LeadInput = {
        ...form,
        first_name: form.first_name.trim(),
        last_name: form.last_name?.trim() || undefined,
        company: form.company?.trim() || undefined,
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        job_title: form.job_title?.trim() || undefined,
        notes: form.notes?.trim() || undefined,
        assigned_to: form.assigned_to || null,
      };

      if (editingLead) {
        await updateLead(token, editingLead.id, payload);
        alert("Lead updated successfully.");
      } else {
        await createLead(token, payload);
        alert("Lead created successfully.");
      }

      setShowModal(false);
      resetForm();
      setCurrentPage(1);
      await loadLeads(1, search, statusFilter, sourceFilter);
    } catch (err) {
      console.error("Lead save failed:", err);
      alert(
        err instanceof Error ? err.message : "Unable to save lead."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (leadId: number) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      const token = sessionStorage.getItem("auth_token");

      if (!token) {
        navigate("/login");
        return;
      }

      await deleteLead(token, leadId);

      const nextPage =
        leads.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;

      setCurrentPage(nextPage);
      await loadLeads(nextPage, search, statusFilter, sourceFilter);

      alert("Lead deleted successfully.");
    } catch (err) {
      console.error("Lead deletion failed:", err);
      alert("Unable to delete lead.");
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > lastPage) return;

    setCurrentPage(page);
    loadLeads(page, search, statusFilter, sourceFilter);
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Leads", icon: Users, path: "/leads" },
    { label: "Customers", icon: UserRound, path: "/customers" },
    { label: "Tasks", icon: CheckSquare, path: "/tasks" },
    { label: "Reports", icon: BarChart3, path: "/reports" },
  ];

  const formatStatus = (status: string) =>
    status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
            Workspace <span>/</span> <strong>Leads</strong>
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
              <h1>Lead Management</h1>
              <p>Manage, track and convert your business leads.</p>
            </div>

            <button className="submit-btn" onClick={openCreateModal}>
              <Plus size={17} /> Add New Lead
            </button>
          </div>

          <section className="panel tasks-panel">
            <div className="panel-heading">
              <div>
                <h3>All Leads ({total})</h3>
                <p>View and manage your potential customers</p>
              </div>

              <button
                className="text-btn"
                onClick={() => loadLeads(currentPage)}
                disabled={loading}
              >
                <RefreshCw size={15} /> Refresh
              </button>
            </div>

            <div className="lead-toolbar">
              <form className="lead-search-form" onSubmit={handleSearch}>
                <Search size={17} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search name, company or email..."
                />
                <button type="submit">Search</button>
              </form>

              <select
                value={statusFilter}
                onChange={(event) => handleStatusFilter(event.target.value)}
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(event) => handleSourceFilter(event.target.value)}
                aria-label="Filter by source"
              >
                <option value="">All Sources</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {loading ? (
              <p className="lead-message">Loading leads...</p>
            ) : error ? (
              <div className="lead-message error-message">
                {error}
                <button onClick={() => loadLeads(currentPage)}>Retry</button>
              </div>
            ) : leads.length === 0 ? (
              <div className="empty-state">
                <Users size={32} />
                <h3>No leads found</h3>
                <p>Try changing your search or filters, or add a new lead.</p>
                <button className="submit-btn" onClick={openCreateModal}>
                  <Plus size={16} /> Add New Lead
                </button>
              </div>
            ) : (
              <>
                <div className="leads-table-wrapper">
                  <table className="leads-table">
                    <thead>
                      <tr>
                        <th>Lead</th>
                        <th>Company</th>
                        <th>Contact</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id}>
                          <td>
                            <div className="lead-name">
                              <strong>
                                {lead.first_name} {lead.last_name || ""}
                              </strong>
                              <small>{lead.job_title || "No job title"}</small>
                            </div>
                          </td>

                          <td>{lead.company || "—"}</td>

                          <td>
                            <div className="lead-contact">
                              <span>{lead.email || "No email"}</span>
                              <small>{lead.phone || "No phone"}</small>
                            </div>
                          </td>

                          <td>{lead.source || "—"}</td>

                          <td>
                            <span className={`status-badge ${lead.status}`}>
                              {formatStatus(lead.status)}
                            </span>
                          </td>

                          <td>
                            {lead.assigned_user?.name || "Unassigned"}
                          </td>

                          <td>
                            <div className="lead-actions">
                              <button
                                type="button"
                                className="edit-task-btn"
                                title="Edit lead"
                                onClick={() => openEditModal(lead)}
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                className="delete-task-btn"
                                title="Delete lead"
                                onClick={() => handleDelete(lead.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="lead-pagination">
                  <span>
                    Page {currentPage} of {lastPage} · {total} total leads
                  </span>

                  <div>
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || loading}
                    >
                      <ChevronLeft size={17} /> Previous
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= lastPage || loading}
                    >
                      Next <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="task-modal lead-modal">
              <div className="modal-header">
                <div>
                  <h2>{editingLead ? "Edit Lead" : "Add New Lead"}</h2>
                  <p>
                    {editingLead
                      ? "Update lead information"
                      : "Enter details to create a new lead"}
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  disabled={saving}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveLead}>
                <div className="lead-form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      name="first_name"
                      value={form.first_name}
                      onChange={handleFormChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      name="last_name"
                      value={form.last_name || ""}
                      onChange={handleFormChange}
                      placeholder="Enter last name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Company</label>
                    <input
                      name="company"
                      value={form.company || ""}
                      onChange={handleFormChange}
                      placeholder="Company name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      name="job_title"
                      value={form.job_title || ""}
                      onChange={handleFormChange}
                      placeholder="Job title"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email || ""}
                      onChange={handleFormChange}
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      name="phone"
                      value={form.phone || ""}
                      onChange={handleFormChange}
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Lead Source</label>
                    <select
                      name="source"
                      value={form.source || ""}
                      onChange={handleFormChange}
                    >
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Advertisement">Advertisement</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={form.status || "new"}
                      onChange={handleFormChange}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                </div>
                <div className="form-group lead-notes">
                <label>Assigned To</label>

                <select
                    name="assigned_to"
                    value={form.assigned_to ? String(form.assigned_to) : ""}
                    onChange={(event) => {
                    const value = event.target.value;

                    setForm((previous) => ({
                        ...previous,
                        assigned_to: value ? Number(value) : undefined,
                    }));
                    }}
                >
                    <option value="">Unassigned</option>

                    {teamUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                    </option>
                    ))}
                </select>
                </div>

                <div className="form-group lead-notes">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={form.notes || ""}
                    onChange={handleFormChange}
                    placeholder="Add lead notes..."
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-task-btn"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingLead
                        ? "Update Lead"
                        : "Create Lead"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <footer className="dashboard-footer">
          © 2026 SmartCRM AI
          <span>Built for smarter customer relationships.</span>
        </footer>
      </main>
    </div>
  );
}

export default Leads;
