import AuthLayout from '@/components/ui/AuthLayout'
import React from 'react'

export default function Login() {
    return (
        <AuthLayout>
            <form>
                <div>
                    <h1 className='text-[32px] font-bold'>Login</h1>
                    <p className='text-gray-500 mt-1'>Add your details below to get back into the app</p>
                </div>
            </form>
        </AuthLayout>
    )
}
