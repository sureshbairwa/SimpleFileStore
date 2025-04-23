"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

import toast from 'react-hot-toast'
import Link from 'next/link'

import axiosInstance from '@/lib/axios'
import { useRouter } from 'next/navigation'

const SignUp = () => {

  const router = useRouter()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        
        try {
            const response = await axiosInstance.post('/api/auth/signup', formData);
            console.log(response.data)
            
          
            if (response.data.success===true) {
             
               router.push('/dashboard')
             
              toast.success("Signup Successful", { duration: 4000 });
              
             
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
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
    
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium ">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
    
            <div>
              <label className="block text-sm font-medium ">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
    
            <div>
              <label className="block text-sm font-medium ">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
    
            <div>
              <label className="block text-sm font-medium ">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
    
            <button
              type="submit"
              className="w-full rounded-lg bg-green-600 hover:bg-green-700  font-semibold py-2 px-4 cursor-pointer transition duration-200"
            >
              Sign Up
            </button>
          </form>
    
          <p className="text-center text-sm  mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
}

export default SignUp
