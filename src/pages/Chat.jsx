import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../Firebase";
import { useParams } from "react-router-dom";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [oppUserData, setOppositeUser] = useState({});
  const messageRef = collection(db, "messages");
  const photoURL = localStorage.getItem("UserPic");
  const { id } = useParams();
  const { uid, displayName } = auth.currentUser;

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    await addDoc(collection(db, "messages"), {
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
      room: id,
    });
    setMessage("");
  };
  const [messages, setMessages] = useState([]);

  const getOppositeUserId = () => {
    const userIds = id.split("-");
    return userIds.find((userId) => userId != uid);
  };

  const getOppUserData = async () => {
    const oppUserId = getOppositeUserId();
    const docRef = doc(db, "USERS", oppUserId);
    const userSnapshot = await getDoc(docRef);
    // console.log(userSnapshot.data());
    setOppositeUser(userSnapshot.data());

    console.log(oppUserData);
  };

  useEffect(() => {
    const queryMessages = query(
      messageRef,
      where("room", "==", id),
      orderBy("createdAt")
    );

    getOppUserData();

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });

      setMessages(messages);
    });

    return () => unsubscribe();
  }, [id]);

  return (
    <>
      <div className="w-full text-2xl flex space-x-5 mb-4 items-center  py-2 bg-[#383838] text-black font-semibold rounded-b-md px-4">
        <img className="w-14 h-14 rounded-full" src={oppUserData.Pic} />
        <h1>{oppUserData.Name}</h1>
      </div>
      <div className="space-y-2 mb-16 px-2.5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.uid === uid ? " flex-row-reverse" : "items-start"
            }  gap-2.5`}
          >
            <img
              className="w-8 h-8 rounded-full"
              src={message.avatar}
              alt={`${message.name} image`}
            />
            <div className="flex flex-col gap-1 w-[50vw] max-w-[320px]">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {message.name}
                </span>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {/* {message.createdAt} */}
                </span>
              </div>
              <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                <p className="text-sm font-normal text-gray-900 dark:text-white">
                  {message.text}
                </p>
              </div>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {/* {message.status} */}
                Delivered
              </span>
            </div>
          </div>
        ))}

        <div className="fixed  bottom-0 flex items-center justify-around py-2 space-x-4 left-10">
          <input
            type="text"
            placeholder="type you message here"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            className="w-[70vw] focus:outline-none text-[#bebebe] text-sm py-4 px-6 rounded-3xl bg-[#383838]"
          />
          <button className="outline-none" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}
