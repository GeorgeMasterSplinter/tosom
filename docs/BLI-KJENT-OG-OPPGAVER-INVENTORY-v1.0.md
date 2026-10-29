# Tosom – Bli kjent og oppgaver

> Inventar: komplett uttrekk av alt bruker-valgbart samtaleinnhold (Bli-kjent-spørsmål + oppgaver) fra canonical runtime-kilder. Ingen omskriving, ingen kvalitetvurdering. Tekst NØYAKTIG som i kildefilene.

## A. Runtime sources

| Innhold | Canonical source | Konsumenter (runtime) |
|---|---|---|
| Bli kjent-spørsmål | `app/questions/data/questions.ts` (`questionCategories`) | `app/chat/components/BliKjentPanel.tsx` (chat-panelet) + `app/questions/page.tsx` (tilfeldig-spørsmål-siden) |
| Oppgaver | `app/chat/data/tasks.ts` (`taskCategories`) | `app/chat/components/OppgaverPanel.tsx` (chat-panelet) |

Begge filer er hardkodede TypeScript-data (ingen DB). Spørsmål sendes som chat-melding med `metadata.source = "bli_kjent"`, oppgaver med `source = "oppgave"`.

## B. Totals

Bli kjent:
- total: 240
- categories: 12

Oppgaver:
- total: 135
- categories: 9

## C. Bli kjent-spørsmål

### Kategori 1 – Personlighet & identitet (id: personlighet)

PERSONLIGHET-01 / Q-001
Hva er den ene egenskapen ved deg som andre ofte overraskes over?

PERSONLIGHET-02 / Q-002
Hvordan beskriver du den perfekte dagen for deg selv?

PERSONLIGHET-03 / Q-003
Hva er noe du har endret syn på de siste årene?

PERSONLIGHET-04 / Q-004
Hva får deg til å føle deg mest som deg selv?

PERSONLIGHET-05 / Q-005
Hva er en overbevisning du har som kanskje er litt uvanlig?

PERSONLIGHET-06 / Q-006
Når føler du deg mest energisk i løpet av en dag?

PERSONLIGHET-07 / Q-007
Hva er noe du aldri vil slutte med, uansett hva?

PERSONLIGHET-08 / Q-008
Hva betyr mest for deg når du skal vurdere om et valg var riktig?

PERSONLIGHET-09 / Q-009
Hvordan har din forståelse av deg selv endret seg det siste året?

PERSONLIGHET-10 / Q-010
Hva er noe du ønsker å bli bedre i, i forhold til deg selv?

PERSONLIGHET-11 / Q-011
Hva er din personlige superkraft som kanskje ikke er like åpenbar for andre?

PERSONLIGHET-12 / Q-012
Hva er noe du gjerne ville lært deg å gjøre, men ennå ikke har?

PERSONLIGHET-13 / Q-013
Hva er noe du er stolt av som kanskje få vet om?

PERSONLIGHET-14 / Q-014
Hvordan tar du deg selv videre når du føler deg fastkjørt?

PERSONLIGHET-15 / Q-015
Hva er det som gir deg mest mening i livet akkurat nå?

PERSONLIGHET-16 / Q-016
Hva er noe du ofte hører at alle liker, men som du egentlig ikke gjør?

PERSONLIGHET-17 / Q-017
Hva er noe du aldri har fortalt noen om dine dypeste interesser?

PERSONLIGHET-18 / Q-018
Hva er noe du vet du vil oppnå i livet?

PERSONLIGHET-19 / Q-019
Hva er noe du har gjort og angret på?

PERSONLIGHET-20 / Q-020
Hva er noe du er redd for å innrømme overfor deg selv?

### Kategori 2 – Forhold & tilknytning (id: forhold)

FORHOLD-01 / Q-021
Hva trenger du mest av for å føle deg trygg i et forhold?

FORHOLD-02 / Q-022
Hvordan behandler du konflikter når de oppstår?

FORHOLD-03 / Q-023
Hva er den viktigste leksjonen du har lært om kjærlighet?

FORHOLD-04 / Q-024
Hva mener du er forskjellen mellom å elske noen og å trenge noen?

FORHOLD-05 / Q-025
Hvordan viser du kjærlighet mest naturlig?

FORHOLD-06 / Q-026
Hva er noe du aldri vil kompromisse med i et forhold?

FORHOLD-07 / Q-027
Hva gjør du når du føler deg krenket i en relasjon?

FORHOLD-08 / Q-028
Hva er din største frykt når det gjelder nærhet?

FORHOLD-09 / Q-029
Hva betyr lojalitet for deg i praksis?

FORHOLD-10 / Q-030
Hvordan vet du at noen virkelig bryr seg om deg?

FORHOLD-11 / Q-031
Hva er noe du ønsker å lære av din partner om relasjoner?

FORHOLD-12 / Q-032
Hvordan opplever du forskjellen mellom å gi og motta kjærlighet?

FORHOLD-13 / Q-033
Hva er noe du trenger å høre oftere fra en partner?

FORHOLD-14 / Q-034
Hvordan påvirker avstand en relasjon for deg?

FORHOLD-15 / Q-035
Hva er noe du ønsker å gjøre annerledes enn det du vokste opp med?

FORHOLD-16 / Q-036
Hva er din største styrke som partner?

FORHOLD-17 / Q-037
Hva er noe du jobber med å bli bedre i som partner?

FORHOLD-18 / Q-038
Hvordan definerer du trofasthet utover fysisk trohet?

FORHOLD-19 / Q-039
Hva er noe du trenger tid til i en relasjon?

FORHOLD-20 / Q-040
Hva er noe som får deg til å føle deg mest forent med en partner?

### Kategori 3 – Kommunikasjon & konflikter (id: kommunikasjon)

KOMMUNIKASJON-01 / Q-041
Hvordan snakker du med noen du bryr deg om når dere er uenige?

KOMMUNIKASJON-02 / Q-042
Hva er noe du har lært om å lytte som har endret deg?

KOMMUNIKASJON-03 / Q-043
Hvordan forteller du noen at de har såret deg uten å angripe?

KOMMUNIKASJON-04 / Q-044
Hva er det som gjør at du stenger deg av i en samtale?

KOMMUNIKASJON-05 / Q-045
Hvordan liker du at noen gir deg tilbakemelding?

