/**
 * TextProvider — fetches Bible text from the public bible-api.com (WEB translation).
 * Includes in-memory caching.
 */

export interface VerseData {
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface PassageResult {
  reference: string;
  text: string;
  verses: VerseData[];
  translation_name: string;
}

const cache = new Map<string, PassageResult>();

export async function fetchPassage(reference: string): Promise<PassageResult> {
  if (cache.has(reference)) {
    return cache.get(reference)!;
  }

  const encoded = encodeURIComponent(reference);
  const res = await fetch(`https://bible-api.com/${encoded}?translation=web`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`Bible API error: ${res.status} for "${reference}"`);
  }

  const data = await res.json();
  const result: PassageResult = {
    reference: data.reference,
    text: data.text?.trim() ?? "",
    verses: (data.verses ?? []).map((v: any) => ({
      book_name: v.book_name,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text?.trim() ?? "",
    })),
    translation_name: data.translation_name ?? "World English Bible",
  };

  cache.set(reference, result);
  return result;
}
