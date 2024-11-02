import { Document, WithId } from 'mongodb';

type UserNote = {
  tittle: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  state: 'new' | 'progress' | 'done';
  position: number;
};

export type UserNoteDocument = WithId<Document> & UserNote;

export type UserNoteWithStringifiedId = UserNote & {
  _id: string;
};
