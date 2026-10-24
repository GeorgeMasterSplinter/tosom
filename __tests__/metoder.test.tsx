/**
 * ACT F1 — /metoder SCIENTIFIC INTEGRITY (SCI-01–SCI-12)
 *
 * Offentlig Metoder-side (app/metoder/page.tsx) skal beskrive det Tosom FAKTISK gjør:
 * rammeverk vs egne spørsmål vs praktiske preferanser — aldri som synonymer.
 * Kopi av gjeldende audit: docs/METHODS-SCIENTIFIC-AUDIT-v1.0.md (F1-oppdatering).
 *
 * Metodikke: renderToStaticMarkup (node, som motpol-testen). Copy-guards kjører på den
 * renderede teksten (uten HTML-tagger), så de fanger det brukeren faktisk ser.
 *
 * Merk: BFI-10-LISENS er en LAUNCH GATE som ikke løses av copy (se audit G/Q og
 * docs/LanseringsCheckList.md). Testene garanterer kun at OFFENTLIG TEKST er sann.
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');

import MetoderPage from '@/app/metoder/page';

// Render én gang for alle copy-guards.
const HTML: string = renderToStaticMarkup(React.createElement(MetoderPage));
/** Brukervendt tekst: HTML-tagger fjernet, entity-encoding dekoddet (som i nettleser). */
const TEXT: string = HTML
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ');

/** Alle eksterne lenker som faktisk renderes (href="http..."). */
const EXTERNAL_HREFS: string[] =
  (HTML.match(/href="(https?:\/\/[^"]+)"/g) || []).map((h) =>
    h.replace(/^href="/, '').replace(/"$/, ''),
  );

/** De eneste tillatte eksterne kildelengdene (alle verifisert via Crossref/DOI). */
const APPROVED_SOURCE_URLS = new Set([
  'https://doi.org/10.1037/0022-3514.52.3.511', // Hazan & Shaver 1987
  'https://doi.org/10.1037/0022-3514.63.2.221', // Gottman & Levenson 1992
  'https://doi.org/10.1016/S0065-2601(08)60281-6', // Schwartz 1992
  'https://doi.org/10.1037/1089-2680.4.2.132', // Fraley & Shaver 2000
  'https://doi.org/10.1037/0022-3514.85.2.348', // Gross & John 2003
  'https://doi.org/10.1016/j.jrp.2006.02.001', // Rammstedt & John 2007
  'https://doi.org/10.1016/j.cpr.2009.11.004', // Aldao et al. 2010
  'https://doi.org/10.1080/1047840X.2014.940781', // Gross 2015
]);

describe('SMOKE — /metoder renderes', () => {
  it('ruten finnes og renderes med H1 «Metoder vi bruker»', () => {
    expect(existsSync(join(ROOT, 'app/metoder/page.tsx'))).toBe(true);
    expect(HTML).toMatch(/<h1[^>]*>[\s\S]*?Metoder vi bruker[\s\S]*?<\/h1>/);
  });

  it('har CTA-flyt (/register, /login) og footer', () => {
    expect(HTML).toMatch(/href="\/register"/);
    expect(HTML).toMatch(/href="\/login"/);
    expect(HTML).toContain('<footer');
  });
});

describe('SCI-01 — ingen «seks dimensjoner, hver med etablert instrument»', () => {
  it('overordnet feilpåstand er fjernet', () => {
    expect(TEXT).not.toMatch(/seks dimensjoner,?\s+hver med/i);
    expect(TEXT).not.toContain('etablert instrument bak seg');
    expect(TEXT).not.toMatch(/hver (dimensjon|område) støttes av et etablert instrument/i);
  });

  it('erstattet med ærlig beskrivelse (rammeverk vs egne spørsmål)', () => {
    expect(TEXT).toMatch(/Noen bygger på etablerte psykologiske rammeverk/);
    expect(TEXT).toMatch(/egne spørsmål og praktiske preferanser/);
  });
});

describe('SCI-02 — ingen «vi bruker instrumentene slik de er ment»', () => {
  it('påstanden om uendret instrumentbruk er fjernet', () => {
    expect(TEXT).not.toContain('som de er ment å brukes');
    expect(TEXT).not.toMatch(/bruker dem som de er ment/i);
  });
});

describe('SCI-03 — PVQ-10 brukes ikke som navn på Tosoms egne items', () => {
  it('verken «PVQ-10» eller noe annet PVQ-navn finnes på siden', () => {
    expect(TEXT).not.toMatch(/PVQ/i);
  });

  it('verdiområdet beskrives som egne spørsmål med teoretisk utgangspunkt', () => {
    expect(TEXT).toMatch(/Egne spørsmål inspirert av forskningen til Schwartz/);
    expect(TEXT).toMatch(/Ikke et publisert standardisert verdisjema/);
  });
});