KOMMUNIKASJON-06 / Q-046
Hva er noe du gjerne ville si til noen, men som du holder inne?

KOMMUNIKASJON-07 / Q-047
Hvordan håndterer du det å be om unnskyldning?

KOMMUNIKASJON-08 / Q-048
Hva er din største utfordring i en samtale som går dypt?

KOMMUNIKASJON-09 / Q-049
Hvordan vet du at du virkelig hører på noen?

KOMMUNIKASJON-10 / Q-050
Hva er noe du ønsker at partneren din skal si når dere er uenige?

KOMMUNIKASJON-11 / Q-051
Hvordan snakker du om ting som gjør deg ubehagelig?

KOMMUNIKASJON-12 / Q-052
Hva er noe du har lært om å si nei uten å si nei?

KOMMUNIKASJON-13 / Q-053
Hvordan liker du at noen bekrefter at de har forstått deg?

KOMMUNIKASJON-14 / Q-054
Hva er den vanskeligste samtalen du noen gang har hatt?

KOMMUNIKASJON-15 / Q-055
Hvordan håndterer du det å si at du har rett uten å kjempe for det?

KOMMUNIKASJON-16 / Q-056
Hva er noe du gjør for å åpne deg i en samtale?

KOMMUNIKASJON-17 / Q-057
Hvordan snakker du om pengemål eller økonomi med noen du er sammen med?

KOMMUNIKASJON-18 / Q-058
Hva er noe du hører for ofte i samtaler som du helst ville unngå?

KOMMUNIKASJON-19 / Q-059
Hvordan forteller du noen at du trenger tid uten at de tar det personlig?

KOMMUNIKASJON-20 / Q-060
Hva er noe du lærte om å snakke ærlig som du ikke visste du trengte?

### Kategori 4 – Nærhet & intimitet (id: naerhet)

NAERHET-01 / Q-061
Hvordan snakker du om dine seksuelle ønsker med noen du er nær?

NAERHET-02 / Q-062
Hva trenger du for å føle deg trygg og åpen i sengen?

NAERHET-03 / Q-063
Hva er noe du gjerne ville utforske sammen med en partner?

NAERHET-04 / Q-064
Hvordan liker du at noen berører deg når du ikke er i et intimt øyeblikk?

NAERHET-05 / Q-065
Hva er noe du har lært om din egen kropp som overrasket deg?

NAERHET-06 / Q-066
Hvordan balanserer du mellom åpenhet og personrom i et intimt forhold?

NAERHET-07 / Q-067
Hva er noe du ønsker å høre fra en partner i et intimt øyeblikk?

NAERHET-08 / Q-068
Hvordan snakker du om det du ikke liker uten å krenke?

NAERHET-09 / Q-069
Hva er noe du liker at en partner gjør som får deg til å føle deg sett?

NAERHET-10 / Q-070
Hvordan håndterer du forskjeller i behov mellom dere to?

NAERHET-11 / Q-071
Hva er noe du har lært om seksuell tillit som har endret deg?

NAERHET-12 / Q-072
Hvordan liker du at noen introduserer nye ting i et intimt forhold?

NAERHET-13 / Q-073
Hva er noe du trenger å si for å slappe av i et intimt øyeblikk?

NAERHET-14 / Q-074
Hvordan snakker du om grenser dine uten at det blir konfrontasjonelt?

NAERHET-15 / Q-075
Hva er noe du liker best i et intimt forhold med noen?

NAERHET-16 / Q-076
Hvordan håndterer du det å si nei i et intimt øyeblikk?

NAERHET-17 / Q-077
Hva er noe du gjerne ville dele med en partner om din seksualitet?

NAERHET-18 / Q-078
Hvordan liker du at noen nærmer seg deg fysisk?

NAERHET-19 / Q-079
Hva er noe du har lært om kropp og sinn som overrasket deg?

NAERHET-20 / Q-080
Hvordan snakker du om lengsel når dere er lenger fra hverandre?

### Kategori 5 – Følelser & sårbarhet (id: folelser)

FOLELSER-01 / Q-081
Hva er noe du trenger å tillate deg selv å føle, men ikke alltid gjør?

FOLELSER-02 / Q-082
Hva er noe du gruer deg mest til å slippe?

FOLELSER-03 / Q-083
Hva er noe du er mest redd for å miste?

FOLELSER-04 / Q-084
Hva er noe du er mest takknemlig for, selv om det var vanskelig?

FOLELSER-05 / Q-085
Hva er noe som gjør deg mest sårbar?

FOLELSER-06 / Q-086
Hva er noe du vil tillate deg selv å ønske uten skyldfølelse?

FOLELSER-07 / Q-087
Hva er noe som gjør deg mest stolt?

FOLELSER-08 / Q-088
Hva er noe du vil tillate deg selv å trenge?

FOLELSER-09 / Q-089
Hva er noe som gjør deg mest takknemlig?

FOLELSER-10 / Q-090
Hva er noe du vil slippe, men ennå ikke har?

FOLELSER-11 / Q-091
Hva er noe som gjør deg mest usikker på deg selv?

FOLELSER-12 / Q-092
Hva er noe som gjør deg mest lykkelig?

FOLELSER-13 / Q-093
Hva er noe som gjør deg mest rolig?

FOLELSER-14 / Q-094
Hva er noe som gjør deg mest engstelig?

FOLELSER-15 / Q-095
Hva er noe som gjør deg mest sint?

FOLELSER-16 / Q-096
Hva er noe som gjør deg mest trist?

FOLELSER-17 / Q-097
Hva er noe som gjør deg mest forelsket?

FOLELSER-18 / Q-098
Hva gjør du når du føler at følelsene blir for store?

FOLELSER-19 / Q-099
Hva er noe du trenger å høre når du er på et lavt punkt?

FOLELSER-20 / Q-100
Hvordan tillater du deg selv å være svak i møte med noen du bryr deg om?

### Kategori 6 – Trygghet & grenser (id: trygghet)

TRYGGHET-01 / Q-101
Hva er dine viktigste grenser i et forhold?

TRYGGHET-02 / Q-102
Hvordan vet du at noen respekterer grensene dine?

TRYGGHET-03 / Q-103
Hva er noe du har lært om å si nei uten dårlig samvittighet?

TRYGGHET-04 / Q-104
Hva trenger du for å føle deg trygg nok til å være åpen?

