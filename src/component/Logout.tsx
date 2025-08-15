import { signOut } from '@/auth';

const Logout = () => {
    return (
        <form
              action={async () => {
                "use server"
                await signOut();
              }}
            >
              <button type="submit">Logout</button>
            </form>
    );
};

export default Logout;