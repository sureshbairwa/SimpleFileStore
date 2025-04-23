"use client"
import React, { useEffect, useState } from 'react'

import axiosInstance from '@/lib/axios'
import Show from '@/components/Show'
import useFileStore from '@/store/File'

const page = () => {

  const [isLoading, setIsLoading] = useState(true)
  const { files, setFiles } = useFileStore()


  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axiosInstance.get('/api/file/all/videos')
        setFiles(response.data.files)
        setIsLoading(false)
      }
      catch (error) {
        setIsLoading(false)
        console.error(error)
      }
    }

    fetchFiles()
  },[])


  if (isLoading) {
    return <div>Loading...</div>
  }
  if (files.length === 0) {
    return <div>No files found</div>
  }

  return (
    <div>

      <Show />

      
    </div>
  )
}

export default page
