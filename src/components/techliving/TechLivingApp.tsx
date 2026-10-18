import { useState, type ReactNode } from "react";
import {
  Home, Repeat, User, Lightbulb, Blinds, AirVent, Plus, Search, Battery, Power,
  WifiOff, Wifi, ShieldCheck, ChevronLeft, Clock, Lock, Crown, KeyRound,
} from "lucide-react";

export type Screen = "login" | "signup" | "home" | "add" | "control" | "routines" | "profiles" | "offline";
type Kind = "luz" | "persiana" | "ar";
type Device = { id: number; name: string; kind: Kind; room: string; on: boolean; level: number; battery: number };
type Role = "Administrador" | "Comum";

const KIND: Record<Kind, { label: string; icon: typeof Lightbulb; unit: string; adjust: string; min: number; max: number }> = {
  luz: { label: "Lâmpada inteligente", icon: Lightbulb, unit: "%", adjust: "Brilho", min: 0, max: 100 },
  persiana: { label: "Persiana inteligente", icon: Blinds, unit: "%", adjust: "Abertura", min: 0, max: 100 },
  ar: { label: "Ar-condicionado", icon: AirVent, unit: "°C", adjust: "Temperatura", min: 16, max: 30 },
};
const ROOMS = ["Sala", "Quarto", "Cozinha"];
const DEMO_CODE = "123456";

export const SCREENS: { id: Screen; label: string }[] = [
  { id: "login", label: "1. Login" }, { id: "signup", label: "2. Criar conta + plano" },
  { id: "home", label: "3. Início" }, { id: "add", label: "4. Adicionar dispositivo" },
  { id: "control", label: "5. Controle" }, { id: "routines", label: "6. Rotinas" },
  { id: "profiles", label: "7. Perfis" }, { id: "offline", label: "8. Sem Wi-Fi" },
];

export function useTechLiving() {
  const [screen, setScreen] = useState<Screen>("login");
  const [authed, setAuthed] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [role, setRole] = useState<Role>("Administrador");
  return { screen, setScreen, authed, setAuthed, wifi, setWifi, role, setRole };
}
type Ctl = ReturnType<typeof useTechLiving>;

