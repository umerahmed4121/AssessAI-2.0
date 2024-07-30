"use client"
import { useState, useEffect } from "react";
import { signOut, useSession } from 'next-auth/react'
import { NavLinks, studentDashboardNavLinks, teacherDashboardNavLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { useRouter } from 'next/navigation';
import Loader from "../Loader";
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars } from 'react-icons/fa';




const Sidebar = () => {

  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user as SessionUser
  const profilePicture = user?.picture ? user.picture : "/assets/icons/avatar.svg";

  const [loading, setLoading] = useState(false)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);



  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };


  // while (status === 'loading') {
  //   return (
  //     <div className='absolute top-1/2 left-1/2'>
  //       <ColorRing
  //         visible={true}
  //         height="80"
  //         width="80"
  //         ariaLabel="color-ring-loading"
  //         wrapperStyle={{}}
  //         wrapperClass="color-ring-wrapper"
  //         colors={[colors.secondaryLight, colors.secondary, colors.secondaryDark, colors.secondaryDark2, colors.secondaryDark3, colors.secondaryDark4]}
  //       />
  //     </div>
  //   )
  // }

  const getPathname = (href: string, pathname: string) => {
    const path = pathname.split('/');
    const hrefPath = href.split('/');
    return path.pop() === hrefPath.pop()


  }

  const pathname = usePathname()
  let navLinks: NavLinks[] = []
  if (pathname.includes('student')) {
    navLinks = studentDashboardNavLinks
  } else if (pathname.includes('teacher')) {
    navLinks = teacherDashboardNavLinks
  }

  return (
    <div className='fixed top-0 w-full h-[60px] z-10'>
      <Loader visible={loading} />

      <div className="bg-gradient-to-l from-secondary to-[#6a567791] h-[60px] p-1">

        <motion.nav id='navbar' className="p-1 flex items-center fixed top-0 w-full h-[60px] my_blur_2">

          {(isMobileMenuOpen || loading) && (
            <div className='absolute top-[60px] left-0 right-0 w-screen h-screen bg-[#00000080] z-10'>

            </div>
          )}


          <div className="container mx-auto flex justify-between items-center">
            {/* Logo or Branding */}
            <Link href="/" className="flex flex-row gap-2 text-white text-xl font-bold">
              <Image src="/assets/logo-text.png" width={130} height={130} alt='AssessAi' />
              
            </Link>

            <div className=' w-[100px] hidden md:flex md:flex-col items-center'>
              {(status === 'authenticated' && session) && (
                <div
                  className="hidden md:flex md:justify-center"
                >
                  {user?.picture ? (
                    <Image src={user.picture} alt='Profile' width={30} height={30} className='w-10 h-10 rounded-full cursor-pointer' />
                  ) : (
                    <Image src="/assets/icons/avatar.svg" alt='Profile' width={30} height={30} className='w-10 h-10 bg-white p-1 rounded-full cursor-pointer' />
                  )}
                </div>
              )}

            </div>

            {/* Mobile Navigation Toggle Button */}
            <button
              className="sm:hidden text-white z-20"
              onClick={toggleMobileMenu}
            >
              <FaBars />
            </button>

            {/* Mobile Navigation */}

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.aside
                  initial={{ width: 0 }}
                  animate={{
                    width: '70%',
                  }}
                  exit={{
                    width: 0,
                    transition: { duration: 0.2 }
                  }}

                  className={`md:hidden w-[70%] h-screen absolute top-full right-0 bg-primary-light p-6 z-20`}
                >
                  <ul className="flex flex-col items-end space-y-2">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={index}
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.1, delay: index * 0.1, ease: "easeInOut" }}
                        exit={{ opacity: 0, x: -50, transition: { duration: 0.1 } }}
                        className="text-white text-base py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href={link.link}>{link.label}</Link>
                      </motion.li>
                    ))}

                    {/* <motion.span className='w-full h-0.5 bg-white' /> */}

                    <motion.li
                      key={"signout"}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                      }}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.1, delay: navLinks.length * 0.1, ease: "easeInOut" }}
                      exit={{ opacity: 0, x: -50, transition: { duration: 0.1 } }}

                      whileHover={{ color: '#ff9900', }}
                      className="text-white text-right text-base py-2 cursor-pointer"
                      onClick={() => {
                        setLoading(true)
                        if (session) {
                          signOut({ callbackUrl: '/' })
                        }
                      }}
                    >Sign out</motion.li>




                  </ul>



                </motion.aside>
              )}
            </AnimatePresence>

            {/* <Image src={"/assets/icons/google.svg"} width={25} height={25} className='rounded-full cursor-pointer' /> */}
          </div>
        </motion.nav>

      </div>
      <div className="hidden sm:flex sm:w-[30%] lg:w-[20%] h-screen bg-[#6a567791] px-3 py-4">
        <div className='w-full h-full flex flex-col'>
          {/* <h1 className='text-xl  pt-2 pb-12 px-2 h-fit '>AssessAI</h1> */}

          <ul className={`h-[calc(100vh-80px)] ${navLinks.length === 0 ? 'hidden' : 'flex'} flex flex-col items-start justify-evenly text-2xl`}>
            {navLinks.map((link, index) => (
              <li
                key={index}
                className={`text-white w-full px-1 py-2 cursor-pointer rounded-md ${getPathname(link.link, pathname) ? "bg-secondary  hover:text-white" : " hover:text-secondary hover:bg-[#ffffff80]"}`}>
                <Link
                  href={link.link}
                  className={`flex flex-row items-center gap-2 cursor-pointer `}>
                  <div className="p-1">{link.icon}</div>
                  <div>{link.label}</div>
                </Link>


              </li>
            ))}
            {navLinks.length !== 0 && (
              <li className="w-full">
                <div className='w-full flex flex-row items-center gap-2 text-white py-2 cursor-pointer rounded-md hover:text-secondary hover:bg-[#ffffff80] '
                  onClick={() => {
                    setLoading(true)
                    if (session) {
                      signOut({ callbackUrl: '/' })
                    }
                  }} >
                  <div><MdLogout /></div>
                  <div>Logout</div>
                </div>
              </li>
            )}

          </ul>
          {navLinks.length === 0 && (
            // Loading skeleton
            <ul>
              {
                [...Array(5)].map((_, i) => (
                  <li key={i}>
                    <div className="p-4 max-w-sm w-full ">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-6 py-1">
                          <div className="h-2 bg-slate-200 rounded"></div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                              <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              }

            </ul>
          )}


        </div>
      </div>

    </div>
  )
}

export default Sidebar