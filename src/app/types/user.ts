import { Document, WithId } from 'mongodb';

export type User = {
  userId: string;
  boards: UserBoard[];
};

export type UserDocument = WithId<Document> & User;

export type UserBoard = {
  boardName: string;
  boardId: string;
  starred: boolean;
  columns?: UserColumn[];
};

export type UserColumn = {
  columnTitle: string;
  columnId: string;
  notes: UserNote[];
};

export type UserNote = {
  noteText: string;
  noteId: string;
};
