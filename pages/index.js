export default function Home() {
  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1 }
            50% { opacity: 0.5 }
          }
          
          .pulse {
            animation: pulse 2.5s ease-in-out infinite;
          }
        `}
      </style>

      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center gap-5">
          <span className="pulse text-xs text-blue-400 border border-blue-500/30 px-4 py-1 tracking-[2px]">
            EM CONSTRUÇÃO
          </span>

          <h1 className="font-mono text-4xl font-bold text-white">
            Fluxo <span className="text-blue-400">Logístico</span>
          </h1>

          <p className="text-sm text-zinc-400 font-light max-w-xs">
            Sistema de gestão operacional logística para programação, controle e
            acompanhamento de cargas
          </p>

          <div className="w-72">
            <div className="flex justify-between text-zinc-400 text-xs mb-2">
              <span>PROGRESSO</span>
              <span>20%</span>
            </div>

            <div className="w-full h-[6px] bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 w-1/5 rounded-full"></div>
            </div>
          </div>

          <div className="dot-blink flex items-center gap-2 text-xs text-zinc-500">
            <span className="pulse w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Desenvolvimento em andamento
          </div>
        </div>
      </main>
    </>
  );
}
