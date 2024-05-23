'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/navigation'
import { useAppContext } from '../context/AuthContext'


const MainPage = () => {
    const [id, setId] = useState('')
    const [name,setName] = useState('')
    const router = useRouter()
    const {setUser} = useAppContext()
    const newRoom = (e) => {
        e.preventDefault()
        const _id = uuid()
        setId(_id)
    }
    const joinRoom = () => {
        if (id && name) {
            setUser(name,id)
            router.push(`/chat/${id}`)
        }
    }
    return (
        <div className='flex flex-col justify-center items-center min-h-screen'>
            <Card className="w-full max-w-sm ">
                <CardHeader>
                    <CardTitle className="text-2xl">Spark Conversation</CardTitle>
                    <CardDescription>
                        Enter the Room ID below to enter the room.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Room ID</Label>
                        <Input id="password" type="text" placeholder="Create or enter Room ID" required value={id} onChange={(e) => setId(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={joinRoom}>Join</Button>
                </CardFooter>
                <CardFooter>
                    <Button className="w-full" variant='outline' onClick={newRoom}>Create New Room</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
export default MainPage