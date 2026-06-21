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
      <h3>Livssituasjon</h3>
      <p className="form-description">Arbeid, bustad, økonomi, kvardag</p>

      <div className="form-field">
        <label>Jobb / yrke</label>
        <input
          type="text"
          value={form.jobb}
          onChange={(e) => handleChange("jobb", e.target.value)}
          placeholder="Kva jobbar du med?"
        />
      </div>

      <div className="form-field">
        <label>Bustad</label>
        <input
          type="text"
          value={form.bustad}
          onChange={(e) => handleChange("bustad", e.target.value)}
          placeholder="Kor bur du?"
        />
      </div>

      <div className="form-field">
        <label>Økonomi</label>
        <select
          value={form.okonomi}
          onChange={(e) => handleChange("okonomi", e.target.value)}
        >
          <option value="">Vel...</option>
          <option value="stable">Stabil</option>
          <option value="growing">Veksande</option>
          <option value="building">Byggjer opp</option>
        </select>
      </div>

      <div className="form-field">
        <label>Kvardag</label>
        <textarea
          value={form.kvardag}
          onChange={(e) => handleChange("kvardag", e.target.value)}
          placeholder="Korleis ser ein vanleg dag din ut?"
          rows={3}
        />
      </div>
    </div>
  )
}