TRYGGHET-05 / Q-105
Hva er noe som bryter din tillit umiddelbart?

TRYGGHET-06 / Q-106
Hvordan håndterer du det å bli satt overrasket i en relasjon?

TRYGGHET-07 / Q-107
Hva er noe du trenger tid til å bli komfortabel med?

TRYGGHET-08 / Q-108
Hvordan snakker du om noe som overgrep deg tidligere?

TRYGGHET-09 / Q-109
Hva er noe du trenger å vite at partneren din ikke vil gjøre?

TRYGGHET-10 / Q-110
Hva er din måte å bygge tillit med noen ny?

TRYGGHET-11 / Q-111
Hva er noe du har lært om å sette deg selv først?

TRYGGHET-12 / Q-112
Hvordan håndterer du det å bli kritisert av noen du bryr deg om?

TRYGGHET-13 / Q-113
Hva er noe du trenger for å føle deg hjemme i en relasjon?

TRYGGHET-14 / Q-114
Hvordan snakker du om noe som ikke er greit for deg?

TRYGGHET-15 / Q-115
Hva er noe du har lært om å være ærlig med grensene dine?

TRYGGHET-16 / Q-116
Hva er noe som får deg til å føle deg mest trygt i en samtale?

TRYGGHET-17 / Q-117
Hvordan håndterer du det å si at noe er feil uten å kjenne deg som den dårlige?

TRYGGHET-18 / Q-118
Hva er noe du trenger å høre for å vite at alt er greit mellom dere?

TRYGGHET-19 / Q-119
Hva er din måte å varsle at noe er feil uten at det blir en konfrontasjon?

TRYGGHET-20 / Q-120
Hva er noe du har lært om å være trygg uten å være stiv?

### Kategori 7 – Lek & humor (id: lek)

LEK-01 / Q-121
Hva er den mest absurde tingen du har falt for?

LEK-02 / Q-122
Hva er noe du alltid latterliggjør hos deg selv?

LEK-03 / Q-123
Hva er en spøk du aldri blir lei av?

LEK-04 / Q-124
Hva er noe du alltid har villet prøve, men aldri har samlet mod?

LEK-05 / Q-125
Hva er noe morsomt du tror mange kan relaterer seg til?

LEK-06 / Q-126
Hva er den rareste ting du har spist og likte det?

LEK-07 / Q-127
Hva er noe du alltid griner av, selv om det ikke er morsomt?

LEK-08 / Q-128
Hva er noe du tror alle har tenkt på men aldri snakker om?

LEK-09 / Q-129
Hva er noe du har gjort og blitt lei deg for?

LEK-10 / Q-130
Hva er noe du håper aldri skjer med deg?

LEK-11 / Q-131
Hva er noe du alltid har villet prøve med en venn?

LEK-12 / Q-132
Hva er noe morsomt du har opplevd på reise?

LEK-13 / Q-133
Hva er noe du tenker på som perfekt for en bestemt anledning?

LEK-14 / Q-134
Hva er noe du alltid har tenkt på, men aldri spurt noen om?

LEK-15 / Q-135
Hva er noe du ville ha gjort som barn men aldri fikk lov til?

LEK-16 / Q-136
Hva er noe du vil prøve selv om du vet du vil være dårlig i?

LEK-17 / Q-137
Hva er noe du alltid vil si ja til, uansett hva?

LEK-18 / Q-138
Hva er noe du alltid vil si nei til, selv om det er morsomt?

LEK-19 / Q-139
Hva er noe som alltid gjør deg glad, uansett hvor dårlig dagen er?

LEK-20 / Q-140
Hva er noe du vil skrive opp på en liste en gang, før det er for sent?

### Kategori 8 – Barndom & røtter (id: barndom)

BARNDOM-01 / Q-141
Hva er noe fra barndommen din som fortsatt preger deg?

BARNDOM-02 / Q-142
Hva var din favorittbeskjeftigelse som barn?

BARNDOM-03 / Q-143
Hva lærte foreldrene dine deg om verden, og hva var de feil i?

BARNDOM-04 / Q-144
Hva er noe du husker fra barndommen som kjentes enormt på den tiden?

BARNDOM-05 / Q-145
Hva er noe du ønsker at noen skulle fortalt deg som liten?

BARNDOM-06 / Q-146
Hva er noe fra familien din som du vil beholde, og noe du vil slippe?

BARNDOM-07 / Q-147
Hvem var personen som ga deg mest trygghet som barn?

BARNDOM-08 / Q-148
Hva er noe du føler at du har arvet fra oppveksten?

BARNDOM-09 / Q-149
Hva er noe du føler at du mistet for tidlig?

BARNDOM-10 / Q-150
Hva var det som kjentes som voksen for deg som barn?

BARNDOM-11 / Q-151
Hva er noe du husker fra barndommen som endret deg?

BARNDOM-12 / Q-152
Hva er noe du aldri har glemt fra skoletiden?

BARNDOM-13 / Q-153
Hva er noe du aldri vil glemme fra barndommen?

BARNDOM-14 / Q-154
Hva er noe du vil gi videre til dine barn, om noen?

BARNDOM-15 / Q-155
Hva er noe fra barndommen som gjør at du er den du er?

BARNDOM-16 / Q-156
Hva er noe du ønsker du kunne fortalt din yngre jeg?

BARNDOM-17 / Q-157
Hva er noe du ble belønnet for som barn?

BARNDOM-18 / Q-158
Hva er noe du ble straffet for som barn?

BARNDOM-19 / Q-159
Hva er noe fra barndommen som du er glad for nå?

BARNDOM-20 / Q-160
Hva er noe du ville ønsket du hadde fått lov til?

### Kategori 9 – Verdier & livsstil (id: verdier)

VERDIER-01 / Q-161
Hva er de tre viktigste verdiene dine?

VERDIER-02 / Q-162
Hva betyr suksess for deg?

VERDIER-03 / Q-163
Hva er noe du alltid vil stå for, uansett konsekvens?

VERDIER-04 / Q-164
Hva er noe du vil ofre mye for?

VERDIER-05 / Q-165
Hva er noe du tror er viktigere enn det folk flest innrømmer?

VERDIER-06 / Q-166
Hva er noe du tror flere bør bry seg mer om?

VERDIER-07 / Q-167
Hva er noe du har måttet velge mellom som definerte deg?