describe('SCI-04 — ERQ-6/Gross & John 2003 brukes ikke som Tosoms instrument', () => {
  it('verken «ERQ-6» eller «ERQ» finnes på siden', () => {
    expect(TEXT).not.toMatch(/ERQ/i);
  });

  it('Gross & John nevnes kun som faglig inspirasjon (ikke som brukt instrument)', () => {
    expect(TEXT).toMatch(/Egne spørsmål inspirert av emosjonsreguleringsforskningen \(Gross & John 2003\)/);
    expect(TEXT).toMatch(/Ikke et publisert regulerings-skjema/);
  });
});
describe('SCI-05 — ECR-12 brukes ikke som navn på egne tilknytningsitems', () => {
  it('verken «ECR»-navn eller instrumentreferanse finnes på siden', () => {
    expect(TEXT).not.toMatch(/ECR/i);
  });

  it('tilknytning beskrives som egne spørsmål over angst/unnvikelse, uten klinisk kategori', () => {
    expect(TEXT).toMatch(/Egne spørsmål inspirert av forskning på voksen tilknytning/);
    expect(TEXT).toMatch(/tilknytningsangst og tilknytningsunnvikelse/);
    expect(TEXT).toMatch(/Ikke et publisert tilknytnings-skjema/);
    expect(TEXT).toMatch(/ikke en diagnose eller en klinisk tilknytningskategori/);
  });
});

describe('SCI-06 — Gottman Institute-side brukes ikke som fagfellevurdert kilde', () => {
  it('ingen lenke til gottman.com og ingen «Institutt — ongoing publications»-kilde', () => {
    expect(HTML).not.toContain('gottman.com');
    expect(TEXT).not.toMatch(/Gottman Institute.*ongoing/i);
    expect(TEXT).not.toMatch(/Gottman Institute publisering/i);
  });

  it('Gottman refereres kun via den verifiserte primærpublikasjonen (1992)', () => {
    expect(TEXT).toContain('Gottman, J. M., & Levenson, R. W. (1992).');
    expect(TEXT).toMatch(/Våre spørsmål er egne/);
  });
});

describe('SCI-07 — ingen uverifisert «livsvalg sterkeste prediktor»-claim', () => {
  it('påstanden er fjernet', () => {
    expect(TEXT).not.toMatch(/strekkeste prediktor/i);
    expect(TEXT).not.toMatch(/Livsvalg er en av de/);
    expect(TEXT).not.toContain('2015–2024');
  });

  it('livssituasjon beskrives som praktisk kompatibilitet', () => {
    expect(TEXT).toMatch(/Praktiske preferanser, ikke et psykologisk instrument/);
  });
});

describe('SCI-08 — Metoder sier eksplisitt at modellen ikke er klinisk diagnostikk', () => {
  it('klar ikke-klinisk-påstand finnes', () => {
    expect(TEXT).toMatch(/Tosom er ikke en klinisk tjeneste/);
    expect(TEXT).toMatch(/ingen av spørsmålene er en diagnose/);
    expect(TEXT).toMatch(/ikke en vurdering av helse/);
  });
});
describe('SCI-09 — fysisk tiltrekning presenteres ikke som beregnet', () => {
  it('eksplisitt at tiltrekning ikke inngår i matchskåren', () => {
    expect(TEXT).toContain('Fysisk tiltrekning inngår ikke i matchskåren');
    expect(TEXT).toMatch(/forsøker ikke å beregne den/);
  });

  it('ingen motsatt påstand (at Tosom beregner/kartlegger tiltrekning)', () => {
    expect(TEXT).not.toMatch(/beregne[r]? (fysisk )?tiltrekning/i);
    expect(TEXT).not.toMatch(/kartlegge[r]? (fysisk )?tiltrekning/i);
    expect(TEXT).not.toMatch(/måler (fysisk )?tiltrekning/i);
  });

  it('kan-ikke-vite-listen dekker kjemi/forelse/møte/utfall', () => {
    expect(TEXT).toContain('om kjemi oppstår');
    expect(TEXT).toContain('om dere forelsker dere');
    expect(TEXT).toContain('hvordan et fysisk møte oppleves');
    expect(TEXT).toContain('om et forhold vil vare');
  });
});

describe('SCI-10 — resonans presenteres ikke som etablert psykologisk instrument', () => {
  it('merkebegreps-presisering finnes', () => {
    expect(TEXT).toMatch(/Resonans er Tosoms navn på den samlede matchvurderingen/);
    expect(TEXT).toMatch(/merkebegrep — ikke et etablert psykologisk instrument eller en klinisk skår/);
  });

  it('eksisterende grensespråk beholdes (ikke diagnose/bedømmelse)', () => {
    expect(TEXT).toContain('ikke en kjærlighetsdiagnose');
    expect(TEXT).toContain('ikke en bedømmelse av verdi');
  });
});

