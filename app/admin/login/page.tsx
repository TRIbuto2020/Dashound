import { requestMagicLink } from "@/app/admin/actions";
import { hasSupabaseEnvironment } from "@/src/lib/env";

type LoginPageProps = {
  searchParams: Promise<{ sent?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { sent, error } = await searchParams;

  return (
    <section className="admin-panel admin-panel--narrow">
      <p className="admin-panel__eyebrow">Acesso administrativo</p>
      <h1 className="admin-panel__title">Entrar sem senha</h1>
      <p className="admin-panel__text">
        O acesso é enviado apenas para o endereço administrativo configurado.
      </p>
      {!hasSupabaseEnvironment ? (
        <p className="admin-notice">Configure o Supabase antes de solicitar o link.</p>
      ) : (
        <form className="admin-form" action={requestMagicLink}>
          <label className="admin-field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <button className="ui-button" type="submit">
            Enviar magic link
          </button>
        </form>
      )}
      {sent && <p className="admin-notice">Confira sua caixa de entrada.</p>}
      {error === "unauthorized" && (
        <p className="admin-notice admin-notice--error">Esse endereço não está autorizado.</p>
      )}
      {error === "delivery" && (
        <p className="admin-notice admin-notice--error">Não foi possível enviar o link.</p>
      )}
    </section>
  );
}
