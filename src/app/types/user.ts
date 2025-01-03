import { Document, WithId } from 'mongodb';

export type User = {
  userId: string;
  boards: UserBoard[];
};

export type UserDocument = WithId<Document> & User;

export type UserBoard = {
  boardName: string;
  boardId: string;
  columns?: UserColumn[];
};

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
