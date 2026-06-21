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
      <h3>Kven er du?</h3>
      <p className="form-description">Dette er starten på din djup profil — alt du deler er privat og aldri synleg for andre brukarar</p>

      <div className="form-field">
        <label>Kva vil bli kalla?</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Namnet ditt (eller det du vil kallast)"
        />
      </div>

      <div className="form-field">
        <label>Alder</label>
        <input
          type="number"
          min={18}
          max={120}
          value={form.age}
          onChange={(e) => update("age", e.target.value)}
          placeholder="Kor gammal er du?"
        />
      </div>

      <div className="form-field">
        <label>Kjøn</label>
        <select
          value={form.gender}
          onChange={(e) => update("gender", e.target.value)}
        >
          <option value="">Vel...</option>
          <option value="man">Mann</option>
          <option value="woman">Kvinne</option>
          <option value="nonbinary">Ikkje-binær</option>
          <option value="other">Annet</option>
          <option value="prefer-not">Vel ikkje å oppgi</option>
        </select>
      </div>

      <div className="form-field">
        <label>Stavemåte / pronomen (valfritt)</label>
        <select
          value={form.pronouns}
          onChange={(e) => update("pronouns", e.target.value)}
        >
          <option value="">Vel...</option>
          <option value="han/han">Han/han</option>
          <option value="ho/ho">Ho/ho</option>
          <option value="vedkomande/vedkomande">Vedkomande</option>
          <option value="de/de">De/de</option>
        </select>
      </div>

      <div className="form-field">
        <label>Fortel kort om deg (valfritt)</label>
        <textarea
          value={form.note}
          onChange={(e) => update("note", e.target.value)}
          placeholder="Kva vil du dele om deg sjølv?"
          rows={3}
        />
      </div>
    </div>
  )
}