VERDIER-08 / Q-168
Hva er noe du vil leve etter, ikke bare si at du tror på?

VERDIER-09 / Q-169
Hva er noe du mener er rett selv om ingen andre holder med?

VERDIER-10 / Q-170
Hva er noe du vil prioritere over karriere?

VERDIER-11 / Q-171
Hva er noe du tror gir livet mest mening?

VERDIER-12 / Q-172
Hva er noe du vil gjøre annerledes enn det samfunnet forventer?

VERDIER-13 / Q-173
Hva er noe du vil si fra deg i møte med urettferdighet?

VERDIER-14 / Q-174
Hva er noe du vil beskytte, uansett kostnad?

VERDIER-15 / Q-175
Hva er noe du vil bygge i denne verdenen?

VERDIER-16 / Q-176
Hva er noe du vil at verdenen skal lære av deg?

VERDIER-17 / Q-177
Hva er noe du vil at skal være grunnen til at folk er glad i deg?

VERDIER-18 / Q-178
Hva er noe du vil at skal være grunnen til at folk husker deg?

VERDIER-19 / Q-179
Hvordan prioriterer du når to verdier kolliderer?

VERDIER-20 / Q-180
Hva er noe du har endret oppfatning om de siste årene?

### Kategori 10 – Fremtid & drømmer (id: fremtid)

FREMTID-01 / Q-181
Hva ser du for deg det første året i et nytt kapittel?

FREMTID-02 / Q-182
Hva er noe du ønsker å ha oppnådd om fem år som du ikke har nådd ennå?

FREMTID-03 / Q-183
Hvordan vil du at hverdagen din skal se ut om ti år?

FREMTID-04 / Q-184
Hva er en drøm du har latt ligge, men som ennå lever?

FREMTID-05 / Q-185
Hva vil du bli husket for?

FREMTID-06 / Q-186
Hva er noe du trenger å slippe fra deg for å gå mot neste kapittel?

FREMTID-07 / Q-187
Hvordan vil du at forholdet ditt skal utvikle seg over tid?

FREMTID-08 / Q-188
Hva er noe du vil bygge sammen med noen du er glad i?

FREMTID-09 / Q-189
Hva er noe du vil prøve før du føler deg klar for et stort forpliktelser?

FREMTID-10 / Q-190
Hva er noe du tror vil utfordre deg mest i årene som kommer?

FREMTID-11 / Q-191
Hva er noe du vil endre på måten verden fungerer?

FREMTID-12 / Q-192
Hvordan vil du at karrieren din skal se ut om fem år?

FREMTID-13 / Q-193
Hva er noe du vil oppleve i livet, før det er for sent?

FREMTID-14 / Q-194
Hva er noe du tror vil forme deg mest som person i årene som kommer?

FREMTID-15 / Q-195
Hva er noe du vil gi videre til neste generasjon?

FREMTID-16 / Q-196
Hva er noe du vil at partneren din skal være mest glad i med deg?

FREMTID-17 / Q-197
Hva er noe du vil reise rundt, alene eller sammen?

FREMTID-18 / Q-198
Hva er noe du vil skape som varer lenger enn deg selv?

FREMTID-19 / Q-199
Hva er noe du vil endre på i samfunnet?

FREMTID-20 / Q-200
Hva er noe du vil lære deg i løpet av livet?

### Kategori 11 – Hverdag & rutine (id: hverdag)

HVERDAG-01 / Q-201
Hvordan starter du dagen din?

HVERDAG-02 / Q-202
Hva er noe du ikke kan tenke deg å våke opp uten?

HVERDAG-03 / Q-203
Hvordan lader du når du er helt tom for energi?

HVERDAG-04 / Q-204
Hva er din måte å slappe av på når dagen har vært tung?

HVERDAG-05 / Q-205
Hva er noe du gjør hver uke som du ikke ville gi fra deg?

HVERDAG-06 / Q-206
Hvordan håndterer du en dag som har gått helt galt?

HVERDAG-07 / Q-207
Hva er noe du gjør alene som gir deg energi?

HVERDAG-08 / Q-208
Hvordan liker du at en kveld ser ut i et parforhold?

HVERDAG-09 / Q-209
Hva er noe du alltid gjør for å komme deg i gang når du er lat?

HVERDAG-10 / Q-210
Hva er din største svakhet når det gjelder å ta deg selv?

HVERDAG-11 / Q-211
Hva er noe du gjør på en tirsdag kveld når ingen ser?

HVERDAG-12 / Q-212
Hvordan håndterer du stress i hverdagen?

HVERDAG-13 / Q-213
Hva er noe du ikke kan stå for i en bolig?

HVERDAG-14 / Q-214
Hva er din måte å si at du trenger litt tid alene?

HVERDAG-15 / Q-215
Hva er noe du alltid tar med deg på reise?

HVERDAG-16 / Q-216
Hvordan liker du at en morgen ser ut når dere er sammen?

HVERDAG-17 / Q-217
Hva er noe du gjør for å takke kroppen din for en hard dag?

HVERDAG-18 / Q-218
Hva er noe du alltid har lyst til å prøve, men som du aldri får til?

HVERDAG-19 / Q-219
Hvordan liker du å feire en liten seier i hverdagen?

HVERDAG-20 / Q-220
Hva er noe du ikke lenger tål i en relasjon som du tidlig tålte?

### Kategori 12 – Moden nysgjerrighet (id: moden)

MODEN-01 / Q-221
Hva er noe du lurer på om meg som du ikke har turte å spørre?

MODEN-02 / Q-222
Hva er noe du lurer på om din egen fortid som du ønsker å forstå?

MODEN-03 / Q-223
Hva er noe du lurer på om hvordan vi vil fungere sammen i en vanskelig situasjon?

MODEN-04 / Q-224
Hva er noe du lurer på om din måte å elske som du ikke er sikker på?

MODEN-05 / Q-225
Hva er noe du lurer på om hva som skjer når vi ikke er perfekte for hverandre?

MODEN-06 / Q-226
Hva er noe du lurer på om hvordan vi skal navigere i ulike behov?

MODEN-07 / Q-227
Hva er noe du lurer på om din måte å behandle meg når du er sint?

MODEN-08 / Q-228
Hva er noe du lurer på om hva som betyr mest for deg i et langvarig forhold?

