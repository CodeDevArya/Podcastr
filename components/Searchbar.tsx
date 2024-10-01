"use client"
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/useDebounce'

const Searchbar = () => {
    const [search, setSearch] = useState("")
    const router = useRouter()
    const pathname = usePathname()
    const debounceValue = useDebounce(search, 500)
    useEffect(() => {

        if (debounceValue) {
            router.push(`/discover?search=${debounceValue}`)
        }
        else if (!debounceValue && pathname === '/discover') {
            router.push('/discover')
        }

    }, [router, pathname, debounceValue])


    return (
        <div className='relative mt-8 block'>
            <Input
                className='input-class py-6 pl-12 focus-visible:ring-offset-orange-1'
                placeholder='Search for podcast'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onLoad={() => setSearch('')}
            />
            <Image
                src={"/icons/search.svg"}
                width={20}
                height={20}
                alt="search"
                className='absolute left-4 top-3.5'
            />
        </div>
    )
}

export default Searchbar
