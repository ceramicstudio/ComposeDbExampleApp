import Image from 'next/image'
import Link from 'next/link'

import { FaHome, FaUser, FaHashtag, FaPen, FaCog } from "react-icons/fa";

import ceramicLogo from "../public/ceramicLogo.png"

import { SidebarProps } from '../types';


export const Sidebar = ({name, username, id}: SidebarProps) => {

  return (
    <div className="sidebar">
      <div className="top">
        <div className="logoContainer">
          <Image
            src={ceramicLogo}
          />
        </div>
        <Link href = "/">
          <a>
            <FaHome /> Home
          </a>
        </Link>
        <Link href = {`${id}`}>
          <a>
            <FaUser /> Profile
          </a>
        </Link>
        {/* <Link href = "explore">
          <a>
            <FaHashtag /> Explore
          </a>
        </Link>
        <Link href = "settings">
          <a>
            <FaCog /> Settings
          </a>
        </Link>
        <a>
          <FaPen /> ???
        </a> */}
      </div>
      <div className="bottom">
        {name !== undefined ? (
          <div className="you">
            <b>{name}</b> <br />
            <span>@{username}</span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
