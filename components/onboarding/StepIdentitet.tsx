/**
 * Steg 1: Identitet — første steget i djup profil
 * Core-definition: Kven er du? Berre djup profil-data
 */

"use client"

import { useState } from "react"

interface IdentitetData {
  name: string
  pronouns: string
  age: string
  gender: string
  note: string
}

interface Props {
  data?: IdentitetData | null
  onChange: (data: IdentitetData) => void
}

const initialData: IdentitetData = {
  name: "",
  pronouns: "",
  age: "",
  gender: "",
  note: "",
}

export default function StegIdentitet({ data, onChange }: Props) {
  const [form, setForm] = useState<IdentitetData>(
    data && data.name ? data : initialData
  )

  const update = (field: keyof IdentitetData, value: string) => {
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
        Kven er du?
      </h3>
      <p
        className="mb-6"
        style={{ fontSize: '14px', color: 'rgba(212, 175, 55, 0.6)', lineHeight: '1.5' }}
      >
        Dette er starten på din djup profil — alt du deler er privat og aldri synleg for andre brukarar.
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
          Kva vil du bli kalla?
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Namnet ditt (eller det du vil kallast)"
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
          Alder
        </label>
        <input
          type="number"
          min={23}
          max={99}
          value={form.age}
          onChange={(e) => update("age", e.target.value)}
          placeholder="Kor gammal er du?"
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
          Kjøn
        </label>
        <select
          value={form.gender}
          onChange={(e) => update("gender", e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: form.gender ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease-out',
            boxSizing: 'border-box',
          }}
        >
          <option value="">Vel...</option>
          <option value="man">Mann</option>
          <option value="woman">Kvinne</option>
          <option value="nonbinary">Ikkje-binær</option>
          <option value="other">Annet</option>
          <option value="prefer-not">Vel ikkje å oppgi</option>
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
          Stavemåte / pronomen (valfritt)
        </label>
        <select
          value={form.pronouns}
          onChange={(e) => update("pronouns", e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: form.pronouns ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease-out',
            boxSizing: 'border-box',
          }}
        >
          <option value="">Vel...</option>
          <option value="han/han">Han/han</option>
          <option value="ho/ho">Ho/ho</option>
          <option value="vedkomande/vedkomande">Vedkomande</option>
          <option value="de/de">De/de</option>
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
          Fortel kort om deg (valfritt)
        </label>
        <textarea
          value={form.note}
          onChange={(e) => update("note", e.target.value)}
          placeholder="Kva vil du dele om deg sjølv?"
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
