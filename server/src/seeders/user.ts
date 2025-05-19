import { prisma } from "../../db";
import { fa, faker, simpleFaker } from "@faker-js/faker";

const createUser = async (numUsers: string[]) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numUsers.length; i++) {
      const tmpUser = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          password: "password",
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
      for (let j = i + 1; j < users.length; j++) {
        chatsPromise.push(
          prisma.chat.create({
            data: {
              chatName: faker.lorem.words(2),
              members: [users[i].id, users[j].id],
              groupChat: false,
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

const craeteGroupChats = async (numChats: number) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
      },
    });

    const chatsPromise = [];

    for (let i = 0; i < numChats; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
      const members = [];

      for (let i = 0; i < numMembers.length; i++) {
        const randomIdx = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIdx];
        const chat = prisma.chat.create({
          data: {
            creator: members[0],
          },
        });

        chatsPromise.push(chat);
      }

      await Promise.all(chatsPromise);
    }
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
        },
      }),
    ]);

    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagesPromise.push(
        prisma.message.create({
          data: {
            content: faker.lorem.sentence(),
            sender: randomUser.id,
            chatId: randomChat.id,
          },
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const createMessagesInAChat = async (chatId, numMessages) => {
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
            sender: randomUser.id,
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
