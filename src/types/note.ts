import { Document, WithId } from "mongodb";

export type UserNote = WithId<Document> & {
  tittle: string;
  text: string;
};

export type UserNoteWithStringifiedId = {
  tittle: string;
  text: string;
  _id: string;
};
