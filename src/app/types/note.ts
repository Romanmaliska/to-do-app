import { Document, WithId } from 'mongodb';

export type User = {
  userId: string;
  columns: UserColumn[];
};

export type UserDocument = WithId<Document> & User;

export type UserColumn = {
  columnTitle: string;
  columnId: string;
  columnIndex: number;
  notes: UserNote[];
};

export type UserNote = {
  noteText: string;
  noteId: string;
  noteIndex: number;
};
