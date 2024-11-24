import { Document, WithId } from 'mongodb';

type UserNote = {
  noteText: string;
  columnId: string;
  updatedAt: Date;
  createdAt: Date;
};

export type UserNoteDocument = WithId<Document> & UserNote;

export type UserNoteWithStringifiedId = UserNote & {
  noteId: string;
};
