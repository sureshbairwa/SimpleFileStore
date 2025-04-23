"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

import toast from 'react-hot-toast'

import axiosInstance from '@/lib/axios'
import Link from 'next/link'
import useAuthStore from '@/store/Auth'
import { useRouter } from 'next/navigation'


const Login = () => {

    const router = useRouter()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const {authCheck} = useAuthStore()

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        
        try {
            const response = await axiosInstance.post('/api/auth/login', formData);
            console.log(response.data)
            
          
            if (response.data.success===true) {
             
               
             
              toast.success("Login Successful", { duration: 4000 });
              authCheck();
              router.push('/dashboard')
              
              
             
            }else{
              toast.error(response.data.message ,{ duration: 4000 });
            }
          } catch (err:any) {
            console.log("error ",err.response.data.message)
            toast.error(err.response.data.message, { duration: 4000 });
          }
       
        
        
    }

    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className=" p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
    
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium ">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 block w-full border  rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
    
            <div>
              <label className="block text-sm font-medium ">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700  font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Login
            </button>
          </form>
    
          <p className="text-center text-sm  mt-4">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    );
    
}

export default Login
