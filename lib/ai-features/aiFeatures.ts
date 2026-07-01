/**
 * ToSom — AI-Powered Features (Opplevelses-lag)
 * 
 * AI som forsterkar opplevelsen — aldri erstatter menneskeleg kontakt.
 * 
 * Funksjonar:
 *   - samtaleforslag (context-aware)
 *   - refleksjonsgenerering (dagleg)
 *   - oppgåve-generering (tilpassa reise-fase)
 *   - resonance-insight (forklarar kvifor match fungerte)
 *   - profil-forbetting (AI-genererte forslag)
 *   - samtalehjælp (tone-matching, djupde-guiding)
 * 
 * Dokumentasjon: docs/FEATURE-AI-POWERED.md
 */

import 'server-only'

// ─── TYPE DEFINISJONAR ───────────────

export interface ConversationSuggestion {
  /** Forslagstekst */
  suggestion: string
  /** Type */
  type: SuggestionType
  /** Djupde (1-10) */
  depth: number
  /** Varmee */
  warmth: number
  /** Grunnlag */
  reasoning: string
}

export type SuggestionType =
  | 'open-ended'     // Opne spørsmål
  | 'reflection'     // Oppmuntring til refleksjon
  | 'shared-experience' // Delt oppleving
  | 'vulnerability'  // Sårbarheits-dypping
  | 'future-vision'  // Framtidsvisjon
  | 'values-exploration' // Verdiforsking
  | 'growth'         // Personleg vekst

export interface ReflectionPrompt {
  /** Spørsmål */
  question: string
  /** Tema */
  topic: ReflectionTopic
  /** Djupde */
  depth: number
  /** Varigheit (ms) */
  suggestedDuration: number
  /** Varmee */
  warmth: number
}

export type ReflectionTopic =
  | 'gratitude'      // Takksemd
  | 'growth'         // Vekst
  | 'connection'     // Kopling
  | 'fear'           // Frykt
  | 'hope'           // Håp
  | 'trust'          // Tillit
  | 'intimacy'       // Intimitet
  | 'purpose'        // Meining

export interface TaskGeneration {
  /** Oppgåvetekst */
  task: string
  /** Type */
  type: TaskType
  /** Vanskegrad */
  difficulty: number // 1-5
  /** Estimert tid (min) */
  estimatedTime: number
  /** Beskriving */
  description: string
}

export type TaskType =
  | 'letter'         // Skriv eit brev
  | 'question'       // Still eit spørsmål
  | 'shared-activity' // Felles aktivitet
  | 'reflection'     // Refleksjonsøving
  | 'vulnerability'  // Sårbarheits-oppgåve
  | 'appreciation'   // Verdsättning

export interface ResonanceInsight {
  /** Hovudforklaring */
  explanation: string
  /** Nøkkel-faktor */
  keyFactors: string[]
  /** Styrke-punkt */
  strengths: string[]
  /** Utviklingsområde */
  growthAreas: string[]
  /** Framtidsperspektiv */
  futureOutlook: string
}

export interface ProfileEnhancement {
  /** AI-genererte bio-forslag */
  bioSuggestions: BioVariant[]
  /** Interest-forslag */
  interestSuggestions: string[]
  /** Profil-forslag */
  profileTips: string[]
  /** Styrke-analyse */
  strengths: string[]
}

export interface BioVariant {
  tone: string
  text: string
  wordCount: number
}

export interface ConversationHelp {
  /** Tone-matching råd */
  toneAdvice: string
  /** Djupde-guiding */
  depthAdvice: string
  /** Emne-forslag */
  topicSuggestions: string[]
  /** Dødarar (kva ikkje seie) */
  avoidList: string[]
  /** Power phrases */
  powerPhrases: string[]
}

// ─── SAMTALEFORSKL ─────────────────