describe('SCI-11 — alle aktive kilde-URLer er godkjente/verifiserte kilder', () => {
  it('alle eksterne lenker på siden er i tillatt DOI-settet', () => {
    expect(EXTERNAL_HREFS.length).toBeGreaterThanOrEqual(APPROVED_SOURCE_URLS.size);
    for (const href of EXTERNAL_HREFS) {
      expect(APPROVED_SOURCE_URLS.has(href)).toBe(true);
    }
  });

  it('ingen Scholar-søke-URLer eller organisasjonsforsider gjenstår', () => {
    expect(HTML).not.toContain('scholar.google.com');
    expect(HTML).not.toContain('scholar?q=');
  });

  it('alle 8 verifiserte kilder er til stede med full referanse (forfatter/år/journal/vol/sider)', () => {
    for (const part of [
      '52(3), 511–519', // Hazan & Shaver
      '63(2), 221–233', // Gottman & Levenson
      '25, 1–65', // Schwartz
      '4(2), 132–158', // Fraley & Shaver
      '85(2), 348–362', // Gross & John
      '41(1), 203–212', // Rammstedt & John
      '30(2), 217–237', // Aldao
      '26(1), 1–26', // Gross 2015
    ]) {
      expect(TEXT).toContain(part);
    }
  });
});

describe('SCI-12 — ingen ny research claim uten godkjent kilde', () => {
  it('fjernet: ikke-reelle referanser (Fraley 2018-kapittel, Roberts 2016)', () => {
    expect(TEXT).not.toMatch(/Fraley \(2018/);
    expect(TEXT).not.toContain('The Adult Attachment Inventory');
    expect(TEXT).not.toMatch(/Roberts, B\. W\./);
  });

  it('fjernet: uverifiserte referanser (Schwartz 2012-kapittel, Mikulincer & Shaver 2007)', () => {
    expect(TEXT).not.toMatch(/Cieciuch/);
    expect(TEXT).not.toMatch(/Mikulincer/);
  });

  it('fjernet: ukilderbare tidsvindus-påstander om moderne bruk', () => {
    expect(TEXT).not.toMatch(/2010–2024/);
    expect(TEXT).not.toMatch(/2000–2024/);
  });

  it('fjernet: absolute kilde-påstand om at alt er fagfellevurderte studier og bøker', () => {
    expect(TEXT).not.toContain('fagfellevurdete studier og bøker');
  });

  it('fjernet: autoritets-påstander («Gottman observerte tusenvis av par», «Forskningen er tydelig»)', () => {
    expect(TEXT).not.toMatch(/Gottman observerte tusenvis av par/);
    expect(TEXT).not.toMatch(/Forskningen er tydelig/);
    expect(TEXT).not.toMatch(/mest aktive feltene/i);
  });
});

describe('F1 — BFI-10: dokumentert som tilpasning, IKKE som validert instrument (lisens = launch gate)', () => {
  it('BFI-10 nevnes som stil/inspirasjon med eksplisitte overganger', () => {
    expect(TEXT).toMatch(/i stil med BFI-10-kortformen/);
    expect(TEXT).toMatch(/tilpasset til norsk av oss/);
    expect(TEXT).toMatch(/Våre egne tilpasninger — ikke det originale instrumentet/);
    expect(TEXT).toMatch(/svarskalaen er endret/);
    expect(TEXT).toMatch(/ikke selvstendig validert/);
  });

  it('ingen påstand om at Tosom administrerer et validert BFI-10-instrument', () => {
    expect(TEXT).not.toMatch(/vi bruker BFI-10/);
    expect(TEXT).not.toMatch(/validert BFI/i);
  });
});

describe('F1 — psykometrisk avgrensning og ærlighetsprinsipper beholdt/styrket', () => {
  it('ingen egen dokumentert reliabilitet/validitet/prediksjon', () => {
    expect(TEXT).toMatch(/har foreløpig ikke egne data som viser hvor godt modellen forutsier/);
    expect(TEXT).toMatch(/reliabilitet, faktorstruktur, normering eller prediktiv validitet/);
    expect(TEXT).toMatch(/veiviser, ikke som et bevis/);
  });

  it('eksisterende prinsipper beholdes (ikke egne studier, ikke bevis, veiviser)', () => {
    expect(TEXT).toMatch(/Vi har ikke selv gjennomført studier/);
    expect(TEXT).toMatch(/Vi har ikke selv gjennomført studier, og vi påstår ikke å «vitenskapelig bevise»/);
    expect(TEXT).toMatch(/veiviser, ikke en fasit/);
    expect(TEXT).toContain('Hva vi ikke lover');
  });

  it('lifestyle/kropp-avgrensning (F1 §12): livsstil er aldri skjult attraktivitets-prediktor', () => {
    expect(TEXT).toMatch(/Vi legger ikke kropp, utseende eller livsstil til grunn for å vurdere attraktivitet/);
  });

  it('kilder-intro: dokumenterer teorier, ikke Tosoms egen matchingmodell', () => {
    expect(TEXT).toMatch(/De dokumenterer teoriene og forskningen — ikke Tosoms egen matchingmodell/);
  });
});
