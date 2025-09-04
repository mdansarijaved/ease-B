import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "~/components/ui/button";
import { auth, getSession } from "~/auth/server";

export default async function SignupPage() {
  const session = await getSession();

  return (
    <section className="bg-background relative w-full overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/20 absolute top-[-12rem] left-[-10rem] h-[28rem] w-[28rem] rounded-full blur-3xl" />
        <div className="bg-secondary/20 absolute right-[-12rem] bottom-[-12rem] h-[36rem] w-[36rem] rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 container mx-auto grid place-items-center px-6">
        <div className="animate-in fade-in slide-in-from-bottom-1 w-full max-w-lg duration-300">
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 text-neutral-700 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
            <div className="text-center">
              <h1 className="bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                Create your account
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Join EasyWisy to get started
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {session ? (
                <div className="space-y-4">
                  <div className="text-muted-foreground text-sm">
                    You are signed in as
                    <span className="text-foreground ml-1 font-medium">
                      {session.user.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/">
                      <Button size="lg" className="h-11 w-full">
                        Continue
                      </Button>
                    </Link>
                    <form>
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-11 w-full"
                        formAction={async () => {
                          "use server";
                          await auth.api.signOut({ headers: await headers() });
                          redirect("/");
                        }}
                      >
                        Sign out
                      </Button>
                    </form>
                  </div>
                </div>
              ) : (
                <>
                  <form>
                    <Button
                      size="lg"
                      className="h-11 w-full"
                      formAction={async () => {
                        "use server";
                        const res = await auth.api.signInSocial({
                          body: { provider: "google", callbackURL: "/" },
                        });
                        if (!res.url) {
                          throw new Error("No URL returned from signInSocial");
                        }
                        redirect(res.url);
                      }}
                    >
                      Continue with Google
                    </Button>
                  </form>
                  <p className="text-muted-foreground text-xs">
                    By continuing, you agree to our
                    <Link href="#" className="text-primary ml-1 underline">
                      Terms
                    </Link>
                    <span className="mx-1">and</span>
                    <Link href="#" className="text-primary underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </>
              )}
            </div>
            <div className="text-muted-foreground mt-6 text-center text-sm">
              Already have an account?
              <Link
                href="/auth/login"
                className="text-primary ml-1 font-medium"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