export function generateConversationSuggestion(
  context: {
    journeyPhase: string
    day: number
    lastTopic: string
    resonanceLevel: number
    userCommunicationStyle: string
  }
): ConversationSuggestion {
  const suggestions: Record<string, ConversationSuggestion[]> = {
    EARLY: [
      {
        suggestion: 'Kva er noko du aldri har fortald nokon om — men gjerne villedd?',
        type: 'vulnerability',
        depth: 6,
        warmth: 8,
        reasoning: 'Bygger sårbarheit tidleg i reisa',
      },
      {
        suggestion: 'Korleis ser du din eigen beste versjon av deg sjølv om 5 år?',
        type: 'future-vision',
        depth: 7,
        warmth: 7,
        reasoning: 'Opner for framtidasønsker tidleg',
      },
      {
        suggestion: 'Kva er det første du la merke til om meg?',
        type: 'open-ended',
        depth: 4,
        warmth: 9,
        reasoning: 'Lettkje oppning med personleg fokus',
      },
    ],
    BUILDING_TRUST: [
      {
        suggestion: 'Kva har overraska deg mest om deg sjølv denne reisa?',
        type: 'reflection',
        depth: 8,
        warmth: 8,
        reasoning: 'Dypper refleksjon i tillitsfasen',
      },
      {
        suggestion: 'Kva er noko du har lært om deg sjølv gjennom denne samtalen?',
        type: 'growth',
        depth: 7,
        warmth: 8,
        reasoning: 'Forsterkar vekst i tillitsfasen',
      },
    ],
    DEEPER: [
      {
        suggestion: 'Kva er noko du fryktar å miste i ein relasjon?',
        type: 'vulnerability',
        depth: 9,
        warmth: 7,
        reasoning: 'Djup sårbarheit i dypare fase',
      },
      {
        suggestion: 'Korleis har din oppvekst forma korleis du viser kjærlighet?',
        type: 'open-ended',
        depth: 9,
        warmth: 7,
        reasoning: 'Kopplar fortid til noverande',
      },
    ],
    CHECKIN: [
      {
        suggestion: 'Kva har denne reisa lært deg om kva du treng i ein relasjon?',
        type: 'reflection',
        depth: 8,
        warmth: 8,
        reasoning: 'Samantrekking og innsikt',
      },
      {
        suggestion: 'Kva vil du ta med deg ut ifrå reisa, og kva vil du endre?',
        type: 'growth',
        depth: 8,
        warmth: 8,
        reasoning: 'Refleksjon og framtidsperspektiv',
      },
    ],
  }

  const phaseSuggestions = suggestions[context.journeyPhase] || suggestions.EARLY
  return phaseSuggestions[Math.floor(Math.random() * phaseSuggestions.length)]
}

// ─── REFLEKSJONSGENERERING ───────

export function generateReflectionPrompt(
  journeyPhase: string,
  day: number,
  previousTopics: string[]
): ReflectionPrompt {
  const allTopics: ReflectionTopic[] = ['gratitude', 'growth', 'connection', 'trust', 'hope', 'intimacy', 'fear', 'purpose']
  
  // Vel eit tema som ikkje har vore brukt for nyleg
  const availableTopics = allTopics.filter(t => !previousTopics.includes(t))
  const topic = availableTopics.length > 0
    ? availableTopics[Math.floor(Math.random() * availableTopics.length)]
    : allTopics[Math.floor(Math.random() * allTopics.length)]

  const prompts: Record<ReflectionTopic, string[]> = {
    gratitude: [
      'Kva er tre ting du er takksam for i dag — og kvifor?',
      'Kven har påverka livet ditt mest, og kva lærte du av dei?',
      'Kva er noko i deg sjølv du har lært å verdsette?',
    ],
    growth: [
      'Korleis har du endra deg sidan du starta reisa?',
      'Kva vanskelegheit har gjort deg sterkare?',
      'Kva er den viktigaste leksjonen du har lært om kjærlighet?',
    ],
    connection: [
      'Korleis kjenner du at du er verkeleg sett?',
      'Kva gjer at du kjener deg trygg nok til å opne deg?',
      'Korleis ynskjer du å bli møtt når du er sårleg?',
    ],
    trust: [
      'Kvordan byggjer du tillit — og korleis veit du at det er der?',
      'Kva er det hardest for deg å stole på — deg sjølv eller andre?',
      'Når var du sist usikker på om du kunne stole på nokon?',
    ],
    hope: [
      'Kva drøm har du gjeve opp — og kvifor vil du ikkje gjeve den opp lenger?',
      'Kva ser du for deg av ein perfekt dag om 10 år?',
      'Kva vil du at din partner skal seie om deg om 10 år?',
    ],
    intimacy: [
      'Korleis definerer du intimitet — utover det fysiske?',
      'Når var du sist verkeleg nær nokon — og kva gjorde det mogleg?',
      'Kva trenge du mest i nærleik — rom eller nærheit?',
    ],
    fear: [
      'Kva er det du er mest redd for å miste i ein relasjon?',
      'Korleis handterer du frykta når ho kjem?',
      'Kva har lært deg at frykt ikkje alltid har rett?',
    ],
    purpose: [
      'Kva er meininga med di eigen reise — i dag, no?',
      'Kva ynskjer du å skape med denne reisa?',
      'Kvifor er du her — verkeleg kvifor?',
    ],
  }

  const topicPrompts = prompts[topic]
  const question = topicPrompts[Math.floor(Math.random() * topicPrompts.length)]

  return {
    question,
    topic,
    depth: journeyPhase === 'DEEPER' ? 9 : journeyPhase === 'BUILDING_TRUST' ? 7 : 5,
    suggestedDuration: 60000 * (3 + Math.random() * 5), // 3-8 min
    warmth: 7 + Math.floor(Math.random() * 3),
  }
}

