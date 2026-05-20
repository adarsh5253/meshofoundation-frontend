import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  User as UserIcon,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  Heart,
  Link2,
  Save,
  X,
  Loader2,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import {
  ApiError,
  profileApi,
  type AuthUser,
  type ProfilePatch,
  type UserProfile,
} from "@/lib/api";

// --- Form state shape ---
// We keep a string-only form state (so inputs are controlled & blur-free) and
// translate to/from the API shape at the boundary.
interface FormState {
  name: string;
  dob: string;
  gender: string;
  phone: string;
  bio: string;
  // address
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  // education
  highestQualification: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  // professional
  currentRole: string;
  organization: string;
  yearsOfExperience: string;
  skills: string; // comma-separated input; split on save
  // documents + interests + availability + social
  resumeUrl: string;
  interests: string; // comma-separated input
  availability: string;
  linkedin: string;
  twitter: string;
  github: string;
  website: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  dob: "",
  gender: "",
  phone: "",
  bio: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  highestQualification: "",
  fieldOfStudy: "",
  institution: "",
  graduationYear: "",
  currentRole: "",
  organization: "",
  yearsOfExperience: "",
  skills: "",
  resumeUrl: "",
  interests: "",
  availability: "",
  linkedin: "",
  twitter: "",
  github: "",
  website: "",
};

const QUALIFICATIONS = [
  { value: "", label: "— Select —" },
  { value: "high-school", label: "High School (10th)" },
  { value: "intermediate", label: "Intermediate (12th)" },
  { value: "diploma", label: "Diploma" },
  { value: "undergraduate", label: "Undergraduate (in progress)" },
  { value: "graduate", label: "Graduate (Bachelor's)" },
  { value: "postgraduate", label: "Postgraduate (Master's)" },
  { value: "doctorate", label: "Doctorate (PhD)" },
];

