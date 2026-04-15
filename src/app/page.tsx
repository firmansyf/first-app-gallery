import Gallery from "./components/Gallery";
import Feed from "./components/Feed";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const session = token ? verifyToken(token) : null;

  // Admin sees the feed with CreatePost, public sees the gallery grid
  if (session) {
    return <Feed />;
  }

  return <Gallery />;
}
