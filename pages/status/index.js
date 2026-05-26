import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = data.updated_at;
  }

  return (
    <p className="text-zinc-500 font-mono text-xs flex flex-col">
      Última atualização: <span className="text-zinc-300">{updatedAtText}</span>
    </p>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const database = data?.dependencies?.database;

  const usagePercent = parseFloat(
    ((database?.opened_connections / database?.max_connections) * 100).toFixed(
      2,
    ),
  );

  return (
    <div className="flex divide-x divide-zinc-700">
      <div className="min-w-[120px] px-4 py-3 flex flex-col items-center justify-center text-center">
        <span className="text-xs uppercase tracking-wide text-zinc-500 leading-none">
          Versão
        </span>

        {!isLoading ? (
          <span className="text-lg font-medium text-zinc-100 leading-none mt-2">
            {database?.version}
          </span>
        ) : (
          <div className="bg-zinc-800 animate-pulse h-6 w-16 rounded mt-2"></div>
        )}
      </div>
      <div className="min-w-[120px] px-4 py-3 flex flex-col items-center justify-center text-start">
        <span className="text-xs uppercase tracking-wide text-zinc-500 leading-none">
          Conexões
        </span>

        {!isLoading ? (
          <span className="text-lg font-medium text-zinc-100 leading-none mt-2">
            {database?.opened_connections} / {database?.max_connections}
          </span>
        ) : (
          <div className="bg-zinc-800 animate-pulse h-6 w-16 rounded mt-2"></div>
        )}
      </div>
      <div className="min-w-[240px] px-4 py-3 flex flex-col">
        {!isLoading ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wide text-zinc-500 leading-none">
                Uso
              </span>

              <span className="text-xs tracking-wide font-medium text-zinc-400">
                {usagePercent}%
              </span>
            </div>

            <div className="h-2 w-full bg-zinc-600 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </>
        ) : (
          <div className="bg-zinc-800 animate-pulse h-6 w-full rounded mt-2" />
        )}
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-black flex justify-center flex-col items-center">
      <h1 className="text-2xl uppercase text-blue-400 mb-3 font-mono tracking-[2px] text-right">
        Status
      </h1>

      <div className="flex items-stretch flex-col border border-zinc-700 rounded-lg bg-zinc-950 min-w-[500px]">
        <div className="flex items-center justify-between p-4 gap-4">
          <div>
            <p className="text-zinc-100 font-medium">Postgres</p>
            <p className="text-zinc-500 text-sm">Banco de Dados</p>
          </div>

          <UpdatedAt />
        </div>
        <div className="border-t border-zinc-700 w-full">
          <DatabaseStatus />
        </div>
      </div>
    </div>
  );
}