export function Phone({ ctl }: { ctl: Ctl }) {
  const { screen, setScreen, authed, setAuthed, wifi, setWifi, role } = ctl;
  const [devices, setDevices] = useState<Device[]>([
    { id: 1, name: "Luz", kind: "luz", room: "Sala", on: true, level: 80, battery: 90 },
    { id: 2, name: "Persiana", kind: "persiana", room: "Sala", on: true, level: 50, battery: 65 },
    { id: 3, name: "Ar", kind: "ar", room: "Quarto", on: true, level: 23, battery: 90 },
  ]);
  const [selected, setSelected] = useState(1);
  const [routines, setRoutines] = useState([
    { name: "Bom dia", time: "07:00" }, { name: "Sair de casa", time: "08:30" }, { name: "Boa noite", time: "22:00" },
  ]);
  const [profiles, setProfiles] = useState<{ name: string; role: Role }[]>([
    { name: "Felipe", role: "Administrador" }, { name: "Usuário 2", role: "Comum" },
  ]);
  const isAdmin = role === "Administrador";
  const update = (id: number, p: Partial<Device>) => setDevices((d) => d.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const go = (s: Screen) => {
    if (!authed && s !== "login" && s !== "signup") return setScreen("login");
    if (!wifi && s === "add") return setScreen("offline");
    setScreen(s);
  };

  let body: ReactNode;
  switch (screen) {
    case "login": body = <Login onOk={() => { setAuthed(true); setScreen(wifi ? "home" : "offline"); }} onSignup={() => setScreen("signup")} />; break;
    case "signup": body = <Signup onDone={() => { setAuthed(true); setScreen("home"); }} onBack={() => setScreen("login")} />; break;
    case "home": body = (
      <HomeScreen devices={devices} wifi={wifi} isAdmin={isAdmin}
        open={(id) => { setSelected(id); go("control"); }} add={() => go("add")} routines={() => go("routines")} />); break;
    case "add": body = (
      <AddScreen isAdmin={isAdmin} onAdd={(kind, room) => {
        const id = Date.now();
        setDevices((d) => [...d, { id, name: KIND[kind].label.split(" ")[0] ?? KIND[kind].label, kind, room, on: false, level: kind === "ar" ? 22 : 50, battery: 100 }]);
        setScreen("home");
      }} back={() => setScreen("home")} />); break;
    case "control": {
      const d = devices.find((x) => x.id === selected) ?? devices[0];
      if (!d) { body = null; break; }
      body = <ControlScreen d={d} update={(p) => update(d.id, p)} back={() => setScreen("home")} wifi={wifi} />; break;
    }
    case "routines": body = (
      <RoutinesScreen routines={routines} devices={devices} isAdmin={isAdmin} wifi={wifi}
        onCreate={(r) => setRoutines((x) => [...x, r].sort((a, b) => a.time.localeCompare(b.time)))} />); break;
    case "profiles": body = (
      <ProfilesScreen profiles={profiles} isAdmin={isAdmin}
        onAdd={(p) => setProfiles((x) => [...x, p])}
        onLogout={() => { setAuthed(false); setScreen("login"); }} />); break;
    case "offline": body = <OfflineScreen retry={() => setWifi(true)} wifi={wifi} home={() => go("home")} />; break;
  }

  return (
    <div className="relative mx-auto h-[780px] w-[380px] rounded-[3rem] bg-device p-3 shadow-phone">
      <div className="flex h-full flex-col overflow-hidden rounded-[2.4rem] bg-background">
        <div className="flex items-center justify-between px-7 pt-3 pb-1 text-xs font-semibold text-foreground">
          <span>9:41</span>
          <button onClick={() => setWifi(!wifi)} aria-label="Alternar Wi-Fi" className="flex items-center gap-1">
            {wifi ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5 text-destructive" />}
          </button>
        </div>
        {!wifi && screen !== "offline" && authed && (
          <button onClick={() => setScreen("offline")} className="mx-4 mt-1 flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground">
            <WifiOff className="size-3.5" /> Modo limitado ativo — toque para detalhes
          </button>
        )}
        <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4">{body}</div>
        <nav className="grid grid-cols-3 border-t border-border bg-card px-4 pt-2 pb-5">
          {([["home", "Início", Home], ["routines", "Rotinas", Repeat], ["profiles", "Perfil", User]] as const).map(([s, l, I]) => (
            <button key={s} onClick={() => go(s)} disabled={!authed}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold disabled:opacity-40 ${screen === s ? "text-primary" : "text-muted-foreground"}`}>
              <I className="size-5" />{l}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ---------- primitives ---------- */
const Title = ({ children, back }: { children: ReactNode; back?: () => void }) => (
  <div className="mb-4 flex items-center gap-2">
    {back && <button onClick={back} aria-label="Voltar" className="rounded-full bg-muted p-1.5"><ChevronLeft className="size-4" /></button>}
    <h2 className="text-xl font-semibold">{children}</h2>
  </div>
);
const Field = (p: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="mb-3 block">
    <span className="mb-1 block text-xs font-semibold text-muted-foreground">{p.label}</span>
    <input {...p} className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
  </label>
);
const Btn = ({ children, variant = "primary", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "accent" }) => (
  <button {...p} className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-40 ${
    variant === "primary" ? "bg-primary text-primary-foreground hover:opacity-90" : variant === "accent" ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"}`}>{children}</button>
);
const Card = ({ children, onClick, className = "" }: { children: ReactNode; onClick?: () => void; className?: string }) => (
  <div onClick={onClick} className={`rounded-2xl bg-card p-3.5 shadow-soft ${onClick ? "cursor-pointer hover:ring-2 hover:ring-ring/40" : ""} ${className}`}>{children}</div>
);
const Locked = ({ text }: { text: string }) => (
  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3" />{text}</p>
);

/* ---------- 1. Login ---------- */
function Login({ onOk, onSignup }: { onOk: () => void; onSignup: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(""); const [pass, setPass] = useState(""); const [code, setCode] = useState("");
  const [err, setErr] = useState(""); const [forgot, setForgot] = useState(false);
  return (
    <div className="pt-6">
      <div className="mb-8 flex items-center gap-2">
        <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Home className="size-5" /></div>
        <h1 className="text-2xl font-bold">TechLiving</h1>
      </div>
      {step === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); if (!email.includes("@") || pass.length < 4) return setErr("Informe e-mail e senha válidos."); setErr(""); setStep(2); }}>
          <Field label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
          <Field label="Senha" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••" />
          {err && <p className="mb-2 text-xs text-destructive">{err}</p>}
          <Btn type="submit">Continuar</Btn>
        </form>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (code !== DEMO_CODE) return setErr("Código incorreto."); onOk(); }}>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-4 text-primary" />Código de 2 fatores</div>
          <p className="mb-3 text-xs text-muted-foreground">Enviamos um código por SMS ou e-mail para {email}. <span className="font-semibold">(Demonstração: {DEMO_CODE})</span></p>
          <Field label="Código de verificação" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" />
          {err && <p className="mb-2 text-xs text-destructive">{err}</p>}
          <Btn type="submit">Entrar</Btn>
        </form>
      )}
      <button onClick={() => setForgot(true)} className="mt-4 w-full text-center text-xs font-semibold text-primary">Esqueci minha senha</button>
      {forgot && <p className="mt-2 text-center text-xs text-muted-foreground">Enviaremos um link de redefinição para o seu e-mail.</p>}
      <div className="mt-8 text-center text-sm text-muted-foreground">Não tem conta? <button onClick={onSignup} className="font-semibold text-primary">Criar conta</button></div>
    </div>
  );
}

