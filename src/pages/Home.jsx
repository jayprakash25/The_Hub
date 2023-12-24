import { useEffect, useState } from "react";
import { BottomBar, Empty, Loader, Navbar, UsersPosts } from "../components";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
export default function Home() {
  const jwt = localStorage.getItem("jwt");
  const [isloading, setisloading] = useState(true);
  const [posts, setposts] = useState();

  const fetchPosts = async () => {
    // get users connections
    try {
      const docref = doc(db, "USERS", jwt);
      const User = await getDoc(docref);
      const currentConnectedUser = await User.data().connectedUsers;
      console.log(currentConnectedUser);
      const posts = currentConnectedUser?.map(async (userid) => {
        const userdocref = await doc(db, "USERS", userid);
        const UserPosts = await getDoc(userdocref);
        console.log(UserPosts.data());
        setposts(UserPosts.data().Posts);
        setisloading(false);
      });
      const Userposts = await Promise.all(posts);
    } catch (error) {
      console.log(error);
      setisloading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      {isloading ? <Loader /> : null}
      {posts?.length <= 0 ? <Empty /> : <UsersPosts posts={posts} />}
      <BottomBar />
    </>
  );
}
