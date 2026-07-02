import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { LoginPayload } from "@/types/api";

type LoginPageProps = {
  isLoading: boolean;
  error: string | null;
  onLogin: (payload: LoginPayload) => Promise<void>;
};

export function LoginPage({ isLoading, error, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onLogin({ email, password });
  }

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="Admin Iuran RT">
        <div className="auth-grid" aria-hidden="true" />
        <div className="auth-quote">
          <strong>Slowliving System.</strong>
          <span>
            Kelola iuran warga dengan mudah dan efisien menggunakan Slowliving
            System.
          </span>
        </div>
      </section>

      <section className="auth-panel" aria-label="Login admin">
        <div className="auth-card">
          <div className="auth-card-body">
            <div className="auth-heading">
              <h1>Sign in to Slowliving System</h1>
              <p>Welcome back!</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Email address
                <input
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              {error && <p className="form-error">{error}</p>}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>
          </div>

          <div className="auth-card-footer">
            <span>Galih Dwi Prasetyo &copy; 2026</span>
          </div>
        </div>
      </section>
    </main>
  );
}
