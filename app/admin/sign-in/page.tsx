import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <section className="hero">
      <div className="panel">
        <div className="pill">Maintainer access</div>
        <h1>Sign in with GitHub.</h1>
        <p className="lead">Admin access is limited to the GitHub usernames listed in <strong>ALLOWED_MAINTAINERS</strong>.</p>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin" });
          }}
        >
          <button className="button" type="submit">Continue with GitHub</button>
        </form>
      </div>
      <div className="card">
        <h2>Secure setup</h2>
        <p>Configure GitHub OAuth, set a strong Auth secret, and keep your database connection string private.</p>
      </div>
    </section>
  );
}
