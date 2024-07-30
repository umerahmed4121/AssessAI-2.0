import Link from 'next/link'
import React from 'react'

const StudentDashboardPage = () => {
  return (
    <div className='absolute top-0 left-0 w-full h-screen px-4 sm:pl-[calc(30%+0.75rem)] lg:pl-[calc(20%+1.5rem)] bg-cover bg-[url(/assets/dashboard-bg-mobile.jpg)] md:bg-[url(/assets/dashboard-bg.jpg)]'>
      <div className="flex w-full pt-[100px] ">
        <div className="w-full md:w-[400px] bg-[#6a567791] md:bg-transparent rounded-md p-3">
          <h1 className="text-2xl lg:text-5xl font-bold">Dashboard</h1>
          <div className=" rounded-md my-4 ">
            <p className="text-lg lg:text-2xl">Welcome to your dashboard!</p>
            <p className="text-base lg:text-lg  my-6">Get started by exploring your quizzes here</p>
            <div className="w-full flex items-center py-3">
              <button className="px-4 py-2 text-white lg:text-2xl bg-secondary rounded-md">
                <Link href="student/quizzes">
                  Quizzes
                </Link>
              </button>
            </div>
            <div className="hidden w-full lg:flex flex-col justify-center">
              <ul className="w-full flex flex-wrap justify-center gap-2">
                <li>| Assignments |</li>
                <li>Gradebook |</li>
                <li>AI Quizzes |</li>
                <li>Groups |</li>
                <li>Setting |</li>
                <li>Help & Support |</li>
              </ul>
              <p className="text-center">Coming soon...</p>
            </div>


          </div>


        </div>

      </div>
    </div>
  )
}

export default StudentDashboardPage