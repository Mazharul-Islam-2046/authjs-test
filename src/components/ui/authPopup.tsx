
import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AuthPopup() {

  async function handleSubmit(formData: FormData) {
    "use server"
    const email = formData.get("email");
    const password = formData.get("password");
    
    console.log("🟠 handleSubmit - Form data:", { email, password });
    console.log("🟠 handleSubmit - Calling signIn...");
    
    // signIn() throws NEXT_REDIRECT to perform the redirect
    // This is normal behavior, not an error!
    await signIn("credentials", {
      redirect: true,
      redirectTo: "/",
      email: email,
      password: password,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Enter your credentials to sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="pedro@PercentDiamond.com" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="securepassword" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Sign In</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
