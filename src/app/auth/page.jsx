import {auth} from "@/app/api/auth/[...nextauth]/auth"
import AuthForm from "../_components/AuthForm";

export const runtime = "edge";

export default async function Page() {
  const session = await auth();
    console.log(session)
  return (
    <main className="flex flex-col gap-3">
      <h1>My Custom Auth Page</h1>
      <AuthForm session={session} />
    </main>
  );
}