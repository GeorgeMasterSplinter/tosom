// app/api/chat/image/route.ts — POST /api/chat/image
// Handsamar fil-opplasting for bilete i chat
// Lagrar til public/uploads/images/{conversationId}/{uuid}.{ext}

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';
import path from 'path';

export const dynamic = 'force-dynamic';

// Maks filstorleik: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Accepterte bilete-typar
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Utvidingar map
const EXT_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

/**
 * POST /api/chat/image
 * 
 * Body: FormData
 *   - file: File (max 5MB, image/jpeg/png/webp)
 *   - conversationId: string
 *   - senderId: string
 * 
 * Response: { success: true, imageUrl: string }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Hent FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const conversationId = formData.get('conversationId') as string;
    const senderId = formData.get('senderId') as string;

    // Valider fil
    if (!file) {
      return NextResponse.json(
        { error: 'Ingen fil funnen' },
        { status: 400 }
      );
    }

    // Valider bilete-type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Ugyldig bilete-type. Berre JPG, PNG og WebP er tillatne.' },
        { status: 400 }
      );
    }

    // Valider filstorleik
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fila er for stor. Maks 5 MB.' },
        { status: 400 }
      );
    }

    // Valider conversationId og senderId
    if (!conversationId || !senderId) {
      return NextResponse.json(
        { error: 'Manglande conversationId eller senderId' },
        { status: 400 }
      );
    }

    // Generer trygt filnamn med UUID
    const ext = EXT_MAP[file.type];
    const uuid = randomUUID();
    const fileName = `${uuid}${ext}`;

    // Sikker mappesti — berre i public/uploads/images/{conversationId}/
    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', 'images', conversationId);
    
    // Sikkerheit: forsikre oss om at uploadDir startar med forventa prefix
    if (!uploadDir.startsWith(path.resolve(process.cwd(), 'public', 'uploads'))) {
      return NextResponse.json(
        { error: 'Ugyldig opplastingsmappe' },
        { status: 400 }
      );
    }

    // Opprett mappe dersom han ikkje eksisterer
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    // Konverter File til Buffer og lagrar
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await writeFile(filePath, buffer);

    // Returnerer relativ URL (tilgjengeleg frå nettverket)
    const imageUrl = `/uploads/images/${conversationId}/${fileName}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName,
      size: file.size,
      type: file.type,
    });

  } catch (error) {
    console.error('[chat/image] Feil ved opplastning:', error);
    return NextResponse.json(
      { error: 'Kunne ikkje lagre bilete', details: (error as Error).message },
      { status: 500 }
    );
  }
}