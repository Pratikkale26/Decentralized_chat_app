import React, { useContext, useState } from 'react'
import { ChatAppContext } from '@/Context/ChatAppContext'
import Link from 'next/link';
import { connectWallet } from '@/utils/apiFeature';
import Model from './Model';

const Navbar = () => {
  const menuItems = [
    { menu: "Home", link: "/" },
    { menu: "All Users", link: "/about" },
    { menu: "Chat", link: "/chat" },
    { menu: "Contact", link: "/contact" },
    { menu: "Setting", link: "/register" },
    { menu: "FAQs", link: "/" }
  ];

  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  
  const chatContext = useContext(ChatAppContext);
  const Account = chatContext?.Account;
  const userName = chatContext?.userName;
  const createAccount = chatContext?.createAccount;

  return (
    <div className='text-2xl flex justify-between items-center py-2 mx-10 bg-gray-900 mt-5 rounded-2xl'>
      {/* logo - make it at start*/}
      <div className='w-12 h-12 bg-white  flex justify-start items-center ml-5'> 
        WeDapp
      </div>

      {/* menu items */}
      <div className='flex justify-center items-center'>
        {menuItems.map((item, index) => (
          <div onClick={() => setActive(index + 1)} key={index + 1} className='flex justify-center items-center'>

          <Link href={item.link} className='text-white mx-5'>{item.menu}</Link>
          </div>
        ))}
      </div>

      {/* Connect Wallet */}
      <div className="">
        {!Account ? (
          <button 
            className="text-white ml-5 flex justify-end items-end mr-10 bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <button 
            className="text-white bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700"
            onClick={() => setOpenModel(true)}
          >
            {userName || "Create Account"}
          </button>
        )}
      </div>

      {/* model component */}
      {openModel && (

        <Model openModel={setOpenModel}
        title="Welcome To"
        head="Chat buddy"
        info='Connect with your friends and chat with them' 
        smallInfo='Chat with your friends'
        images={'./chat.png'}
        functionName={createAccount}
        />)
      }

    </div>
  )
}

export default Navbar