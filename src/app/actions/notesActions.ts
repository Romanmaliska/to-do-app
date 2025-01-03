'use server';

import { revalidatePath } from 'next/cache';

import mongoDBclient from '@/app/lib/mongodb';
import { generateId } from '@/app/lib/utils';
import type { UserBoard, UserColumn } from '@/app/types/user';

export async function testDatabaseConnection() {
  let isConnected = false;
  const mongoClient = await mongoDBclient.connect();
  try {
    // Send a ping to confirm a successful connection
    await mongoClient.db('users').command({ ping: 1 });

    console.log(' You successfully connected to MongoDB!');

    return !isConnected;
  } catch (e) {
    console.log(e);
    return isConnected;
  }
}

export async function createNewUser(userId: string) {
  try {
    const collection = mongoDBclient.db('users').collection('users');

    const existingUser = await collection.findOne({ userId });

    if (!existingUser) {
      await collection.insertOne({ userId });
    }
  } catch (e) {
    console.log(e);
  }
}

export async function createNewBoard(userId: string, formData: FormData) {
  const boardName = formData.get('boardName') as string;

  const newBoard: UserBoard = {
    boardId: generateId(),
    boardName,
  };

  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne({ userId }, { $push: { boards: newBoard } });

    revalidatePath('/boards');
  } catch (e) {
    console.log(e);
  }
}

export async function getBoards(userId: string) {
  try {
    const userBoards = await mongoDBclient
      .db('users')
      .collection('users')
      .findOne({ userId });

    if (!userBoards?.boards?.length) return null;

    return userBoards.boards;
  } catch (e) {
    console.log(e);
  }
}

export async function addNewColumn(
  userId: string,
  boardId: string,
  newColumn: UserColumn,
) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne(
        { userId, 'boards.boardId': boardId },
        { $push: { 'boards.$.columns': newColumn } },
      );

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function deleteColumn(
  userId: string,
  boardId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne(
        { userId, 'boards.boardId': boardId },
        { $set: { 'boards.$.columns': newColumns } },
      );

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function updateColumnTitle({
  userId,
  boardId,
  newColumns,
}: {
  userId: string;
  boardId: string;
  newColumns: UserColumn[];
}) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne(
        { userId, 'boards.boardId': boardId },
        { $set: { 'boards.$.columns': newColumns } },
      );

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function updateColumnsPosition(
  userId: string,
  boardId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne(
        { userId, 'boards.boardId': boardId },
        { $set: { 'boards.$.columns': newColumns } },
      );

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function addNewNote(
  userId: string,
  boardId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne(
        { userId, 'boards.boardId': boardId },
        { $set: { 'boards.$.columns': newColumns } },
      );

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function deleteNote(
  userId: string,
  boardId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne(
        { userId, 'boards.boardId': boardId },
        { $set: { 'boards.$.columns': newColumns } },
      );

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function updateNote(
  userId: string,
  boardId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection('users')
      .updateOne(
        { userId, 'boards.boardId': boardId },
        { $set: { 'boards.$.columns': newColumns } },
      );

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function updateNotePositionInsideColumn(
  userId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function updateNotePositionOutsideColumn(
  userId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function moveNoteToEmptyColumn(
  userId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}
