import { auth } from "@/auth";
import Logout from "@/component/Logout";
import Link from "next/link";
import { AuthPopup } from "@/components/ui/authPopup";


export default async function Home() {

  const session = await auth()

  // if (!session) {
  //   return <Link href="/SignIn">Please sign in</Link>;
  // }


  return (
    <>
    <nav className="flex justify-center items-center gap-8 py-4">
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
      {
        session?.user ? <div className="flex items-center gap-8"><p>Signed in as {session?.user?.email}</p> <Logout/></div> : <AuthPopup />
      }
      
      
    </nav>
      <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>

    </div>
    </>
  );
}
