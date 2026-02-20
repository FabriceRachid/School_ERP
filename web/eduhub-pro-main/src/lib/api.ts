import { FrontendBundle, hydrateFrontendBundle, saveFrontendBundle } from "@/data/mock-data";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:3001";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: "super_admin" | "admin_school" | "teacher";
    schoolId?: string;
  };
  accessToken: string;
  refreshToken: string;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (init?.headers) {
    const incomingHeaders = new Headers(init.headers);
    incomingHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = await response.json();
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || "API error");
  }

  return payload.data as T;
}

export async function loginFrontend(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/api/frontend/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loadWebBootstrap(accessToken: string): Promise<FrontendBundle> {
  const data = await apiRequest<FrontendBundle>("/api/frontend/web/bootstrap", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  hydrateFrontendBundle(data);
  return data;
}

export async function refreshWebBootstrap(): Promise<FrontendBundle> {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) {
    throw new Error("Session expirée");
  }

  const data = await loadWebBootstrap(accessToken);
  saveFrontendBundle(data);
  return data;
}

export async function updateFrontendSchool(
  schoolId: string,
  payload: { name?: string; address?: string; phone?: string; email?: string; isActive?: boolean }
) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) {
    throw new Error("Session expirée");
  }

  return apiRequest<{
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    is_active: boolean;
  }>(`/api/frontend/schools/${schoolId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function createSchoolWithAdmin(payload: {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  admin?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
}) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) {
    throw new Error("Session expirée");
  }

  const normalizedName = payload.name?.trim();
  if (!normalizedName) {
    throw new Error("Le nom de l'école est obligatoire");
  }

  return apiRequest<{
    school: {
      id: string;
      name: string;
      address: string;
      phone: string;
      email: string;
      is_active: boolean;
    };
    admin: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      onboarding?: {
        temporary_password?: string | null;
      };
    } | null;
  }>("/api/schools", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ ...payload, name: normalizedName }),
  });
}

export async function provisionUser(payload: {
  school_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "admin" | "teacher" | "parent" | "student";
  phone?: string;
  address?: string;
  specialization?: string;
}) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>("/api/users/provision", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function enrollStudent(payload: {
  first_name: string;
  last_name: string;
  email: string;
  class_id?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
}) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>("/api/students/enroll", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function createClass(payload: {
  name: string;
  academic_year: string;
  level?: string;
  cycle_name?: string;
  capacity?: number;
  fees?: number;
}) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>("/api/classes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function createSubject(payload: {
  name: string;
  code?: string;
  coefficient?: number;
}) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>("/api/subjects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateSubject(id: string, payload: {
  name?: string;
  code?: string;
  coefficient?: number;
}) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>(`/api/subjects/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteSubject(id: string) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>(`/api/subjects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function createTimetableSlot(payload: {
  class_id: string;
  subject_id: string;
  teacher_id: string;
  day: "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi";
  start_time: string;
  end_time: string;
}) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>("/api/timetable", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateTimetableSlot(id: string, payload: {
  class_id?: string;
  subject_id?: string;
  teacher_id?: string;
  day?: "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi";
  start_time?: string;
  end_time?: string;
}) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>(`/api/timetable/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteTimetableSlot(id: string) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>(`/api/timetable/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function createPayment(payload: {
  student_id: string;
  amount: number;
  payment_date?: string;
  payment_method?: string;
  reference_number?: string;
  label?: string;
}) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>("/api/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function getSchoolPayments() {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any[]>("/api/payments/school", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  status?: "read" | "unread";
  created_at?: string;
  read_at?: string | null;
  sender_first_name?: string;
  sender_last_name?: string;
}

export async function getMyNotifications(limit = 50) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<NotificationItem[]>(`/api/notifications?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function getUnreadNotificationsCount() {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<{ count: number }>("/api/notifications/unread/count", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function markNotificationAsRead(id: string) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>(`/api/notifications/${id}/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function markAllNotificationsAsRead() {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<{ count: number }>("/api/notifications/read-all", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function deleteNotification(id: string) {
  const accessToken = localStorage.getItem("erp_access_token");
  if (!accessToken) throw new Error("Session expirée");
  return apiRequest<any>(`/api/notifications/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export interface CompositionItem {
  id: string;
  class_id: string;
  class_name?: string;
  academic_year: string;
  trimester: string;
  exam_date: string;
  instructions?: string;
  status: 'planned' | 'ongoing' | 'closed';
  upload_count?: number;
}

export interface CompositionUploadItem {
  id: string;
  composition_id: string;
  teacher_id: string;
  subject_id: string;
  subject_title?: string;
  subject_name?: string;
  file_url?: string;
  notes_summary?: string;
  notes_uploaded?: boolean;
  teacher_first_name?: string;
  teacher_last_name?: string;
}

export async function listCompositions(academicYear?: string) {
  const accessToken = localStorage.getItem('erp_access_token');
  if (!accessToken) throw new Error('Session expirée');
  const qs = academicYear ? `?academic_year=${encodeURIComponent(academicYear)}` : '';
  return apiRequest<CompositionItem[]>(`/api/compositions${qs}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function createComposition(payload: {
  class_id: string;
  academic_year: string;
  trimester: string;
  exam_date: string;
  instructions?: string;
}) {
  const accessToken = localStorage.getItem('erp_access_token');
  if (!accessToken) throw new Error('Session expirée');
  return apiRequest<CompositionItem>('/api/compositions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });
}

export async function updateComposition(id: string, payload: { exam_date?: string; instructions?: string; status?: 'planned' | 'ongoing' | 'closed' }) {
  const accessToken = localStorage.getItem('erp_access_token');
  if (!accessToken) throw new Error('Session expirée');
  return apiRequest<CompositionItem>(`/api/compositions/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });
}

export async function getCompositionUploads(id: string) {
  const accessToken = localStorage.getItem('erp_access_token');
  if (!accessToken) throw new Error('Session expirée');
  return apiRequest<CompositionUploadItem[]>(`/api/compositions/${id}/uploads`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function upsertCompositionUpload(id: string, payload: {
  teacher_id?: string;
  subject_id: string;
  subject_title?: string;
  file_url?: string;
  notes_summary?: string;
  notes_uploaded?: boolean;
}) {
  const accessToken = localStorage.getItem('erp_access_token');
  if (!accessToken) throw new Error('Session expirée');
  return apiRequest<CompositionUploadItem>(`/api/compositions/${id}/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });
}

export async function createGrade(payload: {
  student_id: string;
  subject_id: string;
  evaluation_type: string;
  score: number;
  max_score?: number;
  academic_year: string;
  semester: string;
  date: string;
  comments?: string;
}) {
  const accessToken = localStorage.getItem('erp_access_token');
  if (!accessToken) throw new Error('Session expirée');
  return apiRequest<any>('/api/grades', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });
}
