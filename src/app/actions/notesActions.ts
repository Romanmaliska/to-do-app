'use server';

import { UniqueIdentifier } from '@dnd-kit/core';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

import mongoDBclient from '@/app/lib/mongodb';
import type { UserColumn, UserDocument, UserNote } from '@/app/types/note';

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

export async function createNewUser({ userId }: { userId: string }) {
  const newUser = {
    userId,
    columns: [],
  };

  try {
    const collection = mongoDBclient.db('users').collection('users');
    const existingUser = await collection.findOne({ userId });

    if (!existingUser) {
      await collection.insertOne(newUser);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getSortedColumns({ userId }: { userId: string }) {
  const columnDocument: UserDocument | null = await mongoDBclient
    .db('users')
    .collection<UserDocument>('users')
    .findOne({ userId });

  if (!columnDocument?.columns?.length) return null;

  const sortedColumns: UserColumn[] = columnDocument.columns
    .map(({ notes, ...data }) => {
      return {
        ...data,
        notes: notes?.length
          ? notes.toSorted((a, b) => a.noteIndex - b.noteIndex)
          : [],
      };
    })
    .toSorted((a, b) => a.columnIndex - b.columnIndex);

  return sortedColumns;
}

export async function addNewColumn(newColumn: UserColumn, userId: string) {
  await mongoDBclient
    .db('users')
    .collection<Document>('users')
    .updateOne({ userId }, { $push: { columns: newColumn } });

  revalidatePath('/');
}

export async function deleteColumn(userId: string, newColumns: UserColumn[]) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/');
  } catch (error) {
    console.error('Failed to delete column:', error);
  }
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
  columnId,
  newNotes,
}: {
  columnId: string;
  newNotes: UserNote[];
}) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .updateOne({ _id: new ObjectId(columnId) }, { $set: { notes: newNotes } });

  revalidatePath('/');
}

export async function updateNotePositionOutsideColumn({
  activeColumnId,
  overColumnId,
  activeNoteIndex,
  overNoteIndex,
  activeNoteId,
  activeNoteText,
}: {
  activeColumnId: string;
  activeNoteIndex: number;
  overColumnId: string;
  overNoteIndex: number;
  activeNoteId: string;
  activeNoteText: string;
}) {
  const collection = mongoDBclient.db('notes').collection('notes');

  // Remove the note from the active column
  // Update active column indexes
  await collection.updateOne({ _id: new ObjectId(activeColumnId) }, [
    {
      $set: {
        notes: {
          $filter: {
            input: '$notes',
            as: 'note',
            cond: { $ne: ['$$note.noteId', activeNoteId] }, // Exclude the note to be removed
          },
        },
      },
    },
    {
      $set: {
        notes: {
          $map: {
            input: '$notes',
            as: 'note',
            in: {
              $mergeObjects: [
                '$$note',
                {
                  noteIndex: {
                    $cond: [
                      { $lt: ['$$note.noteIndex', activeNoteIndex] },
                      '$$note.noteIndex',
                      { $subtract: ['$$note.noteIndex', 1] },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    },
  ]);

  // Update over column indexes
  // Add the note to the over column
  await collection.updateOne({ _id: new ObjectId(overColumnId) }, [
    {
      $set: {
        notes: {
          $concatArrays: [
            {
              $map: {
                input: '$notes',
                as: 'note',
                in: {
                  $mergeObjects: [
                    '$$note',
                    {
                      noteIndex: {
                        $cond: [
                          { $lt: ['$$note.noteIndex', overNoteIndex] },
                          '$$note.noteIndex',
                          { $add: ['$$note.noteIndex', 1] },
                        ],
                      },
                    },
                  ],
                },
              },
            },
            [
              {
                noteId: activeNoteId,
                noteIndex: overNoteIndex,
                noteText: activeNoteText,
              },
            ],
          ],
        },
      },
    },
  ]);

  revalidatePath('/');
}

export async function moveNoteToEmptyColumn({
  activeColumnId,
  overColumnId,
  activeNoteId,
  activeNoteIndex,
  activeNoteText,
}: {
  activeColumnId: string;
  overColumnId: string;
  activeNoteId: string;
  activeNoteIndex: number;
  activeNoteText: string;
}) {
  const collection = mongoDBclient.db('notes').collection('notes');

  await collection.bulkWrite([
    // Decrement `noteIndex` for notes in the active column and remove the note
    {
      updateOne: {
        filter: { _id: new ObjectId(activeColumnId) },
        update: [
          {
            $set: {
              notes: {
                $filter: {
                  input: {
                    $map: {
                      input: '$notes',
                      as: 'note', // Define the variable as "note"
                      in: {
                        $mergeObjects: [
                          '$$note',
                          {
                            noteIndex: {
                              $cond: [
                                {
                                  $and: [
                                    {
                                      $gt: [
                                        '$$note.noteIndex',
                                        activeNoteIndex,
                                      ],
                                    },
                                    { $ne: ['$$note.noteId', activeNoteId] },
                                  ],
                                },
                                { $subtract: ['$$note.noteIndex', 1] },
                                '$$note.noteIndex',
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                  as: 'note', // Define the variable for $filter
                  cond: { $ne: ['$$note.noteId', activeNoteId] }, // Exclude the note with activeNoteId
                },
              },
            },
          },
        ],
      },
    },
    // Add the note to the target column
    {
      updateOne: {
        filter: { _id: new ObjectId(overColumnId) },
        update: {
          $push: {
            notes: {
              noteId: activeNoteId,
              noteIndex: 0,
              noteText: activeNoteText,
            },
          },
        },
      },
    },
  ]);

  revalidatePath('/');
}

export async function updateNote(
  columnId: string,
  noteId: string,
  noteText: string,
) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .updateOne(
      { _id: new ObjectId(columnId), 'notes.noteId': noteId },
      { $set: { 'notes.$[note].noteText': noteText } },
      { arrayFilters: [{ 'note.noteId': noteId }] },
    );

  revalidatePath('/');
}

export async function updateColumnTitle(columnId: string, columnTitle: string) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .updateOne({ _id: new ObjectId(columnId) }, { $set: { columnTitle } });

  revalidatePath('/');
}
