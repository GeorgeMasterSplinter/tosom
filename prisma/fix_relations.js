const fs = require('fs');
const p = '/home/george/tosom/prisma/schema.prisma';
let s = fs.readFileSync(p, 'utf8');
s = s.replace(
  '  conversation       Conversation @relation(fields: [conversationId], references: [id])',
  '  conversation       Conversation @relation(fields: [conversationId], references: [id])\n  user               User     @relation(fields: [senderId], references: [id])\n  match              Match    @relation(fields: [matchId], references: [id])'
);
s = s.replace(
  '  expiresOn          DateTime\n  createdAt          DateTime @default(now())',
  '  expiresOn          DateTime\n  user               User     @relation(fields: [userId], references: [id])\n  createdAt          DateTime @default(now())',
  1
);
s = s.replace(
  '  match              Match    @relation(fields: [matchId], references: [id])\n  @@index([matchId])',
  '  match              Match    @relation(fields: [matchId], references: [id])\n  user               User     @relation(fields: [userId], references: [id])\n  @@index([matchId])',
  1
);
s = s.replace(
  '  @@unique([userAId, userBId])\n  @@index([status])',
  '  @@unique([userAId, userBId])\n  conversations        Conversation[]\n  @@index([status])'
);
fs.writeFileSync(p, s);
console.log('Relations fixed successfully');
