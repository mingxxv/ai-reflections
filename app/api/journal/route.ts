import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * MOCK BACKEND - Journal API Route
 *
 * This is a temporary mock backend that stores journal entries in a JSON file.
 *
 * TODO - FUTURE INTEGRATION:
 * Replace this mock implementation with a real database integration:
 *
 * 1. Database Options:
 *    - PostgreSQL with Prisma ORM
 *    - MongoDB with Mongoose
 *    - Supabase (PostgreSQL with built-in auth)
 *    - Firebase Firestore
 *
 * 2. Schema Design (example with Prisma):
 *    model JournalEntry {
 *      id        String   @id @default(cuid())
 *      userId    String   // Add user authentication
 *      title     String?
 *      content   String
 *      createdAt DateTime @default(now())
 *      updatedAt DateTime @updatedAt
 *    }
 *
 * 3. Authentication:
 *    - Add user authentication (NextAuth.js, Clerk, Supabase Auth)
 *    - Filter entries by userId
 *    - Secure API routes with auth middleware
 *
 * 4. API Improvements:
 *    - Add pagination for GET requests
 *    - Add search/filter capabilities
 *    - Add tags/categories
 *    - Add validation with Zod
 */

interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Path to mock JSON file storage
const MOCK_DB_PATH = path.join(process.cwd(), 'data', 'journals.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read all journal entries from mock storage
async function readJournals(): Promise<JournalEntry[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(MOCK_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Write journal entries to mock storage
async function writeJournals(journals: JournalEntry[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(MOCK_DB_PATH, JSON.stringify(journals, null, 2));
}

// GET - Fetch all journal entries
export async function GET() {
  try {
    const journals = await readJournals();

    // Sort by most recent first
    journals.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ journals, count: journals.length });
  } catch (error) {
    console.error('Error fetching journals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journals' },
      { status: 500 }
    );
  }
}

// POST - Create a new journal entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (content.trim().length < 10) {
      return NextResponse.json(
        { error: 'Content must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Read existing journals
    const journals = await readJournals();

    // Create new entry
    const newEntry: JournalEntry = {
      id: generateId(),
      title: title?.trim() || undefined,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to array
    journals.push(newEntry);

    // Save to mock storage
    await writeJournals(journals);

    return NextResponse.json(
      {
        message: 'Journal entry saved successfully',
        entry: newEntry
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving journal:', error);
    return NextResponse.json(
      { error: 'Failed to save journal entry' },
      { status: 500 }
    );
  }
}

// Simple ID generator (replace with UUID in production)
function generateId(): string {
  return `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
