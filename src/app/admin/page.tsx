import { requireRole, UserRole } from "@/lib/role-check";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  try {
    // This will throw an error if user is not an admin
    await requireRole(UserRole.ADMIN);
  } catch (error) {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Admin Only Area</p>
        <p>Only users with the ADMIN role can see this page.</p>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Admin Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>User Management</li>
          <li>System Settings</li>
          <li>Reports & Analytics</li>
          <li>Database Management</li>
        </ul>
      </div>
    </div>
  );
}
