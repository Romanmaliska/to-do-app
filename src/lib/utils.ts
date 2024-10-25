import { UserNoteWithStringifiedId } from '@/types/note';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function notesDivededByState(notes: UserNoteWithStringifiedId[]) {
  return notes.reduce(
    (
      acc: {
        doneNotes: UserNoteWithStringifiedId[];
        inProgressNotes: UserNoteWithStringifiedId[];
        newNotes: UserNoteWithStringifiedId[];
      },
      note,
    ) => {
      if (note.state === 'done') {
        acc.doneNotes.push(note);
      } else if (note.state === 'progress') {
        acc.inProgressNotes.push(note);
      } else if (note.state === 'new') {
        acc.newNotes.push(note);
      }
      return acc;
    },
    { doneNotes: [], inProgressNotes: [], newNotes: [] },
  );
}
