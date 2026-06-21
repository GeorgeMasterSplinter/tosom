/**
 * OnboardingWizard — 10-stegs djup profil wizard
 * Core-definition: Berre djup profil-data — aldri foto-scoring
 * Ingen styling utover funksjonell struktur (Sprint 1)
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import StegIdentitet from "./StepIdentitet"
import StegLivssituasjon from "./StepLivssituasjon"
import StegKjerner from "./StepKjerner"
import StegPersonlighet from "./StepPersonlighet"
import StegRelasjonsstil from "./StepRelasjonsstil"
import StegKommunikasjon from "./StepKommunikasjon"
import StegIntimitet from "./StepIntimitet"
import StegFramtid from "./StepFramtid"
import StegGrenser from "./StepGrenser"
import StegLivsrytme from "./StepLivsrytme"
import StegOppsummering from "./StepOppsummering"

// Steg-definisjonar
const STEPS = [
  { key: "identity", title: "Identitet", description: "Kven er du?", component: "identitet" as const },
  { key: "lifeSituation", title: "Livssituasjon", description: "Arbeid, bustad, økonomi", component: "livssituasjon" as const },
  { key: "lifestyle", title: "Livsstil", description: "Aktivitet, sosial, helgevanar", component: "livsstil" as const },
  { key: "personality", title: "Personlegdom", description: "Styrkar, trekk, natur", component: "personlighet" as const },
  { key: "relationshipStyle", title: "Relasjonsstil", description: "Korleie du søker relasjon", component: "relasjonsstil" as const },
  { key: "communication", title: "Kommunikasjon", description: "Kommunikasjonspreferanse", component: "kommunikasjon" as const },
  { key: "intimacy", title: "Intimitet & Nærheit", description: "Modent og trygt", component: "intimitet" as const },
  { key: "futureVision", title: "Framtidsønsker", description: "Drøymar, mål", component: "framtid" as const },
  { key: "boundaries", title: "Grenser", description: "Behov, grenser, limitasjonar", component: "grenser" as const },
  { key: "lifeRhythm", title: "Livsrytme", description: "Livsrytme, modenheit, trygghet", component: "livsrytme" as const },
  { key: "summary", title: "Oppsummering", description: "Oversikt over alt", component: "summary" as const },
] as const

interface Progress {
  currentStepIndex?: number
  percentage: number
  completeCount?: number
  totalCount?: number
}

interface OnboardingWizardProps {
  onComplete?: () => void
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stepData, setStepData] = useState<Record<string, unknown>>({})

  // Henta progresjon ved last
  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const res = await fetch("/api/onboarding/progress")
      if (!res.ok) return
      const data = await res.json()
      if (data.progress) {
        setProgress(data.progress)
        // Finn korvidaren brukaren var
        const savedIndex = data.progress.currentStepIndex ?? 0
        setCurrentStepIndex(savedIndex)
        setStepData(data.steps || {})
      }
    } catch (err) {
      console.error("Feil ved henting av progresjon:", err)
    }
  }

  const saveStep = async (stepKey: string, data: unknown) => {
    setSaving(true)
    setError(null)
    try {
      // Kart stepKey til DeepProfileStep
      const deepStepMap: Record<string, string> = {
        identity: "IDENTITY",
        lifeSituation: "LIFE_SITUATION",
        lifestyle: "LIFESTYLE",
        personality: "PERSONALITY",
        relationshipStyle: "RELATIONSHIP_STYLE",
        communication: "COMMUNICATION",
        intimacy: "INTIMACY",
        futureVision: "FUTURE_VISION",
        boundaries: "BOUNDARIES",
        summary: "SUMMARY",
      }

      const res = await fetch("/api/onboarding/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: deepStepMap[stepKey] || stepKey,
          data,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Kunne ikje lagre")
      }

      const result = await res.json()
      setProgress(result.profile?.deepProfileComplete ? {
        currentStepIndex: 9,
        percentage: 100,
        completeCount: 9,
        totalCount: 9,
      } : {
        ...progress,
        percentage: result.profile?.deepProfileComplete ? 100 : progress?.percentage || 0,
      })
      setStepData((prev) => ({ ...prev, [stepKey]: data }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjend feil")
    } finally {
      setSaving(false)
    }
  }

  const completeOnboarding = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Kunne ikkje fullføra")
      }

      if (onComplete) {
        onComplete()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjend feil")
    } finally {
      setSaving(false)
    }
  }

  const goToStep = useCallback((index: number) => {
    setCurrentStepIndex(index)
  }, [])

  const nextStep = useCallback(() => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((i) => i + 1)
    }
  }, [currentStepIndex])

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1)
    }
  }, [currentStepIndex])

  // Render steg
  // Steg-komponentar kart
  const stepComponents: Record<string, React.ReactNode> = {
    identitet: <StegIdentitet data={stepData["IDENTITY"] as any} onChange={() => {} } />,
    livssituasjon: <StegLivssituasjon data={stepData["LIFE_SITUATION"] as any} onChange={() => {} } />,
    livsstil: <p>Livsstil-steg — funksjonell struktur</p>,
    personlighet: <StegPersonlighet data={stepData["PERSONALITY"] as any} onChange={() => {} } />,
    relasjonsstil: <StegRelasjonsstil data={stepData["RELATIONSHIP_STYLE"] as any} onChange={() => {} } />,
    kommunikasjon: <StegKommunikasjon data={stepData["COMMUNICATION"] as any} onChange={() => {} } />,
    intimitet: <StegIntimitet data={stepData["INTIMACY"] as any} onChange={() => {} } />,
    framtid: <StegFramtid data={stepData["FUTURE_VISION"] as any} onChange={() => {} } />,
    grenser: <StegGrenser data={stepData["BOUNDARIES"] as any} onChange={() => {} } />,
    livsrytme: <StegLivsrytme data={stepData["LIFESTYLE"] as any} onChange={() => {} } />,
    summary: <StegOppsummering data={stepData} />,
  }

  const renderStep = () => {
    const step = STEPS[currentStepIndex]
    const componentKey = step.component

    return (
      <div className="onboarding-step">
        <div className="onboarding-header">
          <h2>{step.title}</h2>
          <p>{step.description}</p>
        </div>

        <div className="onboarding-content">
          {stepComponents[componentKey] || <p>Ukjend steg: {step.key}</p>}
        </div>

        <div className="onboarding-footer">
          <button onClick={prevStep} disabled={currentStepIndex === 0}>
            Tidlegare
          </button>
          <span>{currentStepIndex + 1} / {STEPS.length}</span>
          <button
            onClick={() => {
              if (currentStepIndex === STEPS.length - 1) {
                completeOnboarding()
              } else {
                nextStep()
              }
            }}
            disabled={saving}
          >
            {saving ? "Lagar..." : currentStepIndex === STEPS.length - 1 ? "Fullfør" : "Neste"}
          </button>
        </div>

        {error && <div className="onboarding-error">{error}</div>}
      </div>
    )
  }

  return (
    <div className="onboarding-container">
      {/* Progress bar */}
      <div className="onboarding-progress">
        <div
          className="onboarding-progress-bar"
          style={{
            width: `${progress?.percentage || ((currentStepIndex + 1) / STEPS.length) * 100}%`,
          }}
        />
        <span>{progress?.percentage || Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}%</span>
      </div>

      {/* Step navigation dots */}
      <div className="onboarding-dots">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => goToStep(i)}
            className={i <= currentStepIndex ? "active" : ""}
            disabled={i > currentStepIndex}
          />
        ))}
      </div>

      {/* Step content */}
      {renderStep()}
    </div>
  )
}