// ─── OPPGAVE-GENERERING ─────────

export function generateTask(
  journeyPhase: string,
  day: number
): TaskGeneration {
  const tasks: Record<string, TaskGeneration[]> = {
    EARLY: [
      {
        task: 'Skriv ein kort melding til partneren din om noko du verdsatt vedkommande.',
        type: 'appreciation',
        difficulty: 2,
        estimatedTime: 5,
        description: 'Ein enkel måte å starte med varme.',
      },
      {
        task: 'Still partneren din: "Kva er det viktigaste for deg i ein relasjon?"',
        type: 'question',
        difficulty: 3,
        estimatedTime: 10,
        description: 'Eit grunnspørsmål som opnar dører.',
      },
    ],
    BUILDING_TRUST: [
      {
        task: 'Del ein historie frå barndommen din som forma deg.',
        type: 'letter',
        difficulty: 4,
        estimatedTime: 15,
        description: 'Sårlegheit som byggjer bro.',
      },
      {
        task: 'Gjer noko saman: kok ein måltid, lytt på musikk, eller spasér i naturen.',
        type: 'shared-activity',
        difficulty: 3,
        estimatedTime: 60,
        description: 'Felles oppleving forsterkar kopling.',
      },
    ],
    DEEPER: [
      {
        task: 'Skriv eit brev til partneren din om kva reisa har lært deg.',
        type: 'letter',
        difficulty: 5,
        estimatedTime: 20,
        description: 'Djup sårbarheit gjennom skrift.',
      },
      {
        task: 'Still partneren din: "Kva er noko du trenge å høyre frå meg no?"',
        type: 'vulnerability',
        difficulty: 5,
        estimatedTime: 15,
        description: 'Direkte sårbarheits-spørsmål.',
      },
    ],
    CHECKIN: [
      {
        task: 'Samantrek: Kva har vore den djupaste momentet deres så langt?',
        type: 'reflection',
        difficulty: 4,
        estimatedTime: 20,
        description: 'Samantrekking av reisa.',
      },
      {
        task: 'Diskuter: Kva ynskjer dere for vidare veg?',
        type: 'question',
        difficulty: 4,
        estimatedTime: 30,
        description: 'Framtidsperspektiv og felles val.',
      },
    ],
  }

  const phaseTasks = tasks[journeyPhase] || tasks.EARLY
  return phaseTasks[Math.floor(Math.random() * phaseTasks.length)]
}

// ─── RESONANS-INSIGHT ──────────

