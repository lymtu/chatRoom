import { ThemeToggleBtn } from "@/components/global/themeToggleBtn";
import { AvatarMenu } from "@/app/_component/avatarMenu";
import { RoomList } from "./_component/roomList";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 font-sans dark:bg-black">
      <main className="min-h-screen w-full max-w-3xl flex flex-col items-center justify-between py-32 px-16 bg-background dark:bg-black sm:items-start">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-2xl font-bold">聊天室</h1>

          <div className="flex items-center gap-4">
            <ThemeToggleBtn />
            <div className="h-6 w-px bg-gray-900 dark:bg-white"></div>
            <AvatarMenu />
          </div>
        </div>

        <div className="relative h-75 w-3/4 min-w-80 mx-auto flex items-center">
          <div
            className="h-fit max-h-full w-full p-2 flex flex-col gap-4 overflow-y-auto"
            style={{
              scrollbarWidth: "none",
            }}
          >
            <RoomList />
          </div>
          <div className="bg-linear-to-b pointer-events-none absolute w-full h-full via-transparent from-background to-background dark:via-transparent dark:from-black dark:to-black"></div>
        </div>
      </main>
    </div>
  );
}