MODEN-09 / Q-229
Hva er noe du lurer på om hvordan vi skal snakke om ting som er vanskelig?

MODEN-10 / Q-230
Hva er noe du lurer på om din måte å vise at du bryr deg?

MODEN-11 / Q-231
Hva er noe du lurer på om hvordan vi skal håndtere at vi endres over tid?

MODEN-12 / Q-232
Hva er noe du lurer på om din måte å bygge tillit?

MODEN-13 / Q-233
Hva er noe du lurer på om hvordan vi skal balansere nærhet og personrom?

MODEN-14 / Q-234
Hva er noe du lurer på om din måte å feire oss som et par?

MODEN-15 / Q-235
Hva er noe du lurer på om hvordan vi skal snakke om penger uten at det blir stress?

MODEN-16 / Q-236
Hva er noe du lurer på om din måte å håndtere at noen ganger har vi ulike behov?

MODEN-17 / Q-237
Hva er noe du lurer på om hvordan vi skal vokse sammen uten å miste oss selv?

MODEN-18 / Q-238
Hva er noe du lurer på om din måte å si at du er lei og trenger en pause?

MODEN-19 / Q-239
Hva er noe du lurer på om hvordan vi skal holde det levende i en lang relasjon?

MODEN-20 / Q-240
Hva er noe du lurer på om din måte å si nei når du trenger å si nei?

## D. Oppgaver

### Kategori 1 – Kunne-vil-du-si (id: kunne-vil-du-si)

KUNNE-VIL-DU-SI-01 / TASK-001
Kunne du leve en uke uten musikk, eller en uke uten kaffe?

KUNNE-VIL-DU-SI-02 / TASK-002
Kunne du jobbe helt alene i en fjellhytte i én måned, eller bo i en storby med null vennskap?

KUNNE-VIL-DU-SI-03 / TASK-003
Kunne du spise den samme maten hver dag i to uker, eller aldri få velge hva du spiser igjen?

KUNNE-VIL-DU-SI-04 / TASK-004
Kunne du si nei til alle sosiale planer i en måned, eller være på en fest hver fredag i to år?

KUNNE-VIL-DU-SI-05 / TASK-005
Kunne du ha et yrke du elsket men som betalt dårlig, eller et yrke som betalt bra men kjedsommelig?

KUNNE-VIL-DU-SI-06 / TASK-006
Kunne du reise alene til et land du ikke snakker språket i, eller aldri forlate hjemlandet?

KUNNE-VIL-DU-SI-07 / TASK-007
Kunne du dele alt du tenkte høyt med alle, eller aldri vite hva noen andre tenkte?

KUNNE-VIL-DU-SI-08 / TASK-008
Kunne du ha en uke der alt du ønsket ble nektet, eller en uke der du aldri måtte si nei?

KUNNE-VIL-DU-SI-09 / TASK-009
Kunne du jobbe 12 timer om dagen men velge helt selv hva, eller 4 timer men være underlagt andres planer?

KUNNE-VIL-DU-SI-10 / TASK-010
Kunne du bo i et hus uten internett i ett år, eller ha internett men bo i en leilighet på 20 kvm?

KUNNE-VIL-DU-SI-11 / TASK-011
Kunne du fortelle alle dine hemmeligheter en gang, eller aldri vite andres?

KUNNE-VIL-DU-SI-12 / TASK-012
Kunne du ha en dag der du aldri kom deg ut av huset, eller en dag der du aldri kom hjem?

KUNNE-VIL-DU-SI-13 / TASK-013
Kunne du ta bort alle dine vaner i én dag, eller bli tvunget til å gjøre dem dobbelt så ofte i én måned?

KUNNE-VIL-DU-SI-14 / TASK-014
Kunne du alltid vite hva klokka var uten klokker, eller aldri vite hva dag i uka det er?

KUNNE-VIL-DU-SI-15 / TASK-015
Kunne du være helt ærlig i én uke om alt, eller alltid si det du tror andre vil høre i ett år?

### Kategori 2 – Fortell meg om (id: fortell-meg-om)

FORTELL-MEG-OM-01 / TASK-016
Fortell meg ditt beste minne fra en ukeend du aldri glemmer.

FORTELL-MEG-OM-02 / TASK-017
Fortell meg om en fremmed du møtte som endret noe i deg.

FORTELL-MEG-OM-03 / TASK-018
Fortell meg om en gang du var helt alene og det føltes som mest tilstrekkelig.

FORTELL-MEG-OM-04 / TASK-019
Fortell meg om en matrett som alltid tar deg tilbake til noen.

FORTELL-MEG-OM-05 / TASK-020
Fortell meg om et sted i verden der du føler deg helt hjemme.

FORTELL-MEG-OM-06 / TASK-021
Fortell meg om en gang du sa ja og det endte med å bli det beste valget.

FORTELL-MEG-OM-07 / TASK-022
Fortell meg om en person som alltid visste hvordan de skulle få deg til å le.

FORTELL-MEG-OM-08 / TASK-023
Fortell meg om en kveld der du gledet deg så høyt at du nesten gråt.

FORTELL-MEG-OM-09 / TASK-024
Fortell meg om en gang du oppdaget noe om deg selv du ikke visste før.

FORTELL-MEG-OM-10 / TASK-025
Fortell meg om en sang som alltid tar deg tilbake til et øyeblikk.

FORTELL-MEG-OM-11 / TASK-026
Fortell meg om en gang du var redd, men gjorde det allikevel.

FORTELL-MEG-OM-12 / TASK-027
Fortell meg om en gave du mottok som betydde mer enn du sa det betydde.

FORTELL-MEG-OM-13 / TASK-028
Fortell meg om en stund du satt helt stille og bare var lykkelig uten å vite hvorfor.

FORTELL-MEG-OM-14 / TASK-029
Fortell meg om en gang du hjalp noen og det endret deg.

FORTELL-MEG-OM-15 / TASK-030
Fortell meg om et lite ritual du har med deg som ingen andre vet om.

### Kategori 3 – Hvis du... (id: hvis-du)

HVIS-DU-01 / TASK-031
Hvis du kunne teleportere til et sted i verden akkurat nå — hvor, og hvorfor?

HVIS-DU-02 / TASK-032
Hvis du kunne ha en superkraft bare i dag, hvilken ville du velge?

