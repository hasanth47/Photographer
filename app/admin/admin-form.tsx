"use client";

import { useActionState, type ReactNode } from "react";
import type { ActionState } from "./actions";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

const initialState: ActionState = { ok: false };

/** Wraps an admin Server Action with pending/feedback UI. */
export function AdminForm({
  action,
  submitLabel = "Save",
  children,
  className = "",
}: {
  action: Action;
  submitLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className={`space-y-5 ${className}`}>
      {children}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn-solid label">
          {pending ? "Saving…" : submitLabel}
        </button>
        {state.message && (
          <p role="status" className={`text-sm ${state.ok ? "text-accent" : "text-red-400"}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label block text-muted">
        {label}
      </label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} className="admin-field mt-2" />
      {hint && <p className="mt-1 font-mono text-[0.65rem] text-muted">{hint}</p>}
    </div>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label block text-muted">
        {label}
      </label>
      <textarea id={name} name={name} rows={rows} defaultValue={defaultValue} className="admin-field mt-2 resize-y" />
      {hint && <p className="mt-1 font-mono text-[0.65rem] text-muted">{hint}</p>}
    </div>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-foreground/80">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="accent-accent" />
      {label}
    </label>
  );
}
