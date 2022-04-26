import React from "react";
import { prisma } from "../../db";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import UserCard from "../../components/UserCard";
import { SessionUserObjectType, UserType } from "../../src/types";
import useSWR from "swr";
import fetcher from "../../src/utils/fetcher";
import { getSession } from "next-auth/react";

function UserList({ sessionUser }: SessionUserObjectType) {
  const swrUrl = `../api/users`;
  const {
    data: users,
    mutate: mutateUsers,
    error: usersError
  } = useSWR(swrUrl, fetcher);
  if (usersError) {
    console.log(usersError);
  }

  return (
    <Box>
      <Flex ml={{ base: 6, sm: 0 }} justifyContent={"center"}>
        <Box>
          {users ? (
            users
              .filter(
                sessionUser.isAdmin
                  ? (user: UserType) => user
                  : (user: UserType) => user.isActive
              )
              .sort((a: UserType, b: UserType) => (a.name > b.name ? -1 : 1))
              .map((user: UserType) => <UserCard user={user} key={user.id} />)
          ) : (
            <Spinner />
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export default UserList;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    };
  }

  const sessionUser: any = session.user;

  if (!sessionUser) {
    console.log("pas trouvée");
    return;
  }

  const localUser: any = await prisma.user.findUnique({
    where: {
      id: sessionUser.id!
    }
  });

  sessionUser.isAdmin = localUser.isAdmin;

  return {
    props: {
      sesh: session,
      sessionUser: sessionUser
    }
  };
}