/* ---------- 2. Signup + plano ---------- */
function Signup({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [plan, setPlan] = useState("trial");
  const [f, setF] = useState({ name: "", email: "", pass: "" });
  const ok = f.name && f.email.includes("@") && f.pass.length >= 4;
  const plans: [string, string, string][] = [["mensal", "Mensal", "Cobrança todo mês"], ["anual", "Anual", "Cobrança uma vez por ano"], ["trial", "15 dias grátis", "Experimente antes de assinar"]];
  return (
    <div>
      <Title back={onBack}>Criar sua conta</Title>
      <Field label="Nome completo" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <Field label="E-mail" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <Field label="Senha" type="password" value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} />
      <p className="mb-2 mt-1 text-xs font-semibold text-muted-foreground">Escolha um plano</p>
      <div className="mb-4 space-y-2">
        {plans.map(([id, l, d]) => (
          <button key={id} onClick={() => setPlan(id)} className={`flex w-full items-center justify-between rounded-xl border-2 px-3.5 py-2.5 text-left ${plan === id ? "border-primary bg-card" : "border-border"}`}>
            <span><span className="block text-sm font-semibold">{l}</span><span className="text-xs text-muted-foreground">{d}</span></span>
            <span className={`size-4 rounded-full border-2 ${plan === id ? "border-primary bg-primary" : "border-border"}`} />
          </button>
        ))}
      </div>
      <Btn disabled={!ok} onClick={onDone}>Criar conta</Btn>
    </div>
  );
}