HVIS-DU-03 / TASK-033
Hvis du kunne spise med én person fra fortiden (død eller levende), hvem og hva ville dere snakke om?

HVIS-DU-04 / TASK-034
Hvis du kunne starte på nytt i et annet yrke i morgen, hva ville det være?

HVIS-DU-05 / TASK-035
Hvis du fikk en time der ingen kunne ringe deg — hva ville du gjøre med den?

HVIS-DU-06 / TASK-036
Hvis du kunne skrive et brev til deg selv for ti år siden, hva ville du skrive?

HVIS-DU-07 / TASK-037
Hvis du kunne lage en perfekt fredag kveld, hvordan ville den se ut? Klokke for klokke.

HVIS-DU-08 / TASK-038
Hvis du kunne ha et hus hvor som helst i verden, hvilken stil og hvilken plass?

HVIS-DU-09 / TASK-039
Hvis du kunne møte en person i dag som ikke kan møte deg tilbake, hvem ville det være og hva ville du si?

HVIS-DU-10 / TASK-040
Hvis du hadde ubegrenset tid, men begrenset penger — hva ville du gjøre i neste uke?

HVIS-DU-11 / TASK-041
Hvis du kunne endre én ting ved måten folk hilsner på hverandre, hva ville det være?

HVIS-DU-12 / TASK-042
Hvis du kunne bo i et rom uten at noen andre hadde tilgang til det — hvilket rom, og hvorfor?

HVIS-DU-13 / TASK-043
Hvis du kunne lage en regel for hele verden som alle måtte følge i én uke, hvilken regel?

HVIS-DU-14 / TASK-044
Hvis du kunne ha en uke der ingen ville vite hva du gjør, hva ville du gjøre?

HVIS-DU-15 / TASK-045
Hvis du kunne sende en melding til alle som noengang har såret deg, hva ville du skrive?

### Kategori 4 – To sannheter, en løgn (id: to-sannheter)

TO-SANNHETER-01 / TASK-046
Del to sannheter om deg selv og én du har oppfunnet. Jeg gjetter hvilken som er løgna.

TO-SANNHETER-02 / TASK-047
Fortell meg tre ting om barndommen din — men én av dem er helt oppfunnet. Hvilken er den?

TO-SANNHETER-03 / TASK-048
Gi meg to ekte reiseminner og én du fant på. Kan du lure meg?

TO-SANNHETER-04 / TASK-049
Nevn tre ting du har lyst til å si til meg, men én av dem er oppfunnet. Gjetter du?

TO-SANNHETER-05 / TASK-050
Fortell meg tre ting jeg ikke vet om deg. Én er feil. Kan du finne løgna?

TO-SANNHETER-06 / TASK-051
Del tre fakta om karrieren din. Én er oppfunnet. Hvor er løgna?

TO-SANNHETER-07 / TASK-052
Fortell meg tre matpreferanser. Én lyver. Kan du spotte den?

TO-SANNHETER-08 / TASK-053
Gi meg tre ting om hvordan du bruker en lørdag. Én er ikke sant. Hvilken?

TO-SANNHETER-09 / TASK-054
Fortell meg tre hobbyer du driver med. Én er oppfunnet. Gjetter du riktig?

TO-SANNHETER-10 / TASK-055
Nevn tre steder du har bodd. Én er ikke ekte. Kan du finne den?

TO-SANNHETER-11 / TASK-056
Del tre ting om hvordan du ser ut (klokketrikk, tilbehør, tatovering...). Én er feil. Gjetter du?

TO-SANNHETER-12 / TASK-057
Fortell meg tre ting du har lært å gjøre. Én har du aldri gjort. Hvilken?

TO-SANNHETER-13 / TASK-058
Gi meg tre fakta om familien din. Én er oppfunnet. Kan du lure meg?

TO-SANNHETER-14 / TASK-059
Fortell meg tre ting om hvordan du sover. Én er ikke sant. Hvilken?

TO-SANNHETER-15 / TASK-060
Nevn tre ting du er ekstremt god på. Én er du ikke god på. Gjetter du?

### Kategori 5 – Sang som beskriver deg (id: sang)

SANG-01 / TASK-061
Velg en sang som beskriver deg i dag. Hvilken, og hvorfor nettopp den?

SANG-02 / TASK-062
Hvilken sang ville du spilt hvis noen skulle ha filmet en dag i livet ditt?

SANG-03 / TASK-063
Hvilken artist ville du hatt som gjest på en bursdagsfest bare for deg to?

SANG-04 / TASK-064
Hva er den første sangen du synger når du er alene i bilen?

SANG-05 / TASK-065
Hvilken sang får deg alltid til å grine? Og hvorfor?

SANG-06 / TASK-066
Hvis livet ditt var et album, hva ville tittelen være? Og hvilken låt er du akkurat nå?

SANG-07 / TASK-067
Hvilken sang hører du når du er i dårlig humør, og hva gjør den med deg?

SANG-08 / TASK-068
Hvis du kunne lage en spilleliste med bare tre låter som beskriver deg, hvilke tre?

SANG-09 / TASK-069
Hvilken sang vil du at partneren din hører når dere er sammen? Og hvorfor den?

SANG-10 / TASK-070
Hva er en sang du har danset til alene i kjøkkenet? (Ja, jeg vet alle gjør det.)

SANG-11 / TASK-071
Hvilken sang får deg til å lukke øynene og kjenne noe dypt i kroppen?

SANG-12 / TASK-072
Hvis du skulle anbefale én sang til meg for å forstå deg, hvilken ville det være?

SANG-13 / TASK-073
Hvilken artist vil du at alle bør bli kjent med, men som de fleste har gått glipp av?

SANG-14 / TASK-074
Hva er en sang du hørte som barn og som fortsatt får deg til å kjenne noe?

SANG-15 / TASK-075
Hvis du kunne ha en signatur-sang som spilte hver gang du gikk inn i et rom, hvilken ville det være?

### Kategori 6 – Uventet om meg (id: uventet)

UVENTET-01 / TASK-076
Hva er noe om deg som ingen i ditt nære miljø vet?

UVENTET-02 / TASK-077
Hva er en feiloppfatning folk har om deg som du aldri har rettet?

UVENTET-03 / TASK-078
Hva er den merkeligeste tingen du har en liten fetish for? (Kan være saft, skosnore, eller kaffe.)

