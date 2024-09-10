"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import mongoDBclient from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import type { UserNote } from "@/types/note";

export async function testDatabaseConnection() {
  let isConnected = false;
  const mongoClient = await mongoDBclient.connect();
  try {
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });

    console.log(" You successfully connected to MongoDB!");

    return !isConnected;
  } catch (e) {
    console.error(e);
    return isConnected;
  }
}

export async function getNotes() {
  return await mongoDBclient
    .db("notes")
    .collection<UserNote>("notes")
    .find()
    .toArray();
}

export async function addNewNote({
  tittle,
  text,
}: Pick<UserNote, "tittle" | "text">) {
  await mongoDBclient
    .db("notes")
    .collection("notes")
    .insertOne({ tittle, text });

  revalidatePath("/");
  redirect("/");
}

export async function deleteNote(_id: string) {
  await mongoDBclient
    .db("notes")
    .collection("notes")
    .deleteOne({ _id: new ObjectId(_id) });

  revalidatePath("/");
}
