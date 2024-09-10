import { Document, WithId } from "mongodb";

export type UserNote = WithId<Document> & {
  tittle: string;
  text: string;
};