/* ---------- 3. Início ---------- */
function status(d: Device) {
  if (!d.on) return "Desligado";
  return d.kind === "ar" ? `${d.level} °C` : d.kind === "luz" ? `Ligada · ${d.level}%` : `${d.level}%`;
}
function HomeScreen({ devices, open, add, routines, isAdmin, wifi }: { devices: Device[]; open: (id: number) => void; add: () => void; routines: () => void; isAdmin: boolean; wifi: boolean }) {
  const rooms = [...new Set(devices.map((d) => d.room))];
  return (
    <div>
      <p className="text-sm text-muted-foreground">Olá!</p>
      <h2 className="mb-4 text-2xl font-semibold">Sua casa</h2>
      <p className="mb-2 text-xs font-bold tracking-widest text-muted-foreground">CÔMODOS</p>
      {rooms.map((r) => (
        <div key={r} className="mb-4">
          <p className="mb-2 text-sm font-semibold">{r}</p>
          <div className="space-y-2">
            {devices.filter((d) => d.room === r).map((d) => {
              const I = KIND[d.kind].icon;
              return (
                <Card key={d.id} onClick={() => open(d.id)} className="flex items-center gap-3">
                  <div className={`grid size-10 place-items-center rounded-xl ${d.on ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}><I className="size-5" /></div>
                  <div className="flex-1"><p className="text-sm font-semibold">{d.name}</p><p className="text-xs text-muted-foreground">{status(d)}</p></div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Battery className="size-3.5" />{d.battery}%</span>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      <div className="space-y-2">
        <Btn onClick={add} disabled={!isAdmin || !wifi}><Plus className="size-4" />Adicionar dispositivo</Btn>
        {!isAdmin && <Locked text="Somente o Administrador adiciona dispositivos." />}
        {isAdmin && !wifi && <Locked text="Indisponível no modo limitado." />}
        <Btn variant="ghost" onClick={routines}>Ver rotinas</Btn>
      </div>
    </div>
  );
}

/* ---------- 4. Adicionar ---------- */
function AddScreen({ onAdd, back, isAdmin }: { onAdd: (k: Kind, room: string) => void; back: () => void; isAdmin: boolean }) {
  const [q, setQ] = useState(""); const [kind, setKind] = useState<Kind | null>(null); const [room, setRoom] = useState("Sala");
  if (!isAdmin) return <div><Title back={back}>Adicionar dispositivo</Title><Locked text="Somente o Administrador gerencia a casa." /></div>;
  const found = (Object.keys(KIND) as Kind[]).filter((k) => KIND[k].label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <Title back={back}>Adicionar dispositivo</Title>
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-input bg-card px-3">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar aparelho disponível" className="w-full bg-transparent py-2.5 text-sm outline-none" />
      </div>
      <div className="mb-4 space-y-2">
        {found.map((k) => { const I = KIND[k].icon; return (
          <Card key={k} onClick={() => setKind(k)} className={`flex items-center gap-3 ${kind === k ? "ring-2 ring-primary" : ""}`}>
            <I className="size-5 text-primary" /><span className="text-sm font-semibold">{KIND[k].label}</span>
          </Card>); })}
        {!found.length && <p className="text-xs text-muted-foreground">Nenhum aparelho encontrado.</p>}
      </div>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">Escolha o cômodo</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {ROOMS.map((r) => (
          <button key={r} onClick={() => setRoom(r)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${room === r ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{r}</button>
        ))}
      </div>
      <Btn disabled={!kind} onClick={() => kind && onAdd(kind, room)}>Adicionar</Btn>
    </div>
  );
}

/* ---------- 5. Controle ---------- */
function ControlScreen({ d, update, back }: { d: Device; update: (p: Partial<Device>) => void; back: () => void; wifi: boolean }) {
  const k = KIND[d.kind]; const I = k.icon;
  return (
    <div>
      <Title back={back}>Controle do dispositivo</Title>
      <Card className="mb-3 flex flex-col items-center py-6">
        <div className={`mb-3 grid size-20 place-items-center rounded-3xl ${d.on ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}><I className="size-9" /></div>
        <p className="font-semibold">{d.name} — {d.room}</p>
        <p className="text-sm text-muted-foreground">Estado: {d.on ? "Ligado" : "Desligado"}</p>
      </Card>
      <Card className="mb-3">
        <div className="mb-2 flex justify-between text-sm font-semibold"><span>Ajustar intensidade · {k.adjust}</span><span>{d.level}{k.unit}</span></div>
        <input type="range" min={k.min} max={k.max} value={d.level} disabled={!d.on} onChange={(e) => update({ level: +e.target.value })} className="w-full accent-[var(--primary)]" />
      </Card>
      <Card className="mb-4 flex items-center justify-between text-sm font-semibold">
        <span className="flex items-center gap-2"><Battery className="size-4 text-success" />Bateria</span><span>{d.battery}%</span>
      </Card>
      <Btn variant={d.on ? "ghost" : "primary"} onClick={() => update({ on: !d.on })}><Power className="size-4" />{d.on ? "Desligar" : "Ligar"}</Btn>
    </div>
  );
}

/* ---------- 6. Rotinas ---------- */
function RoutinesScreen({ routines, devices, onCreate, isAdmin, wifi }: { routines: { name: string; time: string }[]; devices: Device[]; onCreate: (r: { name: string; time: string }) => void; isAdmin: boolean; wifi: boolean }) {
  const [open, setOpen] = useState(false); const [name, setName] = useState(""); const [time, setTime] = useState("19:00"); const [sel, setSel] = useState<number[]>([]);
  return (
    <div>
      <Title>Rotinas da casa</Title>
      <div className="mb-4 space-y-2">
        {routines.map((r, i) => (
          <Card key={i} className="flex items-center gap-3"><Clock className="size-4 text-primary" /><span className="flex-1 text-sm font-semibold">{r.name}</span><span className="text-sm text-muted-foreground">{r.time}</span></Card>
        ))}
      </div>
      {!open ? (
        <>
          <Btn onClick={() => setOpen(true)} disabled={!isAdmin || !wifi}><Plus className="size-4" />Criar rotina</Btn>
          {!isAdmin && <Locked text="Somente o Administrador cria rotinas." />}
          {isAdmin && !wifi && <Locked text="Indisponível no modo limitado." />}
        </>
      ) : (
        <Card>
          <Field label="Nome da rotina" value={name} onChange={(e) => setName(e.target.value)} />
          <Field label="Horário" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Selecionar dispositivos e horários</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {devices.map((d) => (
              <button key={d.id} onClick={() => setSel((s) => s.includes(d.id) ? s.filter((x) => x !== d.id) : [...s, d.id])}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${sel.includes(d.id) ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{d.name} · {d.room}</button>
            ))}
          </div>
          <Btn disabled={!name || !sel.length} onClick={() => { onCreate({ name, time }); setOpen(false); setName(""); setSel([]); }}>Salvar rotina</Btn>
        </Card>
      )}
    </div>
  );
}

/* ---------- 7. Perfis ---------- */
function ProfilesScreen({ profiles, onAdd, isAdmin, onLogout }: { profiles: { name: string; role: Role }[]; onAdd: (p: { name: string; role: Role }) => void; isAdmin: boolean; onLogout: () => void }) {
  const [name, setName] = useState(""); const [role, setRole] = useState<Role>("Comum"); const [open, setOpen] = useState(false);
  return (
    <div>
      <Title>Perfis e permissões</Title>
      <div className="mb-4 space-y-2">
        {profiles.map((p, i) => (
          <Card key={i} className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-secondary font-semibold">{p.name[0]}</div>
            <span className="flex-1 text-sm font-semibold">{p.name}</span>
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${p.role === "Administrador" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
              {p.role === "Administrador" ? <Crown className="size-3" /> : <KeyRound className="size-3" />}{p.role}
            </span>
          </Card>
        ))}
      </div>
      <Card className="mb-4 text-sm">
        <p className="mb-1 font-semibold">Permissões</p>
        <p className="text-muted-foreground">• Administrador: gerencia a casa</p>
        <p className="text-muted-foreground">• Comum: controla aparelhos</p>
      </Card>
      {open ? (
        <Card className="mb-3">
          <Field label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="mb-3 flex gap-2">{(["Administrador", "Comum"] as Role[]).map((r) => (
            <button key={r} onClick={() => setRole(r)} className={`flex-1 rounded-xl py-2 text-xs font-semibold ${role === r ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{r}</button>))}</div>
          <Btn disabled={!name} onClick={() => { onAdd({ name, role }); setName(""); setOpen(false); }}>Salvar perfil</Btn>
        </Card>
      ) : (
        <>
          <Btn onClick={() => setOpen(true)} disabled={!isAdmin}><Plus className="size-4" />Adicionar perfil</Btn>
          {!isAdmin && <Locked text="Somente o Administrador adiciona perfis." />}
        </>
      )}
      <button onClick={onLogout} className="mt-4 w-full text-center text-xs font-semibold text-destructive">Sair da conta</button>
    </div>
  );
}

/* ---------- 8. Sem Wi-Fi ---------- */
function OfflineScreen({ retry, wifi, home }: { retry: () => void; wifi: boolean; home: () => void }) {
  return (
    <div className="flex flex-col items-center pt-8 text-center">
      <h2 className="mb-6 text-xl font-semibold">{wifi ? "Conexão restabelecida" : "Conexão indisponível"}</h2>
      <div className={`mb-5 grid size-24 place-items-center rounded-full ${wifi ? "bg-success/20 text-success" : "bg-destructive/15 text-destructive"}`}>
        {wifi ? <Wifi className="size-10" /> : <span className="font-display text-5xl font-bold">!</span>}
      </div>
      {wifi ? (
        <><p className="mb-6 text-sm text-muted-foreground">Todas as funções estão disponíveis.</p><Btn onClick={home}>Ir para o Início</Btn></>
      ) : (
        <>
          <p className="text-sm font-semibold">O Wi-Fi está desconectado.</p>
          <p className="mb-5 text-sm text-muted-foreground">Algumas funções podem não funcionar.</p>
          <span className="mb-6 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground">Modo limitado ativo</span>
          <Btn onClick={retry}>Tentar novamente</Btn>
          <p className="mt-4 text-xs text-muted-foreground">Confira o roteador e o Hub</p>
        </>
      )}
    </div>
  );
}
