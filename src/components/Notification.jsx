import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import Loader from "./Loader";

export default function Notification() {
  const jwt = localStorage.getItem("jwt");
  const [isloading, setisloading] = useState(true);
  const [Notifications, setNotifications] = useState();
  const docref = doc(db, "USERS", jwt);

  const getNotifications = async () => {
    try {
      const User = await getDoc(docref);
      setNotifications(User.data().notifications || []);
      setisloading(false);
    } catch (error) {
      console.log(error);
      setisloading(false);
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);

  const DeleteNotification = async (i) => {
    setisloading(true);
    try {
      const updatedNotifications = [...Notifications];
      updatedNotifications.splice(i, 1);
      await updateDoc(docref, { notifications: updatedNotifications });
      setNotifications(updatedNotifications);
      setisloading(false);
    } catch (error) {
      console.log(error);
      setisloading(false);
    }
  };

  // const Collabrate = async (userid) => {
  //   try {
  //     await updateDoc(docref, {Collabraters:userid});
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <>
      {isloading ? <Loader /> : null}
      <main className="flex flex-col gap-4 mt-2">
        {Notifications?.map((_, i) => {
          return (
            <React.Fragment key={i}>
              <div className="flex items-center justify-around gap-10 rounded-lg border-[1px] mx-4 p-3 border-zinc-800 shadow-lg shadow-zinc-900">
                <div className="flex items-center gap-5">
                  <img
                    className="object-cover w-20 h-20 rounded-full"
                    src={_.Pic}
                    alt={_.Pic}
                  />
                  <div className="space-y-2.5">
                    <h1 className="text-lg font-bold">{_.Name}</h1>
                    <p className="text-sm font-semibold">
                      Want's to Collabrate with you
                    </p>
                    {/* <div className="flex gap-3">
                      <h1
                        onClick={Collabrate}
                        className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-full cursor-pointer"
                      >
                        Accept
                      </h1>
                    </div> */}
                  </div>
                </div>
                <AiOutlineDelete
                  onClick={() => {
                    DeleteNotification(i);
                  }}
                  size={27}
                  cursor={"pointer"}
                  color="white"
                />
              </div>
            </React.Fragment>
          );
        })}
      </main>
    </>
  );
}
