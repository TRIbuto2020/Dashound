import { signIn } from "@/app/admin/actions";
import { hasSupabaseEnvironment } from "@/src/lib/env";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <section className="admin-panel admin-panel--narrow">
      <p className="admin-panel__eyebrow">Acesso administrativo</p>
      <h1 className="admin-panel__title">Entrar no painel</h1>
      <p className="admin-panel__text">
        Use o endereço administrativo e a senha definidos no Supabase.
      </p>
      {!hasSupabaseEnvironment ? (
        <p className="admin-notice">Configure o Supabase antes de entrar.</p>
      ) : (
        <form className="admin-form" action={signIn}>
          <label className="admin-field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="admin-field">
            <span>Senha</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              required
            />
          </label>
          <button className="ui-button" type="submit">
            Entrar
          </button>
        </form>
      )}
      {error === "unauthorized" && (
        <p className="admin-notice admin-notice--error">Esse endereço não está autorizado.</p>
      )}
      {error === "credentials" && (
        <p className="admin-notice admin-notice--error">Email ou senha inválidos.</p>
      )}
    </section>
  );
}
