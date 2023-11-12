import React from "react";
import { ProfilePic } from "../index";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <>
      <nav className="flex items-center justify-between p-4 border-b-[1px] border-gray-300">
        <Link to="/">
          <IoArrowBackOutline cursor={"pointer"} size="25" color="#3a4e67" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-slate-700">Events</h1>
        </div>
        <ProfilePic />
      </nav>
    </>
  );
}
