"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";
import type { Dictionary } from "@/i18n/dictionaries/ar";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginForm({
  locale,
  common,
  dict,
}: {
  locale: Locale;
  common: Dictionary["common"];
  dict: Dictionary["admin"]["login"];
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const errorMessages: Record<string, string> = {
    RATE_LIMITED: dict.errorRateLimited,
    INVALID_INPUT: dict.errorInvalidInput,
    SERVER_MISCONFIGURED: dict.errorServerMisconfigured,
    INVALID_CREDENTIALS: dict.errorInvalidCredentials,
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(errorMessages[data?.error as string] ?? dict.genericError);
        return;
      }
      router.push(localizePath(locale, "/admin/articles"));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
          <LanguageSwitcher
            locale={locale}
            otherLanguageName={common.otherLanguageName}
            label={common.languageSwitcherLabel}
          />
        </div>
        <h1>{dict.title}</h1>
        <p className="admin-login-sub">{dict.subtitle}</p>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="admin-field">
            <label htmlFor="username">{dict.username}</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="password">{dict.password}</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? dict.submitting : dict.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
