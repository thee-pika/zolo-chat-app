import { prisma } from "../../db";

interface User {
  id: string;
  name: string;
}

const getOtherMember = (members: string[], userId: string) => {
  return members.find((member) => member.toString() !== userId.toString());
};

const findUserById = async (id: string) => {
  const otherUser = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  return otherUser;
};

const getSockets = (users: string[], userSocketIds: Map<string, string>) => {
  const sockets = users.map((user) => userSocketIds.get(user.toString()));
  return sockets;
};

export { getOtherMember, findUserById, getSockets };
