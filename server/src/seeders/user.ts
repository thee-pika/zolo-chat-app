import { prisma } from "../../db";
import { faker, simpleFaker } from "@faker-js/faker";
import { hashPassword } from "../utils/createToken";

const createUser = async (numUsers: number) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numUsers; i++) {
      console.log("Creating user", i + 1);
      const hashedPassword = await hashPassword("password");
      const tmpUser = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          password: hashedPassword,
          avatar: faker.image.avatar(),
          bio: faker.lorem.sentence(),
        },
      });

      usersPromise.push(tmpUser);
    }

    await Promise.all(usersPromise);
  } catch (error) {
    console.log(error);
  }
};

const createSingleChats = async (count: number) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
      },
    });

    const chatsPromise = [];

    for (let i = 0; i < users.length; i++) {
      console.log("Creating chat", i + 1);
      for (let j = i + 1; j < users.length; j++) {
        chatsPromise.push(
          prisma.chat.create({
            data: {
              chatName: faker.lorem.words(2),
              members: [users[i].id, users[j].id],
              groupChat: false,
              avatar: faker.image.avatar(),
            },
          })
        );
      }
    }

    await Promise.all(chatsPromise);
  } catch (error) {
    console.log(error);
  }
};

const createMessagesInAGroup = async (numChats: number) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
      },
    });

    const chatsPromise = [];

    for (let i = 0; i < numChats; i++) {
      console.log("Creating group chat", i + 1);
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
      const members = [];

      const randomIdx = Math.floor(Math.random() * users.length);

      const randomUser = users[randomIdx];

      members.push(randomUser.id);

      const chat = prisma.chat.create({
        data: {
          chatName: faker.lorem.words(2),
          members: members,
          groupChat: true,
          avatar: faker.image.avatar(),
          creator: randomUser.id,
        },
      });

      chatsPromise.push(chat);
    }

    await Promise.all(chatsPromise);
  } catch (error) {
    console.log(error);
  }
};

const createMessages = async (numMessages: number) => {
  try {
    const [users, chats] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
        },
      }),
      prisma.chat.findMany({
        select: {
          id: true,
          groupChat: true,
        },
      }),
    ]);


    if (users.length === 0 || chats.length === 0) {
      console.log("No users or chats found");
      return;
    }

    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
 
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagesPromise.push(
        prisma.message.create({
          data: {
            content: faker.lorem.sentence(),
            senderId: randomUser.id,
            chatId: randomChat.id,
          },
        })
      );

      await Promise.all(messagesPromise);

    }
  } catch (error) {
    console.log(error);
  }
};

const createMessagesInAChat = async (chatId: string, numMessages: number) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
      },
    });

    const messagesPromise = [];
    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      messagesPromise.push(
        prisma.message.create({
          data: {
            chatId,
            senderId: randomUser.id,
            content: faker.lorem.sentence(),
          },
        })
      );
    }

    await Promise.all(messagesPromise);
  } catch (error) {
    console.log(error);
  }
};

export {
  createMessagesInAChat,
  createMessages,
  createUser,
  createSingleChats,
  createMessagesInAGroup,
};
