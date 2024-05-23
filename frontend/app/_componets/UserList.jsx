import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAppContext } from '../context/AuthContext';
import Avatar from 'react-avatar';
import { Button } from '@/components/ui/button';

export default function UserList({users}) {
    const {info} = useAppContext()
    const onCopy = () => {
        navigator.clipboard.writeText(info.idd)
    } 
    return (
        <div className="hidden md:flex flex-col bg-[#f4f6f7] w-1/4 h-full p-4">
            <h2 className="text-lg font-semibold">Connected Users</h2>
            <div className='mt-5 flex-1 overflow-y-auto'>
                {users.map((user, index) => (
                    <div className='m-2'>
                        <Avatar name={user.username} size={30} round='8px'/>
                        <span className='ml-2'>{user.username}</span>
                    </div>
                ))}
            </div>
            <Button onClick={onCopy} variant='outline' className='w-full mt-5'>Copy Room ID</Button>
        </div>
    );
}
