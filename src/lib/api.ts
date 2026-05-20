/**
 * Thin wrapper around fetch() for talking to the Mesho Foundation backend.
 *
 * Configure the backend URL via a Vite env variable:
 *   VITE_API_URL=http://localhost:5000
 * (set in .env.local at the root of the frontend project)
 */

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = RequestInit & { auth?: boolean };

function getToken(): string | null {
  try {
    return localStorage.getItem("mesho.authToken");
  } catch {
    return null;
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = false, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...((headers as Record<string, string>) || {}),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...rest, headers: finalHeaders });
  } catch {
    throw new ApiError(
      "Unable to reach the server. Please check your connection and try again.",
      0
    );
  }

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const message =
      (data && (data as { message?: string }).message) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

// --- Auth-specific helpers ---

export interface UserProfile {
  dob?: string | null;
  gender?: "" | "male" | "female" | "other" | "prefer-not-to-say";
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  education?: {
    highestQualification?:
      | ""
      | "high-school"
      | "intermediate"
      | "diploma"
      | "undergraduate"
      | "graduate"
      | "postgraduate"
      | "doctorate";
    fieldOfStudy?: string;
    institution?: string;
    graduationYear?: number | null;
  };
  professional?: {
    currentRole?: string;
    organization?: string;
    yearsOfExperience?: number | null;
    skills?: string[];
  };
  resumeUrl?: string;
  interests?: string[];
  availability?: "" | "weekdays" | "weekends" | "evenings" | "flexible";
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  completedAt?: string | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isVerified?: boolean;
  createdAt?: string;
  profile?: UserProfile;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface SignupResponse {
  message: string;
  email: string;
  /**
   * In local dev, when SMTP isn't configured (and the backend has
   * DEV_RETURN_OTP=true), the server returns the OTP here so the user can
   * continue without checking email. NEVER set this in production.
   */
  devOtp?: string;
}

export interface ResendOtpResponse {
  message: string;
  /** Same dev-only escape hatch as SignupResponse.devOtp. */
  devOtp?: string;
}

/** Response from POST /api/auth/verify-otp — includes a JWT so the user is immediately logged in. */
export interface VerifyOtpResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export const authApi = {
  signup: (body: { name: string; email: string; password: string }) =>
    apiRequest<SignupResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    apiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  verifyOtp: (body: { email: string; otp: string }) =>
    apiRequest<VerifyOtpResponse>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  resendOtp: (email: string) =>
    apiRequest<ResendOtpResponse>("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  me: () => apiRequest<{ user: AuthUser }>("/api/auth/me", { auth: true }),
};

// --- Profile ---

/** Patch payload — every field optional, can update name + any profile field. */
export interface ProfilePatch {
  name?: string;
  dob?: string | null;
  gender?: UserProfile["gender"];
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  address?: UserProfile["address"];
  education?: UserProfile["education"];
  professional?: UserProfile["professional"];
  resumeUrl?: string;
  interests?: string[];
  availability?: UserProfile["availability"];
  social?: UserProfile["social"];
}

export const profileApi = {
  get: () =>
    apiRequest<{ user: AuthUser }>("/api/profile", { auth: true }),
  update: (patch: ProfilePatch) =>
    apiRequest<{ user: AuthUser }>("/api/profile", {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(patch),
    }),
};
