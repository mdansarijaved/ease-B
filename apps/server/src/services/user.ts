import db from "../../prisma";

export const fetchUserRole = async (userID: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userID,
    },
  });
  return user?.role;
};
