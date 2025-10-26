import { auth } from "@/auth";
import Logout from "@/component/Logout";
import Link from "next/link";
import { AuthPopup } from "@/components/ui/authPopup";
import { isAdmin } from "@/lib/role-check";


export default async function Home() {

  const session = await auth()
  const isUserAdmin = await isAdmin();

  // if (!session) {
  //   return <Link href="/SignIn">Please sign in</Link>;
  // }


  return (
    <>
    <nav className="flex justify-center items-center gap-8 py-4">
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
      {isUserAdmin && (
        <Link href="/admin" className="text-red-600 font-bold">Admin Panel</Link>
      )}
      {
        session?.user ? (
          <div className="flex items-center gap-8">
            <div>
              <p>Signed in as {session?.user?.email}</p>
              <p className="text-sm text-gray-500">Role: {session?.user?.role || 'No role'}</p>
            </div>
            <Logout/>
          </div>
        ) : (
          <AuthPopup />
        )
      }
    </nav>
      <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>

    </div>
    </>
  );
}
