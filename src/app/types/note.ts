import { Document, WithId } from 'mongodb';

export type UserNote = {
  noteText: string;
  noteId: string;
  noteIndex: number;
};

type UserColumnWithoutId = {
  columnTitle: string;
  columnIndex: number;
  notes: UserNote[];
};
export type UserColumnDocument = WithId<Document> & UserColumnWithoutId;

export type UserColumn = UserColumnWithoutId & {
  columnId: string;
};
