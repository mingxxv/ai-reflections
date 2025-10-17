import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const pdfsDirectory = path.join(process.cwd(), 'PDFs');

    // Check if PDFs directory exists
    try {
      await fs.access(pdfsDirectory);
    } catch {
      return NextResponse.json({ pdfs: [] });
    }

    // Read all files from PDFs directory
    const files = await fs.readdir(pdfsDirectory);

    // Filter for PDF files only
    const pdfFiles = files.filter(file =>
      file.toLowerCase().endsWith('.pdf')
    );

    // Get file stats for each PDF
    const pdfsWithStats = await Promise.all(
      pdfFiles.map(async (filename) => {
        const filePath = path.join(pdfsDirectory, filename);
        const stats = await fs.stat(filePath);

        // Generate a display name from filename
        const displayName = filename
          .replace('.pdf', '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());

        return {
          filename,
          displayName,
          size: stats.size,
          modified: stats.mtime,
        };
      })
    );

    // Sort by modified date, newest first
    pdfsWithStats.sort((a, b) =>
      new Date(b.modified).getTime() - new Date(a.modified).getTime()
    );

    return NextResponse.json({ pdfs: pdfsWithStats });
  } catch (error) {
    console.error('Error reading PDFs directory:', error);
    return NextResponse.json(
      { error: 'Failed to read PDFs' },
      { status: 500 }
    );
  }
}
