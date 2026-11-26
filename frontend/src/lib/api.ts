
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