const GENDERS = [
  { value: "", label: "— Select —" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const AVAILABILITY_OPTS = [
  { value: "", label: "— Select —" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "evenings", label: "Evenings only" },
  { value: "flexible", label: "Flexible" },
];

const INTEREST_SUGGESTIONS = [
  "Education",
  "Environment",
  "Health & Wellness",
  "Women Empowerment",
  "Child Welfare",
  "Animal Welfare",
  "Disaster Relief",
  "Rural Development",
  "Mental Health",
  "Skill Training",
];

function userToForm(u: AuthUser | null): FormState {
  if (!u) return EMPTY_FORM;
  const p = u.profile || {};
  return {
    name: u.name || "",
    dob: p.dob ? String(p.dob).slice(0, 10) : "",
    gender: p.gender || "",
    phone: p.phone || "",
    bio: p.bio || "",
    line1: p.address?.line1 || "",
    line2: p.address?.line2 || "",
    city: p.address?.city || "",
    state: p.address?.state || "",
    country: p.address?.country || "India",
    pincode: p.address?.pincode || "",
    highestQualification: p.education?.highestQualification || "",
    fieldOfStudy: p.education?.fieldOfStudy || "",
    institution: p.education?.institution || "",
    graduationYear:
      p.education?.graduationYear != null ? String(p.education.graduationYear) : "",
    currentRole: p.professional?.currentRole || "",
    organization: p.professional?.organization || "",
    yearsOfExperience:
      p.professional?.yearsOfExperience != null
        ? String(p.professional.yearsOfExperience)
        : "",
    skills: (p.professional?.skills || []).join(", "),
    resumeUrl: p.resumeUrl || "",
    interests: (p.interests || []).join(", "),
    availability: p.availability || "",
    linkedin: p.social?.linkedin || "",
    twitter: p.social?.twitter || "",
    github: p.social?.github || "",
    website: p.social?.website || "",
  };
}

function formToPatch(f: FormState): ProfilePatch {
  const splitList = (s: string) =>
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  return {
    name: f.name.trim(),
    dob: f.dob || null,
    gender: (f.gender as UserProfile["gender"]) || "",
    phone: f.phone.trim(),
    bio: f.bio.trim(),
    address: {
      line1: f.line1.trim(),
      line2: f.line2.trim(),
      city: f.city.trim(),
      state: f.state.trim(),
      country: f.country.trim(),
      pincode: f.pincode.trim(),
    },
    education: {
      highestQualification:
        (f.highestQualification as NonNullable<
          UserProfile["education"]
        >["highestQualification"]) || "",
      fieldOfStudy: f.fieldOfStudy.trim(),
      institution: f.institution.trim(),
      graduationYear: f.graduationYear ? Number(f.graduationYear) : null,
    },
    professional: {
      currentRole: f.currentRole.trim(),
      organization: f.organization.trim(),
      yearsOfExperience: f.yearsOfExperience ? Number(f.yearsOfExperience) : null,
      skills: splitList(f.skills),
    },
    resumeUrl: f.resumeUrl.trim(),
    interests: splitList(f.interests),
    availability: (f.availability as UserProfile["availability"]) || "",
    social: {
      linkedin: f.linkedin.trim(),
      twitter: f.twitter.trim(),
      github: f.github.trim(),
      website: f.website.trim(),
    },
  };
}

// --- Section component ---
function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof UserIcon;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="text-primary" size={20} />
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg text-foreground">{title}</h2>
          {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </motion.div>
  );
}

function Field({
  label,
  hint,
  full,
  children,
}: {
  label: string;
  hint?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const { isAuthenticated, loading, user, refresh } = useAuth();
  const [form, setForm] = useState<FormState>(() => userToForm(user));
  const [initialLoading, setInitialLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync form with the latest user when AuthContext refreshes.
  useEffect(() => {
    setForm(userToForm(user));
  }, [user]);

  // Always fetch the freshest profile when arriving on this page.
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    setInitialLoading(true);
    profileApi
      .get()
      .then(({ user: u }) => {
        if (cancelled) return;
        setForm(userToForm(u));
      })
      .catch(() => {
        // Non-fatal; we still have whatever AuthContext loaded.
      })
      .finally(() => !cancelled && setInitialLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const completion = useMemo(() => computeCompletion(form), [form]);

  const handleSave = async () => {
    if (!form.name.trim() || form.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    try {
      await profileApi.update(formToPatch(form));
      await refresh();
      toast.success("Profile saved.");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not save your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleInterest = (tag: string) => {
    const current = form.interests
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const exists = current.some((c) => c.toLowerCase() === tag.toLowerCase());
    const next = exists
      ? current.filter((c) => c.toLowerCase() !== tag.toLowerCase())
      : [...current, tag];
    update({ interests: next.join(", ") });
  };

  // --- Auth guards ---
  if (loading) {
    return (
      <section className="section-padding pt-28 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </section>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/profile" }} replace />;
  }

  return (
    <section className="section-padding pt-28">
      <div className="container-narrow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-10"
        >
          <span className="section-badge">Your Account</span>
          <h1 className="section-title mt-3">Profile</h1>
          <p className="section-desc mt-3 max-w-2xl">
            A complete profile helps us match you to the right volunteering
            opportunities and speeds up future applications.
          </p>

          {/* Completion bar */}
          <div className="card-elevated rounded-2xl p-5 mt-6 max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {completion.percent === 100 ? (
                  <CheckCircle2 className="text-primary" size={18} />
                ) : (
                  <UserIcon className="text-primary" size={18} />
                )}
                <span className="text-sm font-medium text-foreground">
                  Profile {completion.percent}% complete
                </span>
              </div>
              {completion.percent < 100 && (
                <span className="text-xs text-muted-foreground">
                  {completion.missing} field
                  {completion.missing === 1 ? "" : "s"} left
                </span>
              )}
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${completion.percent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Read-only identity strip */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-8 px-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Mail size={14} className="text-primary" />
            {user?.email}
          </span>
          {user?.isVerified && (
            <span className="flex items-center gap-1.5 text-primary text-xs">
              <CheckCircle2 size={14} /> Verified
            </span>
          )}
        </div>

        {initialLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Personal */}
            <Section
              icon={UserIcon}
              title="Personal Information"
              desc="The basics — these appear on applications you submit through the site."
            >
              <Field label="Full name" full>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                  maxLength={100}
                />
              </Field>
              <Field label="Date of birth">
                <input
                  type="date"
                  className="input-field"
                  value={form.dob}
                  onChange={(e) => update({ dob: e.target.value })}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </Field>
              <Field label="Gender">
                <select
                  className="input-field"
                  value={form.gender}
                  onChange={(e) => update({ gender: e.target.value })}
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Phone number">
                <input
                  className="input-field"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  inputMode="tel"
                  maxLength={20}
                />
              </Field>
              <Field label="Resume / CV link">
                <input
                  className="input-field"
                  placeholder="https://drive.google.com/..."
                  value={form.resumeUrl}
                  onChange={(e) => update({ resumeUrl: e.target.value })}
                  type="url"
                />
              </Field>
              <Field
                label="Short bio"
                full
                hint={`${form.bio.length}/500 characters`}
              >
                <textarea
                  className="input-field min-h-[110px] py-3"
                  placeholder="Tell us a little about yourself, what you care about, and why you'd like to work with Mesho Foundation."
                  value={form.bio}
                  onChange={(e) => update({ bio: e.target.value.slice(0, 500) })}
                  maxLength={500}
                />
              </Field>
            </Section>

            {/* Address */}
            <Section
              icon={MapPin}
              title="Location"
              desc="Where you're based — helps us suggest local volunteering events."
            >
              <Field label="Address line 1" full>
                <input
                  className="input-field"
                  value={form.line1}
                  onChange={(e) => update({ line1: e.target.value })}
                  maxLength={120}
                />
              </Field>
              <Field label="Address line 2" full>
                <input
                  className="input-field"
                  value={form.line2}
                  onChange={(e) => update({ line2: e.target.value })}
                  maxLength={120}
                />
              </Field>
              <Field label="City">
                <input
                  className="input-field"
                  value={form.city}
                  onChange={(e) => update({ city: e.target.value })}
                  maxLength={80}
                />
              </Field>
              <Field label="State">
                <input
                  className="input-field"
                  value={form.state}
                  onChange={(e) => update({ state: e.target.value })}
                  maxLength={80}
                />
              </Field>
              <Field label="Country">
                <input
                  className="input-field"
                  value={form.country}
                  onChange={(e) => update({ country: e.target.value })}
                  maxLength={80}
                />
              </Field>
              <Field label="Pincode / ZIP">
                <input
                  className="input-field"
                  value={form.pincode}
                  onChange={(e) => update({ pincode: e.target.value })}
                  maxLength={12}
                />
              </Field>
            </Section>

            {/* Education */}
            <Section
              icon={GraduationCap}
              title="Education"
              desc="Your most recent or highest qualification."
            >
              <Field label="Highest qualification">
                <select
                  className="input-field"
                  value={form.highestQualification}
                  onChange={(e) =>
                    update({ highestQualification: e.target.value })
                  }
                >
                  {QUALIFICATIONS.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Field of study">
                <input
                  className="input-field"
                  placeholder="e.g. Environmental Science"
                  value={form.fieldOfStudy}
                  onChange={(e) => update({ fieldOfStudy: e.target.value })}
                  maxLength={120}
                />
              </Field>
              <Field label="Institution">
                <input
                  className="input-field"
                  placeholder="University / College"
                  value={form.institution}
                  onChange={(e) => update({ institution: e.target.value })}
                  maxLength={160}
                />
              </Field>
              <Field label="Graduation year">
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 2024"
                  value={form.graduationYear}
                  onChange={(e) => update({ graduationYear: e.target.value })}
                  min={1950}
                  max={2100}
                />
              </Field>
            </Section>

            {/* Professional */}
            <Section
              icon={Briefcase}
              title="Professional"
              desc="Your current role and skills you can bring to the table."
            >
              <Field label="Current role">
                <input
                  className="input-field"
                  placeholder="e.g. Software Engineer, Student"
                  value={form.currentRole}
                  onChange={(e) => update({ currentRole: e.target.value })}
                  maxLength={120}
                />
              </Field>
              <Field label="Organization">
                <input
                  className="input-field"
                  placeholder="Company / institution"
                  value={form.organization}
                  onChange={(e) => update({ organization: e.target.value })}
                  maxLength={160}
                />
              </Field>
              <Field label="Years of experience">
                <input
                  type="number"
                  className="input-field"
                  value={form.yearsOfExperience}
                  onChange={(e) =>
                    update({ yearsOfExperience: e.target.value })
                  }
                  min={0}
                  max={80}
                />
              </Field>
              <Field
                label="Skills"
                full
                hint="Comma-separated — e.g. teaching, photography, react"
              >
                <input
                  className="input-field"
                  placeholder="teaching, fundraising, photography"
                  value={form.skills}
                  onChange={(e) => update({ skills: e.target.value })}
                />
              </Field>
            </Section>

            {/* Volunteering */}
            <Section
              icon={Heart}
              title="Volunteering Preferences"
              desc="Causes you care about and when you can help."
            >
              <Field label="Interests" full hint="Tap to toggle, or type your own.">
                <div className="flex flex-wrap gap-2 mb-3">
                  {INTEREST_SUGGESTIONS.map((tag) => {
                    const selected = form.interests
                      .toLowerCase()
                      .split(",")
                      .map((s) => s.trim())
                      .includes(tag.toLowerCase());
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          selected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/40 text-muted-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <input
                  className="input-field"
                  placeholder="Or add custom interests, comma-separated"
                  value={form.interests}
                  onChange={(e) => update({ interests: e.target.value })}
                />
              </Field>
              <Field label="Availability" full>
                <select
                  className="input-field"
                  value={form.availability}
                  onChange={(e) => update({ availability: e.target.value })}
                >
                  {AVAILABILITY_OPTS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </Field>
            </Section>

            {/* Social / links */}
            <Section
              icon={Link2}
              title="Links"
              desc="Optional — share your professional profiles or portfolio."
            >
              <Field label="LinkedIn">
                <input
                  className="input-field"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedin}
                  onChange={(e) => update({ linkedin: e.target.value })}
                  type="url"
                />
              </Field>
              <Field label="Twitter / X">
                <input
                  className="input-field"
                  placeholder="https://x.com/..."
                  value={form.twitter}
                  onChange={(e) => update({ twitter: e.target.value })}
                  type="url"
                />
              </Field>
              <Field label="GitHub">
                <input
                  className="input-field"
                  placeholder="https://github.com/..."
                  value={form.github}
                  onChange={(e) => update({ github: e.target.value })}
                  type="url"
                />
              </Field>
              <Field label="Personal website">
                <input
                  className="input-field"
                  placeholder="https://your-site.com"
                  value={form.website}
                  onChange={(e) => update({ website: e.target.value })}
                  type="url"
                />
              </Field>
            </Section>

            {/* Sticky save bar */}
            <div className="sticky bottom-4 z-10">
              <div className="card-elevated rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg backdrop-blur-md bg-background/85">
                <p className="text-xs text-muted-foreground pl-2">
                  Changes save to your account immediately when you click Save.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm(userToForm(user))}
                    disabled={saving}
                    className="px-4 py-2 text-sm rounded-xl text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <X size={14} /> Reset
                  </button>
                  <motion.button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: saving ? 1 : 1.02 }}
                    whileTap={{ scale: saving ? 1 : 0.98 }}
                    className="gradient-btn px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-70"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Saving…
                      </>
                    ) : (
                      <>
                        <Save size={14} /> Save profile
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// --- Helpers ---

function computeCompletion(f: FormState): { percent: number; missing: number } {
  // 14 weighted "core" fields. Lightweight, doesn't penalise things users
  // genuinely don't have (e.g. github).
  const fields: Array<keyof FormState> = [
    "name",
    "dob",
    "gender",
    "phone",
    "bio",
    "city",
    "state",
    "country",
    "highestQualification",
    "fieldOfStudy",
    "institution",
    "currentRole",
    "skills",
    "interests",
  ];
  const filled = fields.filter((k) => String(f[k] || "").trim().length > 0).length;
  const percent = Math.round((filled / fields.length) * 100);
  return { percent, missing: fields.length - filled };
}
