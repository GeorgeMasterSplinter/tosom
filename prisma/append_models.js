const fs = require('fs');
const path = '/home/george/tosom/prisma/gen_schema.js';
let code = fs.readFileSync(path, 'utf8');

const additional = `
// SystemLog Model
p('model SystemLog {');
p('  id                 String   @id @default(cuid())');
p('  level              String');
p('  message            String');
p('  module             String?');
p('  metadata           String?');
p('  createdAt          DateTime @default(now())');
p('  @@index([level])');
p('  @@index([module])');
p('  @@index([createdAt])');
p('}');
p('');

// PerformanceMetric Model
p('model PerformanceMetric {');
p('  id                 String   @id @default(cuid())');
p('  route              String');
p('  metric             String');
p('  valueMs            Int');
p('  createdAt          DateTime @default(now())');
p('  @@index([route])');
p('  @@index([metric])');
p('  @@index([createdAt])');
p('}');
p('');

// Account Model (NextAuth)
p('model Account {');
p('  id                 String  @id @default(cuid())');
p('  userId             String');
p('  type               String');
p('  provider           String');
p('  providerAccountId  String');
p('  refresh_token      String?');
p('  access_token       String?');
p('  expires_at         Int?');
p('  token_type         String?');
p('  scope              String?');
p('  id_token           String?');
p('  session_state      String?');
p('  user               User    @relation(fields: [userId], references: [id], onDelete: Cascade)');
p('  @@unique([provider, providerAccountId])');
p('  @@index([userId])');
p('}');
p('');

// Session Model (NextAuth)
p('model Session {');
p('  id                 String   @id @default(cuid())');
p('  userId             String');
p('  sessionToken       String   @unique');
p('  expires            DateTime');
p('  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)');
p('}');
p('');

// VerificationToken Model (NextAuth)
p('model VerificationToken {');
p('  identifier         String');
p('  token              String   @unique');
p('  expires            DateTime');
p('  @@unique([identifier, token])');
p('}');
p('');

// MatchInsight Model
p('model MatchInsight {');
p('  id                 String   @id @default(cuid())');
p('  matchId            String   @unique');
p('  summary            String');
p('  strengths          String');
p('  clarity            String');
p('  starter            String');
p('  model              String?');
p('  tokensOut          Int      @default(0)');
p('  createdAt          DateTime @default(now())');
p('  updatedAt          DateTime @updatedAt');
p('  match              Match    @relation(fields: [matchId], references: [id])');
p('  @@index([matchId])');
p('  @@index([createdAt])');
p('}');
p('');

// RateLimitLog Model
p('model RateLimitLog {');
p('  id                 String   @id @default(cuid())');
p('  userId             String?');
p('  route              String');
p('  createdAt          DateTime @default(now())');
p('  @@index([userId])');
p('  @@index([route])');
p('  @@index([createdAt])');
p('}');
p('');

// AIRequestLog Model
p('model AIRequestLog {');
p('  id                 String   @id @default(cuid())');
p('  userId             String');
p('  feature            String');
p('  model              String');
p('  tokensIn           Int');
p('  tokensOut          Int');
p('  latencyMs          Int');
p('  success            Boolean');
p('  traceId            String?');
p('  createdAt          DateTime @default(now())');
p('  @@index([userId])');
p('  @@index([feature])');
p('  @@index([createdAt])');
p('}');
p('');

// Write the file
fs.writeFileSync('/home/george/tosom/prisma/schema.prisma', L.join('\\n') + '\\n');
console.log('Schema written successfully');
console.log('Lines:', L.length);
`;

fs.writeFileSync(path, code + additional);
console.log('appended successfully');
