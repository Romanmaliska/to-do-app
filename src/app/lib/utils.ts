import { UserNoteWithStringifiedId } from '@/app/types/note';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function notesDivededByState(notes: UserNoteWithStringifiedId[]) {
  const dividedNotes = notes.reduce(
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

  const { doneNotes, inProgressNotes, newNotes } = dividedNotes;

  return {
    doneNotes: doneNotes.sort((a, b) => a.position - b.position),
    inProgressNotes: inProgressNotes.sort((a, b) => a.position - b.position),
    newNotes: newNotes.sort((a, b) => a.position - b.position),
  };
}

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};
