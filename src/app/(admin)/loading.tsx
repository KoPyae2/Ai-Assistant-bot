import Avatar from '@/components/Avatar'
import React from 'react'

export default function loading() {
    return (
        <div className='pt-32'><Avatar seed='chico' className='mx-auto my-auto animate-spin' /></div>
    )
}
