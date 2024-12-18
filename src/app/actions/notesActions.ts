'use server';
import { UniqueIdentifier } from '@dnd-kit/core';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

import mongoDBclient from '@/app/lib/mongodb';
import type {
  UserColumn,
  UserColumnDocument,
  UserNote,
} from '@/app/types/note';

export async function testDatabaseConnection() {
  let isConnected = false;
  const mongoClient = await mongoDBclient.connect();
  try {
    // Send a ping to confirm a successful connection
    await mongoClient.db('admin').command({ ping: 1 });

    console.log(' You successfully connected to MongoDB!');

    return !isConnected;
  } catch (e) {
    console.error(e);
    return isConnected;
  }
}

export async function getSortedColumns() {
  const columnDocument: UserColumnDocument[] = await mongoDBclient
    .db('notes')
    .collection<UserColumnDocument>('notes')
    .find()
    .toArray();

  const sortedColumns: UserColumn[] = columnDocument
    .map(({ _id, notes, ...data }) => {
      return {
        ...data,
        notes: notes.toSorted((a, b) => a.noteIndex - b.noteIndex),
        columnId: _id.toString(),
      };
    })
    .toSorted((a, b) => a.columnIndex - b.columnIndex);

  return sortedColumns;
}

export async function addNewColumn(newColumn: UserColumn) {
  await mongoDBclient.db('notes').collection('notes').insertOne(newColumn);

  revalidatePath('/');
}

export async function deleteColumn(_id: string) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .deleteOne({ _id: new ObjectId(_id) });

  revalidatePath('/');
}

export async function updateColumnsPosition({
  overIndex,
  activeIndex,
  overId,
  activeId,
}: {
  overIndex: number;
  activeIndex: number;
  overId: UniqueIdentifier;
  activeId: UniqueIdentifier;
}) {
  const colection = mongoDBclient.db('notes').collection('notes');

  await colection.updateOne(
    { _id: new ObjectId(overId) },
    { $set: { columnIndex: activeIndex } },
  );

  await colection.updateOne(
    { _id: new ObjectId(activeId) },
    { $set: { columnIndex: overIndex } },
  );

  revalidatePath('/');
}

export async function addNewNote(columnId: string, newNote: UserNote) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .updateOne({ _id: new ObjectId(columnId) }, { $push: { notes: newNote } });

  revalidatePath('/');
}

export async function deleteNote(columnId: string, noteId: string) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .updateOne(
      { _id: new ObjectId(columnId) },
      { $pull: { notes: { noteId } } },
    );

  revalidatePath('/');
}

export async function updateNotePositionInsideColumn({
  activeColumnId,
  activeNoteIndex,
  overNoteIndex,
  activeNoteId,
  overNoteId,
}: {
  activeColumnId: string;
  activeNoteIndex: number;
  overNoteIndex: number;
  activeNoteId: string;
  overNoteId: string;
}) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .bulkWrite([
      {
        updateOne: {
          filter: {
            _id: new ObjectId(activeColumnId),
            'notes.noteId': activeNoteId,
          },
          update: { $set: { 'notes.$[note].noteIndex': overNoteIndex } },
          arrayFilters: [{ 'note.noteId': activeNoteId }],
        },
      },
      {
        updateOne: {
          filter: {
            _id: new ObjectId(activeColumnId),
            'notes.noteId': overNoteId,
          },
          update: { $set: { 'notes.$[note].noteIndex': activeNoteIndex } },
          arrayFilters: [{ 'note.noteId': overNoteId }],
        },
      },
    ]);

  revalidatePath('/');
}

export async function updateNotePositionOutsideColumn({
  activeColumnId,
  overColumnId,
  activeNoteIndex,
  overNoteIndex,
  activeNoteId,
}: {
  activeColumnId: string;
  activeNoteIndex: number;
  overColumnId: string;
  overNoteIndex: number;
  activeNoteId: string;
}) {
  const collection = mongoDBclient.db('notes').collection('notes');

  // Update active column
  await collection.updateOne(
    { _id: new ObjectId(activeColumnId) },
    {
      $set: {
        'notes.$[note].noteIndex': {
          $cond: {
            if: { $lt: ['$noteIndex', activeNoteIndex] },
            then: '$noteIndex',
            else: { $subtract: ['$noteIndex', 1] },
          },
        },
      },
    },
    { arrayFilters: [{ 'note.noteId': { $ne: activeNoteId } }] },
  );

  // Remove the note from the active column
  await collection.updateOne(
    { _id: new ObjectId(activeColumnId) },
    { $pull: { notes: { noteId: activeNoteId } } },
  );

  // Update over column
  await collection.updateOne(
    { _id: new ObjectId(overColumnId) },
    {
      $set: {
        'notes.$[note].noteIndex': {
          $cond: {
            if: { $lt: ['$noteIndex', overNoteIndex] },
            then: '$noteIndex',
            else: { $add: ['$noteIndex', 1] },
          },
        },
      },
    },
    { arrayFilters: [{ 'note.noteId': { $ne: activeNoteId } }] },
  );

  // Add the note to the over column
  await collection.updateOne(
    { _id: new ObjectId(overColumnId) },
    {
      $push: {
        notes: {
          $each: [{ noteId: activeNoteId, noteIndex: overNoteIndex }],
          $position: overNoteIndex,
        },
      },
    },
  );

  revalidatePath('/');
}

export async function moveNoteToNewColumn({
  activeColumnId,
  overColumnId,
  activeNoteId,
  activeNoteIndex,
}: {
  activeColumnId: string;
  overColumnId: string;
  activeNoteId: string;
  activeNoteIndex: number;
}) {
  const collection = mongoDBclient.db('notes').collection('notes');

  // Update noteIndex in the active column
  await collection.updateOne(
    { _id: new ObjectId(activeColumnId) },
    {
      $inc: { 'notes.$[note].noteIndex': -1 },
    },
    { arrayFilters: [{ 'note.noteIndex': { $gt: activeNoteIndex } }] },
  );

  // Remove the note from the active column
  await collection.updateOne(
    { _id: new ObjectId(activeColumnId) },
    { $pull: { notes: { noteId: activeNoteId } } },
  );

  // Add the note to the new column with noteIndex 0
  await collection.updateOne(
    { _id: new ObjectId(overColumnId) },
    {
      $push: {
        notes: {
          $each: [{ noteId: activeNoteId, noteIndex: 0 }],
          $position: 0,
        },
      },
    },
  );

  revalidatePath('/');
}

export async function updateNote(
  { tittle, text }: { tittle: string; text: string },
  _id: string,
) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .updateOne({ _id: new ObjectId(_id) }, { $set: { tittle, text } });

  revalidatePath('/');
}

export async function updateColumnTitle(columnId: string, columnTitle: string) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .updateOne({ _id: new ObjectId(columnId) }, { $set: { columnTitle } });

  revalidatePath('/');
}
