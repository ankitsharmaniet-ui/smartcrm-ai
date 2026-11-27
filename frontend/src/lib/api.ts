
const API_URL = '/api';

export interface AuthResponse {
  status: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

async function apiRequest<T>(
  endpoint: string,
  data: Record<string, string>
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Something went wrong'
    );
  }

  return result as T;
}

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  return apiRequest<AuthResponse>('/register', data);
};

export const loginUser = (data: {
  email: string;
  password: string;
}) => {
  return apiRequest<AuthResponse>('/login', data);
};


export const logoutUser = async (token: string) => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Logout failed");
  }

  return result;
};

export interface CurrentUserResponse {
  status: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const getCurrentUser = async (token: string) => {
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to fetch current user");
  }

  return result as CurrentUserResponse;
};


export interface DashboardResponse {
  status: boolean;
  message: string;
  data: {
    total_leads: number;
    total_customers: number;
    open_tasks: number;
    monthly_performance: {
      month: string;
      leads: number;
      customers: number;
    }[];
    upcoming_tasks: {
      id: number;
      title: string;
      due_at: string;
      priority: string;
      status: string;
      assigned_to: string | null;
    }[];
    recent_leads: {
      id: number;
      name: string;
      email: string | null;
      company: string | null;
      status: string;
      source: string | null;
    }[];
  };
}

export const getDashboardData = async (token: string) => {
  const response = await fetch(`${API_URL}/dashboard`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to fetch dashboard data");
  }

  return result as DashboardResponse;
};

export interface Task {
  id: number;
  title: string;
  description: string | null;
  type: string;
  priority: string;
  status: string;
  due_at: string | null;
  assigned_to: number | null;
  created_by: number | null;
  created_at: string;
}

export interface TaskResponse {
  status: boolean;
  message: string;
  data: Task;
}

export interface TaskListResponse {
  status: boolean;
  message: string;
  data: {
    data: Task[];
    current_page: number;
    last_page: number;
    total: number;
  };
}
// Get all tasks
export const getTasks = async (token: string) => {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to fetch tasks");
  }

  return result as TaskListResponse;
};

// Create task
export const createTask = async (
  token: string,
  data: {
    title: string;
    description?: string;
    type: string;
    priority: string;
    due_at?: string;
  }
) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to create task");
  }

  return result as TaskResponse;
};

// Update task
export const updateTask = async (
  token: string,
  id: number,
  data: Partial<{
    title: string;
    description: string;
    type: string;
    priority: string;
    status: string;
    due_at: string;
  }>
) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to update task");
  }

  return result as TaskResponse;
};

// Delete task
export const deleteTask = async (token: string, id: number) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to delete task");
  }

  return result;
};



// ===============================
// LEAD MANAGEMENT APIs
// ===============================

export interface Lead {
  id: number;
  organization_id: number;
  assigned_to: number | null;
  first_name: string;
  last_name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  assigned_user?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export interface LeadResponse {
  status: boolean;
  message: string;
  data: Lead;
}

export interface LeadListResponse {
  status: boolean;
  message: string;
  data: {
    data: Lead[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface LeadInput {
  first_name: string;
  last_name?: string;
  company?: string;
  email?: string;
  phone?: string;
  job_title?: string;
  source?: string;
  status?: string;
  notes?: string;
  assigned_to?: number | null;
}

// Get all leads with optional filters
export const getLeads = async (
  token: string,
  filters?: {
    search?: string;
    status?: string;
    source?: string;
    assigned_to?: number;
    page?: number;
  }
) => {
  const params = new URLSearchParams();

  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  });

  const query = params.toString();
  const url = `${API_URL}/leads${query ? `?${query}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to fetch leads");
  }

  return result as LeadListResponse;
};

// Create lead
export const createLead = async (
  token: string,
  data: LeadInput
) => {
  const response = await fetch(`${API_URL}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to create lead");
  }

  return result as LeadResponse;
};

// Update lead
export const updateLead = async (
  token: string,
  id: number,
  data: Partial<LeadInput>
) => {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to update lead");
  }

  return result as LeadResponse;
};

// Delete lead
export const deleteLead = async (
  token: string,
  id: number
) => {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to delete lead");
  }

  return result;
};

export interface TeamUser {
  id: number;
  name: string;
  email: string;
}

export async function getUsers(token: string): Promise<{
  status: boolean;
  data: TeamUser[];
}> {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to load team members.");
  }

  return result;
}

