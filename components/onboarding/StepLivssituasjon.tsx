/**
 * Steg 2: Livssituasjon
 * Core-definition: Djup profil — aldri foto-scoring
 */

"use client"

import { useState } from "react"

interface LivssituasjonData {
  jobb: string
  bustad: string
  okonomi: string
  kvardag: string
}

interface Props {
  data?: LivssituasjonData | null
  onChange: (data: LivssituasjonData) => void
}

const initialData: LivssituasjonData = {
  jobb: "",
  bustad: "",
  okonomi: "",
  kvardag: "",
}

export default function StegLivssituasjon({ data, onChange }: Props) {
  const [form, setForm] = useState<LivssituasjonData>(data && Object.keys(data).length > 0 ? data : initialData)

  const handleChange = (field: keyof LivssituasjonData, value: string) => {
    const updated = { ...form, [field]: value }
    setForm(updated)
    onChange(updated)
  }

  return (
    <div className="form-group">
      {/* Enhetleg tittel-stil: 20px, 600, mb-2 */}
      <h3
        className="font-semibold mb-2"
        style={{ fontSize: '20px', fontWeight: 600, color: '#FFFFFF' }}
      >
        Livssituasjon
      </h3>
      <p
        className="mb-6"
        style={{ fontSize: '14px', color: 'rgba(212, 175, 55, 0.6)', lineHeight: '1.5' }}
      >
        Arbeid, bustad, økonomi, kvardag
      </p>

      <div
        className="form-field mb-4"
        style={{ marginBottom: '16px' }}
      >
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 500,
            color: 'rgba(212, 175, 55, 0.7)',
            marginBottom: '8px',
            letterSpacing: '0.03em',
          }}
        >
          Jobb / yrke
        </label>
        <input
          type="text"
          value={form.jobb}
          onChange={(e) => handleChange("jobb", e.target.value)}
          placeholder="Kva jobbar du med?"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: '#FFFFFF',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease-out',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(212, 175, 55, 0.5)';
            (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
            (e.target as HTMLInputElement).style.boxShadow = 'none';
          }}
        />
      </div>

      <div
        className="form-field mb-4"
        style={{ marginBottom: '16px' }}
      >
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 500,
            color: 'rgba(212, 175, 55, 0.7)',
            marginBottom: '8px',
            letterSpacing: '0.03em',
          }}
        >
          Bustad
        </label>
        <input
          type="text"
          value={form.bustad}
          onChange={(e) => handleChange("bustad", e.target.value)}
          placeholder="Kor bur du?"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: '#FFFFFF',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease-out',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(212, 175, 55, 0.5)';
            (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
            (e.target as HTMLInputElement).style.boxShadow = 'none';
          }}
        />
      </div>

      <div
        className="form-field mb-4"
        style={{ marginBottom: '16px' }}
      >
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 500,
            color: 'rgba(212, 175, 55, 0.7)',
            marginBottom: '8px',
            letterSpacing: '0.03em',
          }}
        >
          Økonomi
        </label>
        <select
          value={form.okonomi}
          onChange={(e) => handleChange("okonomi", e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: form.okonomi ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease-out',
            boxSizing: 'border-box',
          }}
        >
          <option value="">Vel...</option>
          <option value="stable">Stabil</option>
          <option value="growing">Veksande</option>
          <option value="building">Byggjer opp</option>
        </select>
      </div>

      <div
        className="form-field mb-4"
        style={{ marginBottom: '16px' }}
      >
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 500,
            color: 'rgba(212, 175, 55, 0.7)',
            marginBottom: '8px',
            letterSpacing: '0.03em',
          }}
        >
          Kvardag
        </label>
        <textarea
          value={form.kvardag}
          onChange={(e) => handleChange("kvardag", e.target.value)}
          placeholder="Korleis ser ein vanleg dag din ut?"
          rows={3}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: '#FFFFFF',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease-out',
            boxSizing: 'border-box',
            resize: 'vertical',
          }}
          onFocus={(e) => {
            (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(212, 175, 55, 0.5)';
            (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
          }}
          onBlur={(e) => {
            (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
            (e.target as HTMLTextAreaElement).style.boxShadow = 'none';
          }}
        />
      </div>
    </div>
  )
}
