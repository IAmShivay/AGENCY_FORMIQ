"use client";

import { Fragment, useCallback, useEffect, useState, type FormEvent } from 'react';
import { Edit, ExternalLink, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BADGE,
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_EMPTY,
  ADMIN_H2,
  ADMIN_ICON_BTN,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_ROW,
  ADMIN_TABLE,
  ADMIN_TABLE_WRAP,
  ADMIN_TD,
  ADMIN_TH,
  ADMIN_TONE,
  type AdminTone,
} from '@/components/admin/admin-ui';
import { supabase } from '@/lib/supabaseClient';
import {
  APPLICATION_RETENTION_MONTHS,
  APPLICATION_STATUSES,
  CAREERS_TABLES,
  EMPLOYMENT_TYPES,
  TEAMS,
  WORK_MODES,
  retentionCutoff,
  roleHref,
  type ApplicationStatus,
  type JobApplication,
  type JobOpening,
} from '@/lib/careers';
import { STUDIO_ADDRESS } from '@/lib/studio-facts';

const TABS = [
  { key: 'roles', label: 'Roles' },
  { key: 'applications', label: 'Applications' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

const STATUS_TONE: Record<ApplicationStatus, AdminTone> = {
  new: 'accent',
  reviewing: 'warning',
  interview: 'warning',
  offer: 'positive',
  hired: 'positive',
  rejected: 'neutral',
};

const LIST_FIELDS = ['responsibilities', 'requirements', 'nice_to_have'] as const;
type ListField = (typeof LIST_FIELDS)[number];
const LIST_LABEL: Record<ListField, string> = { responsibilities: 'What you will do', requirements: 'What we are looking for', nice_to_have: 'Nice to have' };

type RoleDraft = Omit<JobOpening, 'id' | 'created_at' | 'updated_at' | ListField> & Record<ListField, string>;

const EMPTY_ROLE: RoleDraft = {
  title: '',
  team: TEAMS[0],
  location: `${STUDIO_ADDRESS.city}, India`,
  work_mode: WORK_MODES[0],
  employment_type: EMPLOYMENT_TYPES[0],
  summary: '',
  description: '',
  responsibilities: '',
  requirements: '',
  nice_to_have: '',
  salary: '',
  is_open: true,
};

const toLines = (text: string) => text.split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function AdminCareers() {
  const [tab, setTab] = useState<TabKey>('roles');
  const [roles, setRoles] = useState<JobOpening[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<RoleDraft>(EMPTY_ROLE);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openApp, setOpenApp] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [r, a] = await Promise.all([
      supabase.from(CAREERS_TABLES.roles).select('*').order('created_at', { ascending: false }),
      supabase.from(CAREERS_TABLES.applications).select('*').order('created_at', { ascending: false }),
    ]);
    if (r.error || a.error) toast.error('Could not load careers data. Has the careers migration been run?');
    setRoles((r.data as JobOpening[]) ?? []);
    setApplications((a.data as JobApplication[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const reset = () => { setDraft(EMPTY_ROLE); setEditingId(null); setShowForm(false); };

  const edit = (role: JobOpening) => {
    setDraft({ ...role, responsibilities: role.responsibilities.join('\n'), requirements: role.requirements.join('\n'), nice_to_have: role.nice_to_have.join('\n') });
    setEditingId(role.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    const payload = {
      ...draft,
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      description: draft.description.trim(),
      salary: draft.salary.trim(),
      location: draft.location.trim(),
      responsibilities: toLines(draft.responsibilities),
      requirements: toLines(draft.requirements),
      nice_to_have: toLines(draft.nice_to_have),
      updated_at: new Date().toISOString(),
    };
    const { error } = editingId
      ? await supabase.from(CAREERS_TABLES.roles).update(payload).eq('id', editingId)
      : await supabase.from(CAREERS_TABLES.roles).insert([payload]);
    setSaving(false);
    if (error) { toast.error(`Could not save role: ${error.message}`); return; }
    toast.success(editingId ? 'Role updated' : 'Role published');
    reset();
    load();
  };

  const toggleOpen = async (role: JobOpening) => {
    const { error } = await supabase.from(CAREERS_TABLES.roles).update({ is_open: !role.is_open, updated_at: new Date().toISOString() }).eq('id', role.id);
    if (error) { toast.error('Could not update role'); return; }
    toast.success(role.is_open ? 'Role closed' : 'Role reopened');
    load();
  };

  const remove = async (role: JobOpening) => {
    if (!window.confirm(`Delete "${role.title}"? Applications are kept.`)) return;
    const { error } = await supabase.from(CAREERS_TABLES.roles).delete().eq('id', role.id);
    if (error) { toast.error('Could not delete role'); return; }
    toast.success('Role deleted');
    load();
  };

  const setStatus = async (app: JobApplication, status: ApplicationStatus) => {
    const { error } = await supabase.from(CAREERS_TABLES.applications).update({ status }).eq('id', app.id);
    if (error) { toast.error('Could not update status'); return; }
    setApplications((list) => list.map((a) => (a.id === app.id ? { ...a, status } : a)));
  };

  const removeApplication = async (app: JobApplication) => {
    if (!window.confirm(`Delete the application from ${app.name}? This cannot be undone.`)) return;
    const { error } = await supabase.from(CAREERS_TABLES.applications).delete().eq('id', app.id);
    if (error) { toast.error('Could not delete application'); return; }
    setApplications((list) => list.filter((a) => a.id !== app.id));
  };

  const cutoff = retentionCutoff();
  const expired = applications.filter((a) => new Date(a.created_at) < cutoff);

  const purgeExpired = async () => {
    if (!window.confirm(`Delete ${expired.length} application(s) older than ${APPLICATION_RETENTION_MONTHS} months? This cannot be undone.`)) return;
    const { error } = await supabase.from(CAREERS_TABLES.applications).delete().lt('created_at', cutoff.toISOString());
    if (error) { toast.error('Could not delete expired applications'); return; }
    toast.success('Expired applications deleted');
    setApplications((list) => list.filter((a) => new Date(a.created_at) >= cutoff));
  };

  const newCount = applications.filter((a) => a.status === 'new').length;
  const field = (key: keyof RoleDraft) => ({
    value: String(draft[key] ?? ''),
    onChange: (e: { target: { value: string } }) => setDraft((d) => ({ ...d, [key]: e.target.value })),
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Studio"
        title="Careers"
        description="Publish open roles on /careers and review applications."
        actions={tab === 'roles' && (
          <button type="button" onClick={() => (showForm ? reset() : setShowForm(true))} className={showForm ? ADMIN_BTN_OUTLINE : ADMIN_BTN_PRIMARY}>
            {showForm ? 'Cancel' : <><PlusCircle className="h-4 w-4" /> Add role</>}
          </button>
        )}
      />

      <div role="tablist" aria-label="Careers sections" className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`min-h-10 rounded-full border px-4 text-sm font-medium transition-colors ${tab === t.key ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
            {t.key === 'applications' && newCount > 0 && <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground tabular-nums">{newCount}</span>}
          </button>
        ))}
      </div>

      {tab === 'roles' && showForm && (
        <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
          <h2 className={`${ADMIN_H2} mb-5`}>{editingId ? 'Edit role' : 'New role'}</h2>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`} htmlFor="role-title">Job title</label>
                <input id="role-title" className={ADMIN_INPUT} placeholder="Senior brand designer" required {...field('title')} />
              </div>
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`} htmlFor="role-team">Team</label>
                <select id="role-team" className={ADMIN_INPUT} {...field('team')}>{TEAMS.map((t) => <option key={t}>{t}</option>)}</select>
              </div>
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`} htmlFor="role-location">Location</label>
                <input id="role-location" className={ADMIN_INPUT} {...field('location')} />
              </div>
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`} htmlFor="role-mode">Work mode</label>
                <select id="role-mode" className={ADMIN_INPUT} {...field('work_mode')}>{WORK_MODES.map((m) => <option key={m}>{m}</option>)}</select>
              </div>
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`} htmlFor="role-type">Employment type</label>
                <select id="role-type" className={ADMIN_INPUT} {...field('employment_type')}>{EMPLOYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
              </div>
              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`} htmlFor="role-salary">Salary (optional, shown publicly)</label>
                <input id="role-salary" className={ADMIN_INPUT} placeholder="₹6–9 LPA" {...field('salary')} />
              </div>
              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`} htmlFor="role-summary">One-line summary</label>
                <input id="role-summary" className={ADMIN_INPUT} placeholder="Lead brand identity projects for clients in Europe and the UAE." {...field('summary')} />
              </div>
              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`} htmlFor="role-description">About the role</label>
                <textarea id="role-description" rows={4} className={`${ADMIN_INPUT} h-auto py-2.5`} {...field('description')} />
              </div>
              {LIST_FIELDS.map((key) => (
                <div key={key} className="md:col-span-2">
                  <label className={`${ADMIN_LABEL} mb-2 block`} htmlFor={`role-${key}`}>{LIST_LABEL[key]} (one per line)</label>
                  <textarea id={`role-${key}`} rows={4} className={`${ADMIN_INPUT} h-auto py-2.5`} {...field(key)} />
                </div>
              ))}
              <label className="md:col-span-2 flex items-center gap-3 text-sm">
                <input type="checkbox" checked={draft.is_open} onChange={(e) => setDraft((d) => ({ ...d, is_open: e.target.checked }))} className="h-4 w-4" />
                Show this role on the careers page
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className={ADMIN_BTN_PRIMARY}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} {editingId ? 'Save changes' : 'Publish role'}
              </button>
              <button type="button" onClick={reset} className={ADMIN_BTN_OUTLINE}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className={ADMIN_EMPTY}><Loader2 className="mx-auto h-5 w-5 animate-spin" /></div>}

      {!loading && tab === 'roles' && (
        <div className={ADMIN_TABLE_WRAP}>
          {roles.length === 0 ? (
            <p className={ADMIN_EMPTY}>No roles yet. The careers page shows an open application form until you add one.</p>
          ) : (
            <table className={ADMIN_TABLE}>
              <thead><tr><th className={ADMIN_TH}>Role</th><th className={ADMIN_TH}>Team</th><th className={ADMIN_TH}>Type</th><th className={ADMIN_TH}>Status</th><th className={ADMIN_TH}>Applications</th><th className={ADMIN_TH} /></tr></thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.id} className={ADMIN_ROW}>
                    <td className={`${ADMIN_TD} font-medium`}>{r.title}<div className="text-xs text-muted-foreground">{r.location} · {r.work_mode}</div></td>
                    <td className={ADMIN_TD}>{r.team}</td>
                    <td className={ADMIN_TD}>{r.employment_type}</td>
                    <td className={ADMIN_TD}>
                      <button type="button" onClick={() => toggleOpen(r)} className={`${ADMIN_BADGE} ${ADMIN_TONE[r.is_open ? 'positive' : 'neutral']}`} title="Click to toggle">
                        {r.is_open ? 'Open' : 'Closed'}
                      </button>
                    </td>
                    <td className={`${ADMIN_TD} tabular-nums`}>{applications.filter((a) => a.opening_id === r.id).length}</td>
                    <td className={`${ADMIN_TD} text-right whitespace-nowrap`}>
                      {r.is_open && <a href={roleHref(r)} target="_blank" rel="noopener noreferrer" className={ADMIN_ICON_BTN} aria-label="View on site"><ExternalLink className="h-4 w-4" /></a>}
                      <button type="button" onClick={() => edit(r)} className={ADMIN_ICON_BTN} aria-label="Edit"><Edit className="h-4 w-4" /></button>
                      <button type="button" onClick={() => remove(r)} className={ADMIN_ICON_BTN} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {!loading && tab === 'applications' && expired.length > 0 && (
        <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} flex flex-wrap items-center justify-between gap-4 border-warning/40`}>
          <p className="text-sm">
            <strong>{expired.length}</strong> application(s) are older than {APPLICATION_RETENTION_MONTHS} months. The privacy policy promises to delete them.
          </p>
          <button type="button" onClick={purgeExpired} className={ADMIN_BTN_OUTLINE}><Trash2 className="h-4 w-4" /> Delete expired</button>
        </div>
      )}

      {!loading && tab === 'applications' && (
        <div className={ADMIN_TABLE_WRAP}>
          {applications.length === 0 ? (
            <p className={ADMIN_EMPTY}>No applications yet.</p>
          ) : (
            <table className={ADMIN_TABLE}>
              <thead><tr><th className={ADMIN_TH}>Candidate</th><th className={ADMIN_TH}>Role</th><th className={ADMIN_TH}>Links</th><th className={ADMIN_TH}>Received</th><th className={ADMIN_TH}>Status</th><th className={ADMIN_TH} /></tr></thead>
              <tbody>
                {applications.map((a) => (
                  <Fragment key={a.id}>
                    <tr className={ADMIN_ROW}>
                      <td className={ADMIN_TD}>
                        <button type="button" onClick={() => setOpenApp(openApp === a.id ? null : a.id)} className="text-left font-medium hover:underline">{a.name}</button>
                        <div className="text-xs text-muted-foreground"><a href={`mailto:${a.email}`} className="hover:underline">{a.email}</a>{a.location && ` · ${a.location}`}</div>
                      </td>
                      <td className={ADMIN_TD}>{a.role_title}</td>
                      <td className={`${ADMIN_TD} space-x-3 whitespace-nowrap`}>
                        {([['Work', a.portfolio_url], ['CV', a.cv_url], ['LinkedIn', a.linkedin_url]] as const).filter(([, v]) => v).map(([label, href]) => (
                          <a key={label} href={href!} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline">{label}</a>
                        ))}
                      </td>
                      <td className={`${ADMIN_TD} whitespace-nowrap`}>{formatDate(a.created_at)}</td>
                      <td className={ADMIN_TD}>
                        <select aria-label={`Status for ${a.name}`} value={a.status} onChange={(e) => setStatus(a, e.target.value as ApplicationStatus)} className={`${ADMIN_BADGE} ${ADMIN_TONE[STATUS_TONE[a.status]]} bg-transparent capitalize`}>
                          {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className={`${ADMIN_TD} text-right`}>
                        <button type="button" onClick={() => removeApplication(a)} className={ADMIN_ICON_BTN} aria-label="Delete application"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                    {openApp === a.id && (
                      <tr className="border-t border-border bg-muted/30">
                        <td colSpan={6} className="px-4 py-4 text-sm">
                          {a.phone && <p className="mb-2"><span className={ADMIN_LABEL}>Phone</span> {a.phone}</p>}
                          <p className="whitespace-pre-wrap text-foreground/85">{a.message || 'No message.'}</p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
