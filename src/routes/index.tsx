import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, SCREENS, useTechLiving } from "@/components/techliving/TechLivingApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechLiving — Protótipo de alta fidelidade" },
      { name: "description", content: "As 8 telas do app TechLiving: login, plano, início, dispositivos, controle, rotinas, perfis e modo sem Wi-Fi." },
      { property: "og:title", content: "TechLiving — Protótipo de alta fidelidade" },
      { property: "og:description", content: "As 8 telas do app de casa inteligente TechLiving, navegáveis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  ["Baixar o aplicativo", "Na Google Play Store (Android) ou App Store (iPhone), procure TechLiving e instale."],
  ["Criar uma conta", "Abra o app, toque em criar conta, preencha os dados e escolha o plano."],
  ["Ligar o Hub e conectar ao Wi-Fi", "Ligue o Hub TechLiving e siga as orientações do app."],
  ["Adicionar os aparelhos", "Em Adicionar dispositivo, selecione o aparelho e escolha o cômodo."],
];
const EXTERNAL = [
  ["Alexa / Google Home", "Conectar aparelhos dessas marcas"],
  ["Serviço de SMS ou e-mail", "Enviar o código de 2 fatores"],
  ["Loja de apps (Play Store / App Store)", "Instalar o app"],
  ["Pagamento online", "Cobrar os planos"],
];

function Index() {
  const ctl = useTechLiving();
  return (
    <main className="mx-auto grid min-h-screen max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1fr_400px]">
      <section className="space-y-8">
        <header>
          <p className="text-xs font-bold tracking-[0.25em] text-primary">PROJETO TECHLIVING</p>
          <h1 className="mt-2 text-4xl font-bold">Protótipo de alta fidelidade</h1>
          <p className="mt-2 max-w-lg text-muted-foreground">As 8 telas do aplicativo, navegáveis. Use o celular ao lado ou escolha uma tela abaixo.</p>
          <Link to="/slides" search={{ slide: 1 }} className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Ver apresentação em slides →</Link>
        </header>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Telas</h2>
          <div className="flex flex-wrap gap-2">
            {SCREENS.map((s) => (
              <button key={s.id} onClick={() => {
                if (s.id !== "login" && s.id !== "signup") ctl.setAuthed(true);
                if (s.id === "offline") ctl.setWifi(false);
                ctl.setScreen(s.id);
              }} className={`rounded-full px-4 py-2 text-sm font-semibold ${ctl.screen === s.id ? "bg-primary text-primary-foreground" : "bg-card shadow-soft"}`}>{s.label}</button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="font-semibold">Ver como:</span>
            {(["Administrador", "Comum"] as const).map((r) => (
              <button key={r} onClick={() => ctl.setRole(r)} className={`rounded-full px-3 py-1 font-semibold ${ctl.role === r ? "bg-accent text-accent-foreground" : "bg-muted"}`}>{r}</button>
            ))}
            <button onClick={() => ctl.setWifi(!ctl.wifi)} className="rounded-full bg-muted px-3 py-1 font-semibold">Wi-Fi: {ctl.wifi ? "ligado" : "desligado"}</button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Código de 2 fatores para teste: 123456</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-card p-5 shadow-soft">
            <h2 className="mb-3 text-lg font-semibold">Pré-requisitos</h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Celular Android ou iPhone</li><li>• Wi-Fi</li><li>• Hub TechLiving</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-soft">
            <h2 className="mb-3 text-lg font-semibold">Passos de Instalação</h2>
            <ol className="space-y-2 text-sm">
              {STEPS.map(([t, d], i) => (
                <li key={t} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                  <span><b>{t}</b><span className="block text-muted-foreground">{d}</span></span></li>
              ))}
            </ol>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-5 shadow-soft">
          <h2 className="mb-3 text-lg font-semibold">Sistemas E Componentes Externos Utilizados</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-muted-foreground"><th className="pb-2">Sistema</th><th className="pb-2">Para quê</th></tr></thead>
            <tbody>{EXTERNAL.map(([a, b]) => <tr key={a} className="border-t border-border"><td className="py-2 font-semibold">{a}</td><td className="py-2">{b}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <aside className="lg:sticky lg:top-10 lg:self-start"><Phone ctl={ctl} /></aside>
    </main>
  );
}
