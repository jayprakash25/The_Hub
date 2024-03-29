import { useEffect, useRef, useState } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { db, storage } from "../Firebase";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { useAuth } from "../ContextProvider/AuthContext";
import { TfiGallery } from "react-icons/tfi";
import { BottomBar } from "../components";

export default function Post() {
  const imageref = useRef();
  const { currentUser } = useAuth();
  const jwt = currentUser.uid;
  const [blobimg, setblobimg] = useState({ image: "" });
  const [uploadimage, setuploadimage] = useState();
  const [isloading, setisloading] = useState(false);
  const navigate = useNavigate();
  const [user, setuser] = useState({
    name: "",
    pic: "",
    profession: "",
  });
  const [post, setpost] = useState({
    image: "",
    Text: "",
    Name: "",
    Pic: "",
    likes: 0,
    dislikes: 0,
  });

  const uploadPost = async () => {
    if (!blobimg) {
      alert("Post");
      return;
    }
    setisloading(true);
    try {
      const Storageref = ref(storage, `${"image"}/${uploadimage?.name}`);
      await uploadBytes(Storageref, uploadimage);
      const downloadURL = await getDownloadURL(Storageref);
      const docref = doc(db, "USERS", jwt);
      const User = await getDoc(docref);
      const existingPosts = User.data().Posts || [];
      const postId = `${new Date().getTime().toString()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      const updatedPost = {
        ...post,
        image: downloadURL,
        Name: User.data().Name,
        Pic: User.data().Pic,
        id: postId,
      };
      const updatedPostArray = [...existingPosts, updatedPost];
      await updateDoc(docref, {
        Posts: updatedPostArray,
      });
      setisloading(false);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchdetails = async () => {
    try {
      setisloading(true);
      const docref = doc(db, "USERS", jwt);
      const CurrUser = await getDoc(docref);
      setuser({
        ...user,
        name: CurrUser.data().Name,
        pic: CurrUser.data().Pic,
        profession: CurrUser.data().Profession,
      });
      setisloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchdetails();
  }, []);

  return (
    <>
      <div data-aos="fade-left">
        {isloading ? <Loader /> : null}
        <div className="flex justify-between p-5">
          <h1 className="text-lg font-semibold">Post</h1>
          <Link to={`/profile`}>
            <IoMdArrowBack size={28} color="white" />
          </Link>
        </div>
        <div className="bg-[#302d2d] p-5 w-[93vw] rounded-xl mx-auto   mb-24 mt-5">
          <div className="flex gap-5">
            <div>
              <img
                src={
                  !user.pic
                    ? "https://cdn-compiled-asset.piccollage.com/packs/media/assets/images/avatars/default-180e2e9af61799ca32e7da604646edd2.jpg"
                    : user.pic
                }
                alt={user.pic}
                className="object-cover w-16 h-16 rounded-full"
              />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-lg font-semibold">{user.name}</h1>
              <p className="text-sm">{user.profession}</p>
            </div>
          </div>

          <div>
            <textarea
              value={post.Text}
              onChange={(e) => {
                setpost({ ...post, Text: e.target.value });
              }}
              type="text"
              placeholder="Share your business story"
              className="bg-transparent border-b-[2px] py-8 w-full border-zinc-700 outline-none"
            />
          </div>

          {blobimg.image ? (
            <div>
              <img
                className="mx-auto my-5 rounded-lg"
                src={blobimg.image}
                alt=""
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-4">
              <TfiGallery
                onClick={() => {
                  imageref.current.click();
                }}
                color="zinc"
                cursor={"pointer"}
                size={16}
              />
              <h1 className="text-[11.5px]">Media</h1>
            </div>
          )}
          <input
            ref={imageref}
            k
            className="hidden px-4 py-2 border-2 outline-none"
            type="file"
            onChange={(e) => {
              setblobimg({
                ...blobimg,
                image: URL.createObjectURL(e.target.files[0]),
              });
              setuploadimage(e.target.files[0]);
            }}
          />
          {blobimg.image ? (
            <div className="flex items-center justify-between">
              <div>
                <button
                  className="py-2 text-[10.5px] mt-3 font-semibold text-white rounded-full bg-[#1d9bf0] px-7"
                  onClick={uploadPost}
                >
                  Post
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <BottomBar />
    </>
  );
}
