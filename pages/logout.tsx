import { getSession, signOut } from "next-auth/react";

export default function LogoutPage() {
  return null;
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (session) {
    await signOut({ redirect: false });
  }

  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
}
