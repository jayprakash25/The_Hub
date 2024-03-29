import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../ContextProvider/AuthContext";
import Loader from "./People/Loader";
export default function Chats() {
  const { currentUser } = useAuth();
  const jwt = currentUser.uid;
  const [Users, setUsers] = useState([]);
  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    const generateChatId = (userId1, userId2) => {
      const ids = [userId1, userId2].sort();
      const chatId = ids.join("-");
      return chatId;
    };
    const fetchConnectedUsers = async () => {
      try {
        setisloading(true);
        const sentRequestsQuery = query(
          collection(db, "connectionRequests"),
          where("senderId", "==", jwt),
          where("status", "==", "accepted")
        );
        const receivedRequestsQuery = query(
          collection(db, "connectionRequests"),
          where("receiverId", "==", jwt),
          where("status", "==", "accepted")
        );
        const [sentRequestsSnapshot, receivedRequestsSnapshot] =
          await Promise.all([
            getDocs(sentRequestsQuery),
            getDocs(receivedRequestsQuery),
          ]);
        const connectedUserIds = new Set();
        sentRequestsSnapshot.forEach((doc) =>
          connectedUserIds.add(doc.data().receiverId)
        );
        receivedRequestsSnapshot.forEach((doc) =>
          connectedUserIds.add(doc.data().senderId)
        );
        const usersDataArray = await Promise.all(
          [...connectedUserIds].map(async (userId) => {
            const userDocRef = doc(db, "USERS", userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const chatId = generateChatId(jwt, userId);
              return {
                userId,
                ...userDocSnap.data(),
                chatId,
              };
            } else {
              console.error("User not found:", userId);
              return null;
            }
          })
        );
        const filteredUsersDataArray = usersDataArray.filter(
          (user) => user !== null
        );
        setUsers(filteredUsersDataArray);
        setisloading(false);
      } catch (error) {
        console.error("Error fetching connected users:", error);
      }
    };
    fetchConnectedUsers();
  }, [jwt]);

  return (
    <main data-aos="fade-right" className="flex flex-col mx-2 mt-6 space-y-1">
      {isloading ? (
        <Loader />
      ) : (
        Users.map((item, i) => {
          return (
            <React.Fragment key={i}>
              <Link to={`/chat/${item.chatId}`}>
                <div
                  data-aos="fade-up"
                  className="flex items-center space-x-4 border-[1px] rounded-full border-zinc-800 p-4"
                >
                  <div>
                    <img
                      src={
                        item.Pic != null
                          ? item.Pic
                          : "https://cdn-compiled-asset.piccollage.com/packs/media/assets/images/avatars/default-180e2e9af61799ca32e7da604646edd2.jpg"
                      }
                      className="object-cover w-20 h-20 rounded-full "
                      x
                      alt=""
                    />
                  </div>
                  <div className="space-y-1">
                    <h1 className="font-semibold ">{item.Name}</h1>
                    <p className="text-sm font-semibold text-gray-400 ">
                      {item.Profession}
                    </p>
                  </div>
                </div>
              </Link>
            </React.Fragment>
          );
        })
      )}
    </main>
  );
}
