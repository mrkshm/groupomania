import React from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import UserCardAdmin from "../../components/admin/UserCardAdmin";
import { UserType } from "../../src/types";
import useSWR from "swr";
import fetcher from "../../src/utils/fetcher";
import { getSession } from "next-auth/react";
import { prisma } from "../../db";

function Users() {
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
            users.map((user: UserType) => (
              <UserCardAdmin user={user} key={user.id} mutate={mutateUsers} />
            ))
          ) : (
            <Spinner />
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export default Users;

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
  const sessionUser = session.user;

  const user: any = await prisma.user.findUnique({
    where: {
      // @ts-ignore
      id: sessionUser.id
    }
  });

  if (!user.isAdmin) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    };
  }

  return {
    props: {
      sessionUser: sessionUser
    }
  };
}
