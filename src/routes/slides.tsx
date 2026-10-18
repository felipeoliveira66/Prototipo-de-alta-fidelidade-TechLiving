import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Smartphone, Wifi, Cpu, Download, UserPlus, Plug, PlusCircle, ChevronLeft, ChevronRight, Maximize, Printer, Grid3x3 } from "lucide-react";
import { Phone, useTechLiving, type Screen } from "@/components/techliving/TechLivingApp";

export const Route = createFileRoute("/slides")({
  validateSearch: (s: Record<string, unknown>) => ({
    slide: Math.max(1, Number(s.slide) || 1),
    print: s.print !== undefined && s.print !== false ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "TechLiving — Apresentação do protótipo" },
      { name: "description", content: "Slides do protótipo TechLiving: 8 telas, pré-requisitos, instalação e sistemas externos." },
      { property: "og:title", content: "TechLiving — Apresentação do protótipo" },
      { property: "og:description", content: "Slides do protótipo e da instalação do app TechLiving." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SlidesPage,
});

/* ---------- layout ---------- */
function SlideLayout({ children, dark, n }: { children: ReactNode; dark?: boolean; n: number }) {
  return (
    <div className={`slide-content ${dark ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}>
      <div className="absolute inset-0 px-[120px] pt-[100px] pb-[110px]">{children}</div>
      <div className={`absolute bottom-[44px] left-[120px] right-[120px] flex justify-between slide-chrome ${dark ? "opacity-70" : "text-muted-foreground"}`}>
        <span className="font-semibold">TechLiving · Protótipo do app — Felipe e Rogério</span>
        <span>{n} / {SLIDES.length}</span>
      </div>
    </div>
  );
}

function PhoneSlide({ screen, num, title, points, n }: { screen: Screen; num: number; title: string; points: string[]; n: number }) {
  const ctl = useTechLiving(screen);
  return (
    <SlideLayout n={n}>
      <div className="grid h-full grid-cols-[1fr_460px] items-center gap-24">
        <div>
          <p className="slide-kicker text-primary">Tela {num} de 8</p>
          <h2 className="slide-title mt-6">{title}</h2>
          <ul className="mt-12 space-y-6">
            {points.map((p) => (
              <li key={p} className="slide-body flex gap-5"><span className="mt-3 size-4 shrink-0 rounded-full bg-accent" />{p}</li>
            ))}
          </ul>
        </div>
        <div className="origin-center scale-[1.08]"><Phone ctl={ctl} /></div>
      </div>
    </SlideLayout>
  );
}

const SCREEN_SLIDES: { screen: Screen; title: string; points: string[] }[] = [
  { screen: "login", title: "Login", points: ["E-mail e senha", "Código de 2 fatores enviado por SMS ou e-mail", "Opção \"Esqueci minha senha\""] },
  { screen: "signup", title: "Criar conta + plano", points: ["Nome completo, e-mail e senha", "Plano mensal, anual ou 15 dias grátis"] },
  { screen: "home", title: "Início", points: ["Cômodos e seus aparelhos", "Estado e bateria de cada aparelho", "Atalhos para adicionar dispositivo e ver rotinas"] },
  { screen: "add", title: "Adicionar dispositivo", points: ["Buscar aparelho disponível", "Escolher o cômodo", "Exclusivo do Administrador"] },
  { screen: "control", title: "Controle", points: ["Liga / desliga", "Ajuste de intensidade", "Nível de bateria"] },
  { screen: "routines", title: "Rotinas", points: ["Lista de rotinas com horário", "Criar rotina: dispositivos e horários"] },
  { screen: "profiles", title: "Perfis", points: ["Administrador: gerencia a casa", "Comum: controla aparelhos", "Adicionar novos perfis"] },
  { screen: "offline", title: "Sem Wi-Fi", points: ["Aviso \"Modo limitado ativo\"", "Botão \"Tentar novamente\"", "Orienta conferir o roteador e o Hub"] },
];

type SlideDef = { title: string; render: (n: number) => ReactNode };
const SLIDES: SlideDef[] = [
  { title: "Capa", render: (n) => (
    <SlideLayout dark n={n}>
      <div className="flex h-full flex-col justify-center">
        <p className="slide-kicker opacity-80">Projeto TechLiving · Especificação Técnica</p>
        <h1 className="slide-title-lg mt-8">TechLiving</h1>
        <p className="slide-subtitle mt-8 max-w-[1200px] opacity-90">Protótipo do app, instalação e sistemas externos</p>
        <p className="slide-body mt-16 opacity-70">Felipe e Rogério</p>
      </div>
    </SlideLayout>) },
  { title: "As 8 telas", render: (n) => (
    <SlideLayout n={n}>
      <p className="slide-kicker text-primary">Protótipo baixa e alta fidelidade</p>
      <h2 className="slide-title mt-6">As 8 telas do app</h2>
      <div className="mt-16 grid grid-cols-4 gap-8">
        {SCREEN_SLIDES.map((s, i) => (
          <div key={s.screen} className="rounded-3xl bg-card p-8 shadow-soft">
            <span className="slide-subtitle text-accent">{i + 1}</span>
            <p className="slide-body mt-3 font-semibold">{s.title}</p>
          </div>
        ))}
      </div>
    </SlideLayout>) },
  ...SCREEN_SLIDES.map((s, i): SlideDef => ({ title: s.title, render: (n) => <PhoneSlide key={s.screen} {...s} num={i + 1} n={n} /> })),
  { title: "Pré-requisitos", render: (n) => (
    <SlideLayout n={n}>
      <p className="slide-kicker text-primary">Instalação e Configuração</p>
      <h2 className="slide-title mt-6">Pré-requisitos</h2>
      <div className="mt-20 grid grid-cols-3 gap-10">
        {([[Smartphone, "Celular", "Android ou iPhone"], [Wifi, "Wi-Fi", "Rede sem fio para a configuração"], [Cpu, "Hub TechLiving", "Conecta os aparelhos compatíveis"]] as const).map(([I, t, d]) => (
          <div key={t} className="rounded-3xl bg-card p-12 shadow-soft">
            <div className="grid size-24 place-items-center rounded-full bg-accent text-accent-foreground"><I className="size-12" /></div>
            <p className="slide-subtitle mt-10">{t}</p>
            <p className="slide-body mt-4 text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </SlideLayout>) },
  { title: "Passos de Instalação", render: (n) => (
    <SlideLayout n={n}>
      <p className="slide-kicker text-primary">Instalação e Configuração</p>
      <h2 className="slide-title mt-6">Passos de Instalação</h2>
      <div className="mt-20 grid grid-cols-4 gap-8">
        {([[Download, "Baixar o app", "Play Store ou App Store"], [UserPlus, "Criar conta", "Preencher dados e escolher o plano"], [Plug, "Ligar o Hub", "E conectar ao Wi-Fi"], [PlusCircle, "Adicionar aparelhos", "Escolher aparelho e cômodo"]] as const).map(([I, t, d], i) => (
          <div key={t} className="relative rounded-3xl bg-card p-10 shadow-soft">
            <span className="slide-title text-primary">{i + 1}</span>
            <I className="mt-6 size-12 text-accent" />
            <p className="slide-body mt-6 font-semibold">{t}</p>
            <p className="slide-caption mt-3 text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </SlideLayout>) },
  { title: "Sistemas externos", render: (n) => (
    <SlideLayout n={n}>
      <p className="slide-kicker text-primary">Especificação Técnica</p>
      <h2 className="slide-title mt-6">Sistemas E Componentes Externos Utilizados</h2>
      <div className="mt-16 overflow-hidden rounded-3xl bg-card shadow-soft">
        <div className="slide-caption grid grid-cols-2 bg-secondary px-12 py-6 font-bold"><span>Sistema</span><span>Para quê</span></div>
        {[["Alexa / Google Home", "Conectar aparelhos dessas marcas"], ["Serviço de SMS ou e-mail", "Enviar o código de 2 fatores"], ["Play Store / App Store", "Instalar o app"], ["Pagamento online", "Cobrar os planos"]].map(([a, b]) => (
          <div key={a} className="slide-body grid grid-cols-2 border-t border-border px-12 py-7"><span className="font-semibold">{a}</span><span>{b}</span></div>
        ))}
      </div>
    </SlideLayout>) },
  { title: "Encerramento", render: (n) => (
    <SlideLayout dark n={n}>
      <div className="flex h-full flex-col justify-center">
        <h2 className="slide-title-lg">Obrigado!</h2>
        <p className="slide-subtitle mt-10 opacity-90">Protótipo navegável disponível no app TechLiving</p>
      </div>
    </SlideLayout>) },
];

/* ---------- scaling ---------- */
function Scaled({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(el.clientWidth / 1920, el.clientHeight / 1080)));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-[1080px] w-[1920px]" style={{ marginLeft: -960, marginTop: -540, transform: `scale(${scale})` }}>{children}</div>
    </div>
  );
}

function SlidesPage() {
  const { slide, print } = Route.useSearch();
  const navigate = useNavigate({ from: "/slides" });
  const idx = Math.min(slide, SLIDES.length) - 1;
  const [grid, setGrid] = useState(false);
  const [full, setFull] = useState(false);
  const touch = useRef(0);
  const go = (i: number) => navigate({ search: { slide: Math.max(1, Math.min(SLIDES.length, i + 1)) }, replace: true });

  useEffect(() => { document.title = `${idx + 1}/${SLIDES.length} — ${SLIDES[idx]?.title}`; }, [idx]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) go(idx + 1);
      else if (["ArrowLeft", "PageUp"].includes(e.key)) go(idx - 1);
      else if (e.key === "g") setGrid((g) => !g);
      else if (e.key === "F5") { e.preventDefault(); document.documentElement.requestFullscreen(); }
    };
    const fs = () => setFull(!!document.fullscreenElement);
    window.addEventListener("keydown", k); document.addEventListener("fullscreenchange", fs);
    return () => { window.removeEventListener("keydown", k); document.removeEventListener("fullscreenchange", fs); };
  });

  if (print) return <div>{SLIDES.map((s, i) => <div key={i} className="print-slide">{s.render(i + 1)}</div>)}</div>;

  const current = SLIDES[idx]!;
  const swipe = {
    onTouchStart: (e: React.TouchEvent) => { touch.current = e.touches[0]?.clientX ?? 0; },
    onTouchEnd: (e: React.TouchEvent) => { const dx = (e.changedTouches[0]?.clientX ?? 0) - touch.current; if (Math.abs(dx) > 50) go(dx < 0 ? idx + 1 : idx - 1); },
  };

  if (full) return <div className="h-screen w-screen bg-device" {...swipe}><Scaled>{current.render(idx + 1)}</Scaled></div>;

  return (
    <div className="flex h-screen flex-col bg-secondary">
      <header className="flex items-center gap-3 border-b border-border bg-card px-5 py-3">
        <Link to="/" className="text-sm font-semibold text-primary">← Protótipo</Link>
        <span className="flex-1 truncate font-semibold">TechLiving — Apresentação</span>
        <button onClick={() => setGrid(!grid)} className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-semibold"><Grid3x3 className="size-4" />Grade</button>
        <a href="/slides?print=true" target="_blank" className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-semibold"><Printer className="size-4" />PDF</a>
        <button onClick={() => document.documentElement.requestFullscreen()} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"><Maximize className="size-4" />Apresentar</button>
      </header>
      {grid ? (
        <div className="grid flex-1 grid-cols-2 gap-6 overflow-y-auto p-8 md:grid-cols-3 lg:grid-cols-4">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => { go(i); setGrid(false); }} className={`text-left ${i === idx ? "ring-4 ring-primary" : ""} rounded-lg`}>
              <div className="aspect-video overflow-hidden rounded-lg shadow-soft"><Scaled>{s.render(i + 1)}</Scaled></div>
              <p className="mt-2 text-sm font-semibold">{i + 1}. {s.title}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden w-56 shrink-0 space-y-3 overflow-y-auto border-r border-border bg-card p-3 md:block">
            {SLIDES.map((s, i) => (
              <button key={i} onClick={() => go(i)} className={`block w-full rounded-md ${i === idx ? "ring-2 ring-primary" : "opacity-80"}`}>
                <div className="aspect-video overflow-hidden rounded-md"><Scaled>{s.render(i + 1)}</Scaled></div>
              </button>
            ))}
          </aside>
          <main className="relative flex-1 p-6" {...swipe}>
            <div className="h-full overflow-hidden rounded-xl shadow-phone"><Scaled>{current.render(idx + 1)}</Scaled></div>
            <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-card px-3 py-1.5 shadow-soft">
              <button onClick={() => go(idx - 1)} aria-label="Anterior"><ChevronLeft className="size-5" /></button>
              <span className="text-sm font-semibold">{idx + 1} / {SLIDES.length}</span>
              <button onClick={() => go(idx + 1)} aria-label="Próximo"><ChevronRight className="size-5" /></button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
