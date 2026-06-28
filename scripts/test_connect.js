const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.$connect()
  .then(() => p.$queryRaw`SELECT version()`)
  .then(r => { console.log('DB connected OK:', Object.keys(r[0]).join(',')); p.$disconnect(); process.exit(0); })
  .catch(e => { console.error('ERROR:', e.message); p.$disconnect(); process.exit(1); });
