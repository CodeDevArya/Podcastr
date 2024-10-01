import { cn } from '@/lib/utils';
import React from 'react'

const Header = ({ headerTitle, titleClassName }: { headerTitle?: string; titleClassName?: string }) => {
  return (
    <header className='flex items-center justify-between'>
      {headerTitle ? (
        <h1
          className={cn('text-18 font-bold text-white-1', titleClassName)}
        >{headerTitle}</h1>
      ) : <div />}

    </header>
  )
}

export default Header
