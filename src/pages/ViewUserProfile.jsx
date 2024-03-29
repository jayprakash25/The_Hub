import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Firebase";
import { Loader } from "../components";
import { useAnimation, motion } from "framer-motion";
import { useAuth } from "../ContextProvider/AuthContext";

export default function ViewUserProfile() {
  const navigate = useNavigate();
  const { userid } = useParams();
  const { currentUser } = useAuth();

  const jwt = currentUser.uid;
  const docref = doc(db, "USERS", userid);
  const controls = useAnimation();
  const [isloading, setisloading] = useState(true);
  const [popup, setpopup] = useState(false);
  const [isexists, setisexists] = useState(false);
  const [userCollabs, setUserCollabs] = useState([]);
  const [Userdata, setUserdata] = useState({
    Pic: "",
    Name: "",
    Bio: "",
    Posts: [],
    hobbies: [],
  });

  useEffect(() => {
    const startAnimation = async () => {
      await controls.start("animate");
    };
    startAnimation();
  }, [controls]);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const pageTransition = { duration: 0.5 };

  const currentUserData = async () => {
    const snapshot = await getDoc(docref);
    (await snapshot.data()?.notifications) || [];
    const collabs = (await snapshot.data()?.collabs) || [];
    setUserCollabs(collabs);
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const User = await getDoc(docref);
        setUserdata((prevUserdata) => ({
          ...prevUserdata,
          id: User.id,
          Pic: User?.data().Pic,
          Name: User?.data().Name,
          Bio: User?.data().Bio,
          Posts: User?.data().Posts || [],
          hobbies: User?.data().hobbies || [],
        }));
        setisloading(false);
      } catch (error) {
        console.log(error);
        setisloading(false);
      }
    };

    getPosts();
    currentUserData();
  }, []);

  const sendCollab = async (senderId, receiverId) => {
    try {
      setisloading(true);
      const requestsRef = collection(db, "connectionRequests");
      const forwardQuery = query(
        requestsRef,
        where("senderId", "==", senderId),
        where("receiverId", "==", receiverId)
      );
      const reverseQuery = query(
        requestsRef,
        where("senderId", "==", receiverId),
        where("receiverId", "==", senderId)
      );
      const [forwardSnapshot, reverseSnapshot] = await Promise.all([
        getDocs(forwardQuery),
        getDocs(reverseQuery),
      ]);
      if (!forwardSnapshot.empty || !reverseSnapshot.empty) {
        console.log("A pending request already exists.");
        setpopup(true);
      } else {
        const newRequest = {
          senderId: senderId,
          receiverId: receiverId,
          status: "pending",
          timestamp: new Date(),
        };
        await addDoc(requestsRef, newRequest);
        console.log("Collab request sent successfully.");
        navigate("/people");
      }
    } catch (error) {
      console.error("Error sending collab request: ", error);
    } finally {
      setisloading(false);
    }
  };
  const [connectionStatus, setConnectionStatus] = useState("");

  const checkConnection = async (targetUserId) => {
    try {
      // Assuming 'jwt' is the current user's ID and 'db' is your Firestore database instance

      // Query for any sent requests from the current user to the target user
      const sentRequestQuery = query(
        collection(db, "connectionRequests"),
        where("senderId", "==", jwt),
        where("receiverId", "==", targetUserId)
      );

      // Query for any received requests from the target user to the current user
      const receivedRequestQuery = query(
        collection(db, "connectionRequests"),
        where("senderId", "==", targetUserId),
        where("receiverId", "==", jwt)
      );

      // Fetch both sets of requests simultaneously
      const [sentRequestsSnapshot, receivedRequestsSnapshot] =
        await Promise.all([
          getDocs(sentRequestQuery),
          getDocs(receivedRequestQuery),
        ]);

      // Analyze the snapshots to determine the connection status
      if (!sentRequestsSnapshot.empty) {
        const request = sentRequestsSnapshot.docs[0].data();
        if (request.status === "accepted") {
          console.log("Already connected.");
          setConnectionStatus("connected"); // Handle the connected status
        } else if (request.status === "pending") {
          console.log("Connection request is pending.");
          setConnectionStatus("pending"); // Handle the pending status
        }
      } else if (!receivedRequestsSnapshot.empty) {
        const request = receivedRequestsSnapshot.docs[0].data();
        if (request.status === "accepted") {
          console.log("Already connected.");
          setConnectionStatus("connected"); // Handle the connected status
        } else if (request.status === "pending") {
          console.log("Connection request received is pending.");
          setConnectionStatus("pending"); // Handle the case where the target user has sent a pending request
        }
      } else {
        console.log("No connection or pending request found.");
        setConnectionStatus("none"); // No connection or pending request exists
      }
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  };

  useEffect(() => {
    checkConnection(userid);
    console.log(isexists);
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {isloading ? <Loader /> : null}
      <nav className="p-4">
        <div className="flex items-center w-[55vw] justify-between">
          <div>
            <Link to={"/people"}>
              <FaArrowLeft size={20} color="white" />
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold">View Profile</h1>
          </div>
        </div>
      </nav>

      <div className="flex items-start justify-center gap-5 mt-7">
        <div className="">
          {Userdata.Pic == "" || Userdata.Pic == null ? (
            <img
              src={
                "https://cdn-compiled-asset.piccollage.com/packs/media/assets/images/avatars/default-180e2e9af61799ca32e7da604646edd2.jpg"
              }
              className="object-cover rounded-full w-36 h-36"
              alt={Userdata.Pic}
            />
          ) : (
            <img
              src={Userdata.Pic}
              className="object-cover rounded-full w-36 h-36"
              alt={Userdata.Pic}
            />
          )}
        </div>
        <div className="max-w-[55vw] space-y-4">
          <h1 className="font-bold ">{Userdata.Name}</h1>
          <p className="text-[11px] text-slate-400">{Userdata.Bio}</p>
          {connectionStatus === "connected" ? (
            <button className="inline-flex items-center py-2 text-sm text-center text-white border-[1px] border-blue-600 rounded-full first-letter:font-medium px-7">
              Connected
            </button>
          ) : connectionStatus === "pending" ? (
            <button className="inline-flex items-center py-2 text-[9px] text-center text-white border-[1px] border-blue-600 rounded-full first-letter:font-medium px-7">
              Connection Sent
            </button>
          ) : (
            <button
              onClick={() => sendCollab(jwt, userid)}
              className="py-1.5 px-8 text-[9px] font-semibold text-white rounded-full bg-[#1d9bf0]"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      <h1 className="text-xl font-bold px-7 my-7">Hobbies</h1>
      <div className="grid grid-cols-3 gap-2 px-5 mx-auto my-3 text-center">
        {Userdata?.hobbies?.map((item, i) => {
          return (
            <React.Fragment key={i}>
              <p className="px-4 py-2 flex rounded-full justify-around items-center bg-zinc-800 text-[13px]">
                {item}
              </p>
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex flex-col items-center justify-center my-10 gap-7">
        <div className="flex flex-col items-center justify-center mt-5 mb-20 gap-7">
          {Userdata?.Posts?.map((item, i) => {
            return (
              <React.Fragment key={i}>
                <div className="max-w-md px-4 py-3 rounded-lg shadow-sm border-[1px] border-zinc-800">
                  <div>
                    <img
                      className="mx-auto rounded-lg w-[85vw] object-cover"
                      src={item.image}
                      alt={item.image}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 mt-5">
                      <img
                        src={item.Pic}
                        className="object-cover w-12 h-12 rounded-full"
                        alt={item.Pic}
                      />
                      <h1 className="text-xl font-semibold">{item.Name}</h1>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6">{item.Text}</p>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {popup ? alert("req already sent") : null}
    </motion.div>
  );
}
