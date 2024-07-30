"use client"

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputFile from '@/components/InputFile'
import InputTextArea from '@/components/InputTextArea'
import Spinner from '@/components/Spinner'
import { toast, Toast } from '@/components/Toast'
import { createGroup, searchStudents, Student } from '@/lib/actions/user.action'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { CiCircleRemove } from 'react-icons/ci'
import { FaSearch } from 'react-icons/fa'
import { IoCheckmarkCircle, IoPersonAddOutline } from 'react-icons/io5'
import { useDebouncedCallback } from 'use-debounce'

const GroupsPage = () => {


  const [group, setGroup] = useState<{
    author: string,
    name: string,
    description: string,
    members: Student[]
  }>({
    author: '',
    name: '',
    description: '',
    members: []
  })

  const [students, setStudents] = useState<Student[]>()

  const [search, setSearch] = useState('')

  const { data: session, status } = useSession()
  const user = session?.user || null


  useEffect(() => {
    if (user) {
      setGroup({
        ...group,
        author: user._id
      })
    }
  }
    , [user])


  const toggleMembers = (student: Student) => {
    // Check if an object with the given id already exists in the array
    const index = group.members.findIndex(obj => obj._id === student._id);

    if (index === -1) {
      // If the object does not exist, add it to the array
      setGroup({
        ...group,
        members: [...group.members, student]
      });
    } else {
      // If the object exists, remove it from the array
      const updatedArray = [...group.members];
      updatedArray.splice(index, 1);
      setGroup({
        ...group,
        members: updatedArray
      });
    }
  };

  const iconCondition = (student: Student) => {
    const index = group.members.findIndex(obj => obj._id === student._id);
    return index !== -1;
  };

  const findStudents = useDebouncedCallback(async (value: string) => {
    const res = await searchStudents(value)
    if (res.type === 'success') {
      setStudents(res.data)
    } else {
      toast(res.message, { type: 'error' })
    }
  }, 500)

  const handleSearch = (value: string) => {
    setSearch(value)
    findStudents(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(user && user.role === "TEACHER") {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      console.log(user._id);
      const res = await createGroup(group, formData)
      toast(res.message, { type: res.type === 'error' ? 'error' : 'success' })
    }
    
  }

  return (
    <>
    <Toast/>
    <div className='w-full grid grid-cols-[60%,auto] gap-4 overflow-auto'>
      <div className='border rounded-md px-4 py-2 min-w-[716px] overflow-auto'>
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-[20%,auto] gap-4 items-end'>
          <InputFile
            label='Profile Picture'
            name='groupProfilePicture'
            accept='image/*'
            height='180px'
          />
          <div className='grid '>
            <Input
              type='text'
              label='Group Name'
              name='groupName'
              className='mt-4'
              onChange={(e) => setGroup({ ...group, name: e.target.value })}
              value={group.name}
            />
            <InputTextArea
              label='Description'
              name='groupDescription'
              className='mt-4'
              onChange={(e) => setGroup({ ...group, description: e.target.value })}
              value={group.description}
            />
          </div>

          <Button
            type='submit'
            appearance='primary'

          >
            Create Group
          </Button>

        </form>
        <div className='py-4 text-2xl font-bold'>
          Add members
        </div>
        <div className='grid grid-cols-[auto,30px] items-center border-primary-light overflow-auto'>
          <input
            type="text"
            placeholder="Search"
            className='bg-primary-light focus:outline-none border-y border-l rounded-tl-full rounded-bl-full py-2 px-4'
            onChange={(e) => handleSearch(e.target.value)}
            value={search}
          />
          <div className='bg-primary-light h-full py-3 pr-6 border-y border-r rounded-r-full'><FaSearch /></div>
        </div>
        <div className='w-full bg-primary-light h-48 my-4 rounded-md'>
          <ul className='w-full h-full overflow-y-auto p-2'>
            {students?.map(student => (
              <li key={student._id} className='flex flex-row items-center justify-between p-2 border-b border-faded'>
                <div className='flex flex-row items-center gap-2'>
                  <Image
                    src={`${student.picture ? student.picture : "/assets/icons/avatar.svg"}`}
                    alt={student.name}
                    width={40}
                    height={40}
                    className={`w-10 h-10 rounded-full ${student.picture ? "" : "bg-slate-300 p-1"}`}
                  />
                  <div className='flex flex-col'>
                    <p className='font-semibold'>{student.name}</p>
                    <p className='text-sm'>{student.email}</p>
                  </div>
                </div>
                <div className='w-10 h-10 flex items-center justify-center' onClick={() => { toggleMembers(student) }}>
                  {
                    iconCondition(student) ? <IoCheckmarkCircle className='w-full text-3xl' /> : <IoPersonAddOutline className='w-full text-3xl' />
                  }
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='bg-primary-light border px-4 py-2 rounded-md min-w-[460px] overflow-auto'>
        <p className='text-2xl font-bold py-2'>Group members</p>
        <div className='w-full  p-1 sm:p-2 lg:p-4 flex flex-col gap-2'>


          <ul>
            {group.members?.map((student) => (

              <li key={student._id} className=' p-1 grid grid-cols-[10%,auto,10%] items-center wrap'>
                <Image
                  src={`${student.picture ? student.picture : "/assets/icons/avatar.svg"}`}
                  alt={student.name}
                  width={40}
                  height={40}
                  className={`w-10 h-10 rounded-full ${student.picture ? "" : "bg-slate-300 p-1"}`}
                />
                <div className='p-1'>
                  <div>{student.name}</div>
                  <div className="text-sm">{student.email}</div>
                </div>
                <div className='w-full h-full flex items-center' onClick={() => { toggleMembers(student) }}>
                  {
                    iconCondition(student) ? <CiCircleRemove className='w-full text-3xl' /> : <IoPersonAddOutline className='w-full text-3xl' />
                  }
                </div>
              </li>
            ))}
          </ul>


        </div>

      </div>
      <div className='col-span-2 m-auto w-1/4'>

      </div>
    </div>
    </>


  )
}

export default GroupsPage