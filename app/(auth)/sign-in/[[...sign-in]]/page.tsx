import { SignIn } from '@clerk/nextjs'

const signIn = () => {
  return (
    <div className='flex-center glassmorphism-auth h-screen w-full'>
      <SignIn/> 
    </div>
  )
}

export default signIn
