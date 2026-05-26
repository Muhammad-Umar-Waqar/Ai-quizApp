import ProfileUpload from '@/app/components/ProfileUpload'
import React from 'react'


function page() {
  return (
    <div className="max-w-lg mx-auto p-8">
    <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
    <ProfileUpload />
  </div>
  )
}

export default page