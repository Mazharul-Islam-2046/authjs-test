import { auth } from "@/auth";
import Logout from "@/component/Logout";
import Link from "next/link";


export default async function Home() {

  const session = await auth()

  if (!session) {
    return <Link href="/SignIn">Please sign in</Link>;
  }


  return (
    <>
      <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>

      <Logout/>
    </div>
    </>
  );
}
