{matches.map((m) => {
  const now = new Date();
  const chatEnded = new Date(m.chatUntil) < now;
  const decisionPhase = new Date(m.decideUntil) < now;

  return (
    <div
      key={m.id}
      className="bg-neutral-900 p-4 rounded-xl border border-neutral-800"
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="text-lg font-semibold">
            {m.matchUser.profile.name}
          </div>
          <div className="text-neutral-400 text-sm">
            Matchscore: {m.score}
          </div>
        </div>

        {!decisionPhase && (
          <Link
            href={`/chat/${m.id}`}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            Åpne chat
          </Link>
        )}
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-2 text-sm text-neutral-400">
        <div>Base: {m.breakdown.base}</div>
        <div>Deep: {m.breakdown.deep}</div>
        <div>Resonans: {m.breakdown.resonance}</div>
        <div>Semantikk: {m.breakdown.semantic}</div>
      </div>

      {/* Radar Chart */}
      <div className="mt-4">
        <RadarChart breakdown={m.breakdown} />
      </div>

      {/* Timers */}
      <div className="mt-3 text-xs text-neutral-500">
        Chat til: {new Date(m.chatUntil).toLocaleDateString()}
        <br />
        Beslutning til: {new Date(m.decideUntil).toLocaleDateString()}
      </div>

      {/* Decision phase */}
      {decisionPhase && (
        <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
          {!m.decision_userA ? (
            <div className="space-y-2">
              <div className="text-neutral-300">Vil du gå videre?</div>
              <button
                onClick={() => sendDecision(m.id, "yes")}
                className="bg-green-600 px-4 py-2 rounded-lg w-full"
              >
                Ja, jeg vil gå videre
              </button>
              <button
                onClick={() => sendDecision(m.id, "no")}
                className="bg-red-600 px-4 py-2 rounded-lg w-full"
              >
                Nei, det føles ikke riktig
              </button>
            </div>
          ) : (
            <div className="text-neutral-400">
              Du har valgt: {m.decision_userA === "yes" ? "JA" : "NEI"}
            </div>
          )}
        </div>
      )}

      {/* Reveal result */}
      {m.decision_userA && m.decision_userB && (
        <div className="mt-4 p-3 bg-neutral-900 rounded-lg border border-neutral-700">
          {m.decision_userA === "yes" && m.decision_userB === "yes" && (
            <div className="text-green-400">
              🎉 Dere valgte begge JA!  
              Kontaktinfo blir tilgjengelig her.
            </div>
          )}

          {m.decision_userA === "yes" && m.decision_userB === "no" && (
            <div className="text-neutral-400">
              Matchen din valgte NEI.  
              Det betyr ikke at noe er galt med deg.
            </div>
          )}

          {m.decision_userA === "no" && m.decision_userB === "yes" && (
            <div className="text-neutral-400">
              Du valgte NEI.  
              Matchen får en vennlig beskjed.
            </div>
          )}

          {m.decision_userA && m.decision_userB && (
  <div className="mt-4 p-4 bg-neutral-900 rounded-lg border border-neutral-700 space-y-3">

    {/* JA + JA */}
    {m.decision_userA === "yes" && m.decision_userB === "yes" && (
      <div className="space-y-3">
        <div className="text-green-400 text-lg font-semibold">
          🎉 Dere valgte begge JA!
        </div>

        <div className="text-neutral-300">
          Her er kontaktinformasjonen deres.  
          Ta kontakt når det føles riktig.
        </div>

        <div className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 space-y-2">
          <div>
            <span className="text-neutral-400">Navn:</span>
            <span className="ml-2 text-white">{m.matchUser.profile.name}</span>
          </div>

          {m.matchUser.profile.email && (
            <div>
              <span className="text-neutral-400">E‑post:</span>
              <span className="ml-2 text-white">{m.matchUser.profile.email}</span>
            </div>
          )}

          {m.matchUser.profile.phone && (
            <div>
              <span className="text-neutral-400">Telefon:</span>
              <span className="ml-2 text-white">{m.matchUser.profile.phone}</span>
            </div>
          )}
        </div>
      </div>
    )}

    {/* JA + NEI */}
    {m.decision_userA === "yes" && m.decision_userB === "no" && (
      <div className="text-neutral-400">
        Matchen din valgte NEI.  
        Det betyr ikke at noe er galt med deg.
      </div>
    )}

    {/* NEI + JA */}
    {m.decision_userA === "no" && m.decision_userB === "yes" && (
      <div className="text-neutral-400">
        Du valgte NEI.  
        Matchen får en vennlig beskjed.
      </div>
    )}

    {/* NEI + NEI */}
    {m.decision_userA === "no" && m.decision_userB === "no" && (
      <div className="text-neutral-500">
        Dere valgte begge NEI.  
        Matchen avsluttes stille.
      </div>
    )}
  </div>
)}

        </div>
      )}
    </div> // ← riktig plassering
  );
})}
