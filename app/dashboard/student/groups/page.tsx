"use client"

import { getGroupByCreator } from '@/lib/actions/user.action'
import { IGroup } from '@/models/group/group.model'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaSearch } from 'react-icons/fa'

const GroupPage = () => {

    const { data: session, status } = useSession()
    const user = session?.user as SessionUser


    const [loading, setLoading] = useState(false)

    const [groups, setGroups] = useState<IGroup[] | []>([])
    const [search, setSearch] = useState('')
    const handleSearch = (search: string) => {
        setSearch(search)
    }

    useEffect(() => {
        const fetchGroups = async () => {
            
            const res = await getGroupByCreator(user?._id)
            if (res.type === 'error') {
                console.log(res.message);
            } else if (res.type === 'success') {
                setGroups(res.data)
            }
            
        }
        fetchGroups()
    }, [status === 'authenticated'])



    return (
        <div>

            <h1 className='my-4'>Groups</h1>

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
                    {groups?.map(group => (
                        <li key={group._id} className='flex flex-row items-center justify-between p-2 border-b border-faded'>
                            <div className='flex flex-row items-center gap-2'>
                                <Image
                                    src={`${group.picture ? group.picture : "/assets/icons/avatar.svg"}`}
                                    alt={group.name}
                                    width={40}
                                    height={40}
                                    className={`w-10 h-10 rounded-full ${group.picture ? "" : "bg-slate-300 p-1"}`}
                                />
                                <div className='flex flex-col'>
                                    <p className='font-semibold'>{group.name}</p>
                                </div>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>

            <Link href={`groups/create`} onClick={() => setLoading(true)} className='bg-secondary w-10 h-10 sm:w-14 sm:h-14 fixed bottom-10 right-10 rounded-full flex justify-center items-center transition duration-500 delay-200 hover:scale-125 '>
                <FaPlus className='text-white text-3xl' />

            </Link>
        </div>
    )
}

export default GroupPage