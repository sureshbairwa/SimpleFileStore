"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ModeToggle } from '@/components/ui/modeToggle';
import useAuthStore from '@/store/Auth';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const Navbar = () => {

  const router = useRouter()

  const {isLoggedIn}=useAuthStore()

  const logout = async()=>{
    try {

      const res=await axiosInstance.post('/api/auth/logout')

      console.log("res logout",res)
      if(res.data.success){
          toast.success(res.data.message)

          console.log("login successful")
          
         
          window.location.reload()
         
          
      }else{

          toast.error(res.data.message)
      }
      
  } catch (error:any) {
      console.log("error in logout",error)
      toast.error(error.response.data.message)
      
  }
  
  }

  return (
    <header className="sticky top-0 z-[100] bg-white dark:bg-black   border-b border-b-cyan-600 shadow-md w-full">

      <div className='flex items-center justify-between  '>
        <Link href="/dashboard">
        <span  className="cursor-pointer ml-4 text-2xl font-bold text-gray-800 dark:text-white px-6 py-4">
        SimpleFileStore
        </span>
        </Link>
      
      <div className="flex justify-end items-center px-6 py-3 space-x-4">
        
        <ModeToggle />

        {!isLoggedIn ? (
          <>
            <Link href="/signup">
              <Button className="cursor-pointer" variant="link">
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button
                className="cursor-pointer hover:text-blue-500"
                variant="outline"
              >
                Login
              </Button>
            </Link>
          </>
        ) : (
          <Button
            onClick={logout}
            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
            variant="default"
          >
            Logout
          </Button>
        )}
      </div>
      </div>
    </header>
  )
}

export default Navbar
