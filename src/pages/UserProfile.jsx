import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { AiOutlineDelete } from "react-icons/ai";
import { useAnimation, motion } from "framer-motion";
import Emptyimg from "../images/Empty.png";
import UserProfileLoader from "../components/UserProfileLoader";
import { RxCross2 } from "react-icons/rx";
import { IoIosAdd } from "react-icons/io";
import ProfileImage from "../components/EditProfile/ProfileImage";
import { CiMenuFries } from "react-icons/ci";
import { BottomBar, HobbiesModel, Loader } from "../components";
import { useAuth } from "../ContextProvider/AuthContext";

export default function UserProfile() {
  const controls = useAnimation();
  const { currentUser } = useAuth();

  const jwt = currentUser.uid;
  const docref = doc(db, "USERS", jwt);
  const [isdelete, setisdelete] = useState(false);
  const [isselect, setisselect] = useState(false);
  const [isloading, setisloading] = useState(true);
  const [isPage, setisPage] = useState(true);
  const [editImage, setEditImage] = useState(false);
  const [Userdata, setUserdata] = useState({
    Pic: "",
    Name: "",
    Bio: "",
    hobbies: [],
    Posts: [],
  });

  const getPosts = async () => {
    try {
      const User = await getDoc(docref);
      setUserdata({
        ...Userdata,
        Pic: User?.data()?.Pic,
        Name: User?.data()?.Name,
        Bio: User?.data()?.Bio,
        hobbies: User?.data()?.hobbies,
        Posts: User?.data()?.Posts || [],
      });
      setisloading(false);
      setisPage(false);
    } catch (error) {
      console.log(error);
      setisloading(false);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);

  const deletePost = async (postId) => {
    try {
      setisloading(true);
      console.log(postId);
      const postIndex = Userdata.Posts.findIndex((post) => post.id === postId);
      console.log(postIndex);
      if (postIndex !== -1) {
        const updatedPosts = [
          ...Userdata.Posts.slice(0, postIndex),
          ...Userdata.Posts.slice(postIndex + 1),
        ];
        setUserdata({
          ...Userdata,
          Posts: updatedPosts,
        });
        await updateDoc(docref, { Posts: updatedPosts });
        setisdelete(false);
      } else {
        console.error("Post not found with postId:", postId);
      }
      setisloading(false);
    } catch (error) {
      console.error(error);
      setisloading(false);
    }
  };

  const deletehobbie = async (id) => {
    const currenthobbies = [...Userdata.hobbies];
    currenthobbies.splice(id, 1);
    await updateDoc(docref, { hobbies: currenthobbies });
    setUserdata({
      ...Userdata,
      hobbies: currenthobbies,
    });
  };

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

  console.log(Userdata?.Posts);

  return (
    <>
      {" "}
      {isPage ? <Loader /> : null}
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        <main>
          <nav className="p-4">
            <div className="flex justify-between w-full items-left">
              <div>
                <Link to={"/home"}>
                  <FaArrowLeft size={20} color="" />
                </Link>
              </div>
              <div className="text-center">
                <h1 className="font-semibold ">My Profile</h1>
              </div>
              <div>
                <Link to="/sidebar">
                  <CiMenuFries size={27} color="white" />
                </Link>
              </div>
            </div>
          </nav>
          <div className="flex items-start justify-start gap-2.5 mt-5 px-4">
            <div
              onClick={() => {
                setEditImage(true);
              }}
              className="max-w-[50vw]"
            >
              <Link to={"/profile"}>
                {/* {localStorage.getItem("UserPic") == "" ||
                localStorage.getItem("UserPic") == undefined ? ( */}
                <img
                  src={
                    !currentUser.pic
                      ? "https://firebasestorage.googleapis.com/v0/b/the-hub-97b71.appspot.com/o/6364b6fd26e2983209b93d18_ID_Playfal_DrawKit_Webflow_Display_2-min-png-934_2417--removebg-preview.png?alt=media&token=aa0f00e6-e1d5-4245-bfca-e5f6273ec980"
                      : currentUser.pic
                  }
                  className="object-cover rounded-full h-36 w-36"
                  alt={null}
                />
                {/* ) : ( */}
                {/* <img
                    src={localStorage.getItem("UserPic")}
                    className="object-cover mx-auto rounded-full w-36 h-36"
                    alt={localStorage.getItem("UserPic")}
                  /> */}
                {/* )} */}
              </Link>
            </div>
            {editImage && (
              <div>
                <ProfileImage setEditImage={setEditImage} />
              </div>
            )}
            <div className="max-w-[50vw] space-y-2">
              <h1 className="font-bold ">{Userdata?.Name}</h1>
              <p className="text-[11px] text-slate-400">{Userdata?.Bio}</p>
              <div className="flex space-x-3 ">
                <Link to={"/connections"}>
                  <button className="py-2 text-[9px] mt-2 font-semibold text-white rounded-full bg-[#1d9bf0] px-4 ">
                    Collabrates
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <h1 className="text-xl font-bold px-7 my-7">Your Hobbies</h1>
          <div className="grid grid-cols-3 gap-2 px-4 mx-auto my-3 text-center gap-y-3">
            <p className="px-6 py-2 flex rounded-full justify-around items-center bg-zinc-800 text-[13px]">
              <IoIosAdd
                cursor={"pointer"}
                onClick={() => {
                  setisselect(true);
                }}
                size={22}
                color={"white"}
              />
            </p>
            {Userdata?.hobbies?.map((item, i) => {
              return (
                <React.Fragment key={i}>
                  <p className="px-2.5 py-2 flex rounded-full justify-around items-center bg-zinc-800 text-[10px]">
                    {item}{" "}
                    <RxCross2
                      onClick={() => {
                        deletehobbie(i);
                      }}
                      cursor={"pointer"}
                      size={10}
                      color={"white"}
                    />
                  </p>
                </React.Fragment>
              );
            })}
          </div>
          <h1 className="text-xl font-bold px-7 my-7">Your Posts</h1>
          {isloading ? (
            <div className="flex flex-col items-center justify-center mt-10">
              <UserProfileLoader />
              <UserProfileLoader />
              <UserProfileLoader />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-5 mb-20 gap-7">
              {Userdata?.Posts != "" ? (
                Userdata?.Posts.map((item, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="max-w-md px-4 py-3 rounded-lg shadow-sm lg border-[1px]  border-zinc-800">
                        <div>
                          {item.image && (
                            <img
                              className="mx-auto rounded-xl w-[85vw] object-cover"
                              src={item?.image}
                              alt=""
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-5">
                          <div className="flex items-center gap-3 ">
                            <img
                              src={Userdata?.Pic}
                              className="object-cover w-12 h-12 rounded-full"
                              alt=""
                            />
                            <h1 className="text-xl font-semibold">
                              {item?.Name}
                            </h1>
                          </div>
                          <div
                            onClick={() => {
                              deletePost(item?.id);
                            }}
                          >
                            <AiOutlineDelete size={22} color="red" />
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6">{item?.Text}</p>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="flex flex-col items-center mt-1 space-y-3 text-cemt-11">
                  <img src={Emptyimg} alt="" className="w-60" />

                  <h1 className="text-sm font-semibold ">
                    You haven&apos;t posted anything yet!
                  </h1>
                </div>
              )}
            </div>
          )}
        </main>
      </motion.div>
      <BottomBar />
      {isselect ? <HobbiesModel setisselect={setisselect} /> : null}
    </>
  );
}