UVENTET-04 / TASK-079
Hva er noe du kan gjøre ekstremt godt som du aldri ville tenke på å bryste deg av?

UVENTET-05 / TASK-080
Hva er noe du er overraskende dårlig på, men som folk antar du er bra på?

UVENTET-06 / TASK-081
Hva er den mest overraskende reaksjonen du noen gang har hatt i en helt vanlig situasjon?

UVENTET-07 / TASK-082
Hva er noe du har endret mening om så ofte at du ikke lenger er sikker på hva du tror?

UVENTET-08 / TASK-083
Hva er en ting du gjorde som barn som du nå forlater deg selv å gjenta?

UVENTET-09 / TASK-084
Hva er noe du er stolt av, men som ville virket helt idiotisk for en fremmed?

UVENTET-10 / TASK-085
Hva er den verste tingen du har fortalt en fremmed for å virke smartere?

UVENTET-11 / TASK-086
Hva er noe du har en uforholdsmessig sterk mening om som ingen andre bryr seg om?

UVENTET-12 / TASK-087
Hva er noe du frykter at folk syns er rart, men som du liker?

UVENTET-13 / TASK-088
Hva er en ting du har prøvd å slutte med i tre år, men aldri klart?

UVENTET-14 / TASK-089
Hva er noe du har grinet over som du aldri har fortalt noen?

UVENTET-15 / TASK-090
Hva er den overraskende tingen du er mest takknemlig for i livet ditt?

### Kategori 7 – Nordisk kveld (id: nordisk-kveld)

NORDISK-KVELD-01 / TASK-091
Velg: peis, stearinlys, eller taklys til kvelden. Motiver på ett ord.

NORDISK-KVELD-02 / TASK-092
Hvem lager kaffe og hvem lager maten til fredagskos? (Svar: meg / deg / skift)

NORDISK-KVELD-03 / TASK-093
Design den perfekte norske ukeend for oss to — i akkurat 5 ord.

NORDISK-KVELD-04 / TASK-094
Regnet slår i ruten, det er onsdag kveld. Hva gjør vi? Du starter, jeg tar over.

NORDISK-KVELD-05 / TASK-095
Velg én ting: varm kaffe, te med honning, eller kakao. Fortell meg hva du serverer meg og hvorfor.

NORDISK-KVELD-06 / TASK-096
Vi har én time på oss. Ingen telefoner. Hva gjør vi? Beskriv i to setninger.

NORDISK-KVELD-07 / TASK-097
Velg: tynn pels, ullgenser, eller dunjakke til en tur ut. Og — går vi i skogen, langs elven, eller i byen?

NORDISK-KVELD-08 / TASK-098
Du lager maten, jeg vasker opp. (Eller omvendt.) Hva lager du? Og — er det enrett eller toretter?

NORDISK-KVELD-09 / TASK-099
Velg lyset: fullt slukket, halvt, eller fullt på. Og — er det rolig eller festet stemning i huset?

NORDISK-KVELD-10 / TASK-100
Vi sitter på balkongen med to krus. Det er stille. Hva sier du først?

NORDISK-KVELD-11 / TASK-101
Velg: film, brettspill, eller bare å snakke. Og — hvem velger hva, eller om det er film?

NORDISK-KVELD-12 / TASK-102
Design vår lille hyttetur: én natt, én dag. Hva tar vi med, og hva gjør vi?

NORDISK-KVELD-13 / TASK-103
Velg én matrett vi lager sammen. Du starter med hovedretten, jeg tar desserten.

NORDISK-KVELD-14 / TASK-104
Det er torsdag. Klokka 19. Du har kontroll. Hva skjer de neste 3 timene?

NORDISK-KVELD-15 / TASK-105
Velg: vi lager mat sammen, bestiller, eller spiser noe rart og nytt. Du starter, jeg følger.

### Kategori 8 – Gjetter du meg? (id: gjetter-du-meg)

GJETTER-DU-MEG-01 / TASK-106
Jeg tenker på et ord som beskriver dagen min. Du gjetter på 5 forsøk. Hver gjetting får en ledetråd.

GJETTER-DU-MEG-02 / TASK-107
Ranger disse fra 1–10 uten å se på meg: min kaffestyrke i dag, mitt morgenhumør, mitt energinivå.

GJETTER-DU-MEG-03 / TASK-108
Hvilken av disse er mitt humør akkurat nå? A) 'Landsby' B) 'Stum di' C) 'Dance Monkey'. Gjetter du?

GJETTER-DU-MEG-04 / TASK-109
Jeg tenker på en matrett. Du får tre ledetråder fra meg. Hvilken er det?

GJETTER-DU-MEG-05 / TASK-110
Gjetter du hvilken dag i uken jeg er mest meg selv? Du har to forsøk.

GJETTER-DU-MEG-06 / TASK-111
Jeg velger tre ord som beskriver meg i dag. Du gjetter hvilket av dem jeg liker minst. Gjetter du?

GJETTER-DU-MEG-07 / TASK-112
Du gjetter hvor mange krus kaffe jeg har hatt i dag. Maks 5 forsøk, jeg svarer bare 'høyere' eller 'lavere'.

GJETTER-DU-MEG-08 / TASK-113
Jeg tenker på et sted i Norge. Du gjetter hvilket, med kun ja/nei-spørsmål. Maks 7.

GJETTER-DU-MEG-09 / TASK-114
Ranger: min motivasjon i dag, mitt tålmodighetsnivå, mitt lystenivå på å le. Du starter.

GJETTER-DU-MEG-10 / TASK-115
Jeg skriver et ord. Du gjetter hvilken følelse det uttrykker. Jeg forteller deg om jeg har rett.

GJETTER-DU-MEG-11 / TASK-116
Du gjetter hvilket år jeg ble født. Du får tre ledetråder fra meg etter hvert forsøk.

GJETTER-DU-MEG-12 / TASK-117
Jeg tenker på en aktivitet jeg gjorde i går. Du gjetter hva det var. Ja/nei-spørsmål, maks 5.

GJETTER-DU-MEG-13 / TASK-118
Ranger mine tre favorittsesonger fra varmest til kuldest i humør. Du starter.

GJETTER-DU-MEG-14 / TASK-119
Du gjetter hva jeg spiste til lunsj i dag. Du får én ledetråd før hvert forsøk. Maks 3.

