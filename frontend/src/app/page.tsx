'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  useEffect(()=>{
    router.push('/dashboard')
  },[])
  return (
    <div className="flex  flex-col items-center justify-between w-full">
     
      <div>
        <p>

        </p>
    
      
      </div>
      
    </div>
  );
}