export function generateResonanceInsight(
  score: number,
  profileA: Record<string, unknown>,
  profileB: Record<string, unknown>
): ResonanceInsight {
  const keyFactors: string[] = []
  const strengths: string[] = []
  const growthAreas: string[] = []

  if (score >= 80) {
    keyFactors.push('Sterk verdi-kompatibilitet', 'Kompatibel kommunikasjonsstil', 'Felles livssyn')
    strengths.push('Djup samforståing', 'Naturlig flyt i samtalar', 'Same relasjonsmål')
    growthAreas.push('Utforsk ulike perspektiv')
  } else if (score >= 60) {
    keyFactors.push('God grunnlag', 'Komplementære eigenskapar', 'Delte interesar')
    strengths.push('Komplementær dynamikk', 'Læringspotensial')
    growthAreas.push('Meir samtykke om verdier', 'Bygge djupere forståing')
  } else {
    keyFactors.push('Komplimentær men ulik', 'Muligheit for vekst')
    strengths.push('Ulike perspektiv kan berike')
    growthAreas.push('Krev meir arbeid og tålmod')
  }

  return {
    explanation: score >= 80
      ? 'Dere har ein remarkabel overlap i verdiar og livssyn. Resonansen kjenna naturleg og djug.'
      : score >= 60
      ? 'Dere har eit sterkt grunnlag med gode samanstemmar. Med tid vil resonansen fordjupes.'
      : 'Dere har ulikk men komplementær dynamikk. Denne reisa kan gi uventa innsikt.',
    keyFactors,
    strengths,
    growthAreas,
    futureOutlook: score >= 70
      ? 'Sterkt potensial for varig kopling.'
      : 'Potensial for meiningfulle opplevingar uavhengig utfall.',
  }
}

// ─── PROFIL-FORBOTTING ─────────

export function generateProfileEnhancement(
  currentProfile: Record<string, unknown>
): ProfileEnhancement {
  return {
    bioSuggestions: [
      { tone: 'rolig', text: 'Ein roleg sjel som set pris på rolege øyeblikk og dype samtalar.', wordCount: 15 },
      { tone: 'lekende', text: 'Alltid klar for ein ny oppleving — men alltid villig til å sitje stille og snakke.', wordCount: 16 },
      { tone: 'moden', text: 'Søker noko ekte og varig. Triv i ro og dybde.', wordCount: 12 },
    ],
    interestSuggestions: ['Lesing', 'Matlagning', 'Vandring', 'Filosofi', 'Musikk'],
    profileTips: [
      'Legg til meir om kva som gjer deg spesiell.',
      'Nemn noko du er god på — det gjer deg synleg.',
      'Del ein liten historie, ikkje berre ein beskriving.',
    ],
    strengths: ['Djup profil', 'Autentisk stemme', 'Tydeleg verdigrunnlag'],
  }
}

// ─── SAMTALEHJÆLP ───────────

export function generateConversationHelp(
  context: {
    resonanceLevel: number
    phase: string
    conversationDepth: string
  }
): ConversationHelp {
  const toneAdvice = context.resonanceLevel >= 70
    ? 'Energien er høg — held fram med varme og sårbarheit.'
    : context.resonanceLevel >= 50
    ? 'Energien er stabil — prøv å dypp djuare med eit personleg spørsmål.'
    : 'Energien er låg — start med eit lettkje oppningsspørsmål.'

  const depthAdvice = context.conversationDepth === 'deep'
    ? 'De er på djupna — held fram med sårbarheit.'
    : context.conversationDepth === 'moderate'
    ? 'Overgå til djuare tema med eit refleksjonsspørsmål.'
    : 'Bygg opp mot djuare tema med felles opplevingar.'

  const topicSuggestions = [
    'Verdier som styrer livets',
    'Drøymar for framtida',
    'Kvifor du trur du er her',
    'Kva du lærte av foreldra dine',
    'Kva som gjer livet verdt å bu',
  ]

  const avoidList = [
    'Ikje start med eks-partnarar.',
    'Ikje fokuser berre på deg sjølv.',
    'Ikje bruk for mange ja/spørsmål-knappar.',
  ]

  const powerPhrases = [
    'Eg har tenkt på det du sa...',
    'Det du nemnde, fekk meg til å sjå...',
    'Eg er usikker på, men eg vil prøve...',
    'Kva trur du om...?',
  ]

  return {
    toneAdvice,
    depthAdvice,
    topicSuggestions,
    avoidList,
    powerPhrases,
  }
}

