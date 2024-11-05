import Image from 'next/image'
import React from 'react'

export default function Avatar({ seed, className }: { seed: string, className?: string }) {
    const dataUrl = `https://api.multiavatar.com/${seed}.svg`

    return (
        <Image src={dataUrl} alt="avatar" width={60} height={60} className={className} />
    )
}
