import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizonal } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAppContext } from '../context/AuthContext';
import UserList from './UserList';
import Avatar from 'react-avatar';

export default function ChatWindow() {
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [users,setUsers] = useState([])
    const [isloading,setIsLoading] = useState(true)
    const {info} = useAppContext()
    const router = useRouter()
    const { id } = useParams();
    useEffect(() => {
        if (!info.name || !info.idd) {
            router.push('/');
        }else{
            setIsLoading(false)
        }
    }, [info]);
    const socket = useMemo(() => io("http://localhost:8080", { withCredentials: true }), []);
    const handleEnter = (e) => {
        if(e.code === 'Enter'){
            sendMessage()
        }
    }
    useEffect(() => {
        socket.on("connect", () => {
            if (id) {
                socket.emit("join-room", id,info.name);
            }
        });

        socket.on("receive-message", (data) => {
            setMessages((prevMessages) => [...prevMessages, { ...data, sender: 'other' }]);
        });
        socket.on("update-users", (users) => {
            setUsers(users);
        });

        return () => {
            socket.off("connect");
            socket.off("receive-message");
            socket.off("update-users");
        };
    }, [socket, id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (input.trim()) {
            const time = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(new Date());
            const message = { text: input, sender: 'me', time, user: info.name };
            setMessages((prevMessages) => [...prevMessages, message]);
            socket.emit("message", { id, message });
            setInput('');
        }
    };

    return (
        <div className='flex h-screen'>
            <UserList users={users}/>
        <div className="flex flex-col flex-1 h-screen p-4">
            <div className="flex-1 overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex my-2 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-end ${message.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                            <Avatar name={message.user} size={32} className='rounded-full'/>
                            <div className={`p-3 rounded-lg max-w-xs break-words mx-2 ${message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                <div>{message.text}</div>
                                <div className={`text-xs ${message.sender === 'me' ? 'text-white' : 'text-black'} mt-1`}>{message.time}</div>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-4 flex">
                <Input type='text' className='flex-1 p-2' onKeyUp={handleEnter} value={input} onChange={(e) => setInput(e.target.value)} />
                <Button className='ml-3 rounded-full' onClick={sendMessage}><SendHorizonal size={15} /></Button>
            </div>
        </div>
        </div>
    );
}