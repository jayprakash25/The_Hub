import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import NotifyLoader from "./NotifyLoader";
import { RxCross2 } from "react-icons/rx";
import { TiTickOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import Emptyimg from "../../images/Empty.png";

export default function Notification() {
  const jwt = localStorage.getItem("jwt");
  const [isloading, setisloading] = useState(true);
  const [Notifications, setNotifications] = useState();
  const [collabs, setcollabs] = useState([]);
  const [isshow, setisshow] = useState(false);
  const navigate = useNavigate();

  const getNotifications = async () => {
    try {
      const docref = doc(db, "USERS", jwt);
      const User = await getDoc(docref);
      const filteredCollabs = User?.data()?.collabs || [];
      setcollabs(filteredCollabs);
      const filteredNotifications = User.data()?.notifications.filter(
        (notification) => {
          return !filteredCollabs.includes(notification.id);
        }
      );

      setNotifications(filteredNotifications || []);
      setisloading(false);
    } catch (error) {
      console.log(error);
      setisloading(false);
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);

  console.log(Notifications);

  const DeleteNotification = async (i) => {
    setisloading(true);
    try {
      const updatedNotifications = [...Notifications];
      updatedNotifications.splice(i, 1);
      const docRef = doc(db, "USERS", jwt);
      await updateDoc(docRef, { notifications: updatedNotifications });
      setNotifications(updatedNotifications);
      setisloading(false);
    } catch (error) {
      console.log(error);
      setisloading(false);
    }
  };

  const acceptRequest = async (userid) => {
    try {
      const updatedCuurentCollabs = [...collabs, userid];
      const docRef = doc(db, "USERS", jwt);
      const CurrentUser = await getDoc(docRef);
      const otheruser = doc(db, "USERS", userid);
      const otheruserdata = await getDoc(otheruser);
      await updateDoc(docRef, { collabs: updatedCuurentCollabs });
      const userCurrentCollabsNotification =
        CurrentUser?.data()?.notifications || [];
      const notification = {
        id: userid,
        Pic: otheruserdata?.data()?.Pic,
        message: `${otheruserdata?.data()?.Name}  accepted your Request`,
      };
      await updateDoc(docRef, {
        notifications: [...userCurrentCollabsNotification, notification],
      });
      DeleteNotification(Notifications?.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isloading ? (
        <NotifyLoader />
      ) : (
        <main className="flex flex-col gap-4 mt-2">
          {Notifications.length > 0 ? (
            Notifications?.map((_, i) => {
              return (
                <React.Fragment key={i}>
                  <div className="flex items-center justify-around gap-2 rounded-lg border-[1px] mx-4 p-3 border-zinc-800 shadow-lg shadow-zinc-900">
                    <div className="flex items-center gap-5">
                      <img
                        className="object-cover w-16 h-16 rounded-full"
                        src={_.Pic}
                        alt={_.Pic}
                      />
                      <div className="space-y-1">
                        <h1 className="text-lg font-bold">{_.Name}</h1>
                        <p className="text-sm font-semibold">{_.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <RxCross2
                        onClick={() => {
                          DeleteNotification(i);
                        }}
                        size={25}
                        cursor={"pointer"}
                        color="red"
                      />
                      <TiTickOutline
                        onClick={() => {
                          setisshow(true);
                        }}
                        size={25}
                        color="green"
                      />
                    </div>
                  </div>
                  {isshow ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-25 backdrop-blur-md">
                      <ul className="mx-5 space-y-4 rounded-md bg-zinc-900">
                        <li className="cursor-pointer gap-7">
                          <h1 className="p-4 ">
                            By clicking 'Collab,' you agree to share your
                            details with other users for the purpose of
                            connecting and collaborating.
                          </h1>
                          <div className="border-b-[1px] border-zinc-700 w-full"></div>
                          <div className="flex items-center justify-center">
                            <div
                              onClick={() => {
                                setisshow(false);
                              }}
                              className="flex justify-center gap-2 px-4 pb-4 mt-3"
                            >
                              <h1 className="text-lg text-red-500">Cancel</h1>
                            </div>
                            <div
                              onClick={() => {
                                acceptRequest(_.id);
                              }}
                              className="flex justify-center gap-2 px-4 pb-4 mt-3"
                            >
                              <h1 className="text-lg text-green-500">Collab</h1>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })
          ) : (
            <div className="flex flex-col items-center mt-24 space-y-3 text-cemt-11">
              <img src={Emptyimg} alt="" className="w-60" />
              <h1 className="text-sm font-semibold ">
                You dont have any Notifications !
              </h1>
            </div>
          )}
        </main>
      )}
    </>
  );
}