GJETTER-DU-MEG-15 / TASK-120
Jeg velger et sted. Du gjetter om det er i Norge eller i utlandet. Deretter: nord, syd, øst, vest. Maks 4.

### Kategori 9 – Bygg en historie (id: bygg-en-historie)

BYGG-EN-HISTORIE-01 / TASK-121
Vi bygger en historie. Du starter med én setning. Jeg fortsetter. Siste som blir seriøs har tapt.

BYGG-EN-HISTORIE-02 / TASK-122
Beskriv vår perfekte lørdag i akkurat 7 ord. Gå. (Bare 7.)

BYGG-EN-HISTORIE-03 / TASK-123
Lag en norsk film i 5 setninger sammen. Du starter med tittelen. Jeg tar neste.

BYGG-EN-HISTORIE-04 / TASK-124
Fortell meg en historie der hovedpersonen er en kaffekopp. Du starter.

BYGG-EN-HISTORIE-05 / TASK-125
Vi bygger en ukeend. Du skriver mandag, jeg skriver tirsdag, du onsdag, jeg torsdag … Siste som sier 'og så døde de' vinner.

BYGG-EN-HISTORIE-06 / TASK-126
Du starter: 'Det var en gang to nordmenn som...' Fortsett. Jeg tar neste setning.

BYGG-EN-HISTORIE-07 / TASK-127
Lag en oppskrift på vår perfekte kveld. Du starter med hovedingrediensen. Jeg tar neste.

BYGG-EN-HISTORIE-08 / TASK-128
Vi bygger en sang. Du starter med vers 1 (to linjer). Jeg tar vers 2. Refrengets: begge synger.

BYGG-EN-HISTORIE-09 / TASK-129
Du skriver en setning som begynner med 'Og så...'. Jeg fortsetter. Fortsett i 6 setninger totalt.

BYGG-EN-HISTORIE-10 / TASK-130
Lag et kort eventyr der hovedpersonene er vi to. Du starter. Maks 5 setninger hver.

BYGG-EN-HISTORIE-11 / TASK-131
Vi bygger en ukeend som bare går galt. Du starter med fredag. Jeg tar lørdag. Du søndag.

BYGG-EN-HISTORIE-12 / TASK-132
Du skriver én setning om morgenen min. Jeg skriver én setning om kvelden din. Siste som sier 'og så sov de' vinner.

BYGG-EN-HISTORIE-13 / TASK-133
Lag en ny norsk tradisjon i 3 setninger. Du starter med navnet. Jeg tar beskrivelsen.

BYGG-EN-HISTORIE-14 / TASK-134
Vi bygger en dag i livet til en nabo. Du starter med kl. 07:00. Jeg tar neste tidspunkt.

BYGG-EN-HISTORIE-15 / TASK-135
Du starter: 'Dagen begynte helt vanlig, men...' Jeg fortsetter. Fortsett til en av oss sier 'det var det. full stopp.'

## E. Mulige eksakte duplikater

Ingen eksakte duplikater funnet i Bli-kjent (0) eller Oppgaver (0).

## F. Mulige tydelige near-duplicates

### Bli kjent

_Heuristik: (a) identisk tekst etter lower-casing/punktum/whitespace-normalisering; (b) ulike tekster med felles normalisert 50-teikens prefiks._

- VERDIER-17 / Q-177: «Hva er noe du vil at skal være grunnen til at folk er glad i deg?»  |  VERDIER-18 / Q-178: «Hva er noe du vil at skal være grunnen til at folk husker deg?»
- MODEN-09 / Q-229: «Hva er noe du lurer på om hvordan vi skal snakke om ting som er vanskelig?»  |  MODEN-15 / Q-235: «Hva er noe du lurer på om hvordan vi skal snakke om penger uten at det blir stress?»

## G. Uncertain content sources

1. **`/api/questions` (DB-rute) + `QuestionCategory`/`GuidedQuestion`-tabeller + `prisma/seed-guided-questions.ts`** — live-rute, men **ingen runtime-UI-konsumenter** (verken BliKjentPanel eller /questions-siden henter fra den; e2e-tester traff den). Datsettet i DB er parallelt/legacy og INGE del av bli-kennt-flyten; ikke tatt med i hovedinventaret.
2. **`app/questions/page.tsx`** header-kommentar sier «8 kategorier» — utdatert kommentar; datafilen (12 kategorier) er autoritativ.
3. Ingen andre uklassifiserte kilder funnet: JourneyDayContent, 48-timersimpulser, systemmeldinger, onboarding, matching-spørsmål, dealbreakers, mood-farger, FAQ og journey-prompts er ekskludert per direktiv (de bor i egne filer: `lib/journey/*`, `app/onboarding/*` osv.).

## H. Extraction verification

Metode: dokumentet ble re-parses maskinelt (kategori-blokk for kategori-blokk); hvert elements tekst sammenlignes **nøyaktig** (kar-til-kar) mot canonical source i opprinnelig rekkefølge, inkludert globalt nummer-continuuty.

### Bli kjent — per kategori

personlighet: source=20, document=20 PASS
forhold: source=20, document=20 PASS
kommunikasjon: source=20, document=20 PASS
naerhet: source=20, document=20 PASS
folelser: source=20, document=20 PASS
trygghet: source=20, document=20 PASS
lek: source=20, document=20 PASS
barndom: source=20, document=20 PASS
verdier: source=20, document=20 PASS
fremtid: source=20, document=20 PASS
hverdag: source=20, document=20 PASS
moden: source=20, document=20 PASS
BLI KJENT TOTAL: source=240, document=240 PASS

Global numbering (Q-001…Q-240): PASS

### Oppgaver — per kategori

kunne-vil-du-si: source=15, document=15 PASS
fortell-meg-om: source=15, document=15 PASS
hvis-du: source=15, document=15 PASS
to-sannheter: source=15, document=15 PASS
sang: source=15, document=15 PASS
uventet: source=15, document=15 PASS
nordisk-kveld: source=15, document=15 PASS
gjetter-du-meg: source=15, document=15 PASS
bygg-en-historie: source=15, document=15 PASS
OPPGAVER TOTAL: source=135, document=135 PASS

Global numbering (TASK-001…TASK-135): PASS

**OVERALL: PASS** — source count = document count for both sets, per category and in total; no items missing, duplicated by extraction, swapped between categories, or rewritten.
