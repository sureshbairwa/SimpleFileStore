import React from 'react'
import { Button } from "@/components/ui/button"

const GotoLogin = () => {
  return (
    <div className='h-screen flex items-center justify-center'>

        <div className='flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-bold text-gray-800'>Please Login First</h1>
            <p className='text-gray-500'>You need to login to access this page.</p>
            <Button variant="outline" className='mt-4 cursor-pointer' onClick={()=>window.location.href="/login"}>Go to Login</Button>
        </div>
      
    </div>
  )
}

export default GotoLogin
