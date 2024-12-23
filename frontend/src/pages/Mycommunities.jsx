import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import React, { useEffect, useState, forwardRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { MdDelete } from "react-icons/md";
import { MdPeople } from "react-icons/md";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

const Mycommunities = () => {
    const [getAllComms,setgetAllComms] = useState([])
    const [isOpennew, setIsOpennew] = useState(false);
    const [isOpendelete, setIsOpendelete] = useState(false);
    const [isOpenleave, setIsOpenleave] = useState(false);

    const [formData, setFormData] = useState({
        Communityname: '',
        Communitydescription: '',
        imageUrl: "",
    });

    const [selectedImage, setSelectedImage] = useState("https://github.com/shadcn.png");

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setFormData((prev) => ({
            ...prev,
            imageUrl,
          }));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.Communityname || !formData.Communitydescription){
            toast({
                className: "bg-black border-red-500 text-white",
                description: "Incomplete fields",
            });
            return;
        }
    
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_PORT}/u/comm/new-community`, formData);
        console.log(response.status);
        
        if(response.status === 200){
            toast({
                className: "bg-black border-green-500",
                description: "Your Community is Created",
            })
            setIsOpennew(false);
            try{
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_PORT}/u/comm/user-community`)
                setgetAllComms(response.data.Communities)
            }
            catch(err){
                console.log(err);
            }
        }
        
  
      } catch (error) {
          toast({
            className: "bg-black border-red-500 text-white",
            description: error.response.data.err || "An error occurred while creating community",
          });
          console.error('Error creating community');
        }
      };

      const handledelete = async (commId) => {
        try{
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_PORT}/u/comm/delete-community`, {
                data: { commId }
            });
            console.log(response.status);

            if(response.status === 200){
                toast({
                    className: "bg-black border-green-500",
                    description: "Community deleted",
                })
                try{
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_PORT}/u/comm/user-community`)
                    setgetAllComms(response.data.Communities)
                }
                catch(err){
                    console.log(err);
                }
                setIsOpendelete(false);
            }
        }catch(err){
            toast({
                className: "bg-black border-yellow-500",
                description: err.response.data.message,
            })
            setIsOpendelete(false);
            console.log(err.message);
        }
      }

      const handleleave = async (commId) => {
        try{
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_PORT}/u/comm/leave-community`, {
                data: { commId }
            });

            if(response.status === 200){
                toast({
                    className: "bg-black border-green-500",
                    description: "Community leaved",
                })
                  try{
                      const response = await axios.get(`${import.meta.env.VITE_BACKEND_PORT}/u/comm/user-community`)
                      setgetAllComms(response.data.Communities)
                  }
                  catch(err){
                      console.log(err);
                  }
                  setIsOpenleave(false);
                }
            }catch(err){
                console.log(err.response.data.err);
                toast({
                    className: "bg-black border-yellow-500",
                    description: err.response.data.err,
                })
                setIsOpenleave(false);
        }
      }

    useEffect(() => {
        const getCommunities = async () => {
            try{
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_PORT}/u/comm/user-community`)
                setgetAllComms(response.data.Communities)
            }
            catch(err){
                console.log(err);
            }
        }
        getCommunities();
    },[])

    return (
        <div className='p-2'>
            <Toaster />
            <div className='flex flex-col w-[800px] max-h-fit space-y-8'>
                <div className='flex justify-between'>
                    <p className='text-[20px] font-mono max-w-fit px-4 py-1 rounded-md bg-gray-900'>Your Communities</p>
                    <div className="space-x-4">
                        <Dialog opennew={isOpennew} onOpenChange={setIsOpennew}>
                            <DialogTrigger asChild>
                            <Button className='text-[20px] font-mono max-w-fit px-4 py-1 rounded-md bg-gray-900' onClick={() => setIsOpennew(true)} >New</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] border-gray-900">
                                <DialogHeader>
                                <DialogTitle className='text-2xl font-bold'>Form Your Own Community!</DialogTitle>
                                <DialogDescription className='text-md'>
                                Start a new space to connect with others. Give your community a name and description to get started
                                </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col items-center justify-center">
                                        <Avatar className="size-[80px]">
                                            <AvatarImage
                                            className=""
                                            src={selectedImage || "https://github.com/shadcn.png"}
                                            alt="User Avatar"
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="mt-4 text-sm text-muted-foreground"
                                        />
                                    </div>

                                    <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="Communityname" className="text-right text-md">
                                        Title
                                        </Label>
                                        <Input onChange={handleChange} id="Communityname" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="Communitydescription" className="text-right text-md">
                                        Description
                                        </Label>
                                        <Input onChange={handleChange} id="Communitydescription" className="col-span-3" />
                                    </div>
                                    </div>
                                    <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className='flex flex-col space-y-8'>
                    {
                        getAllComms.map((comm) => (
                            <div key={comm._id} className="border rounded-md border-gray-800 p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        {comm.image && (
                                            <img 
                                                src={comm.image} 
                                                alt={comm.Communityname} 
                                                className="w-20 h-20 rounded-md object-cover border border-gray-700"
                                            />
                                        )}
                                        <div className="space-y-1">
                                            <h4 className="text-2xl font-semibold font-mono leading-none">{comm.Communityname}</h4>
                                            <p className="text-lg font-medium text-muted-foreground">{comm.Communitydescription}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <MdPeople size={24} />
                                        <Dialog open={isOpendelete} onOpenChange={setIsOpendelete}>
                                            <DialogTrigger asChild>
                                                <MdDelete size={24} className="text-red-400 cursor-pointer" onClick={() => setIsOpendelete(true)} />
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[600px] border-gray-900">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl text-red-500 font-semibold">
                                                        Are you sure to delete - <span className="text-xl">{comm.Communityname}</span>
                                                    </DialogTitle>
                                                    <DialogDescription className="text-md">
                                                        All the posts and members will be removed!
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <Button onClick={() => handledelete(comm._id)} className="border border-red-500" type="submit">
                                                        Delete
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog open={isOpenleave} onOpenChange={setIsOpenleave}>
                                            <DialogTrigger asChild>
                                                <svg className="h-5 cursor-pointer" onClick={() => setIsOpenleave(true)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path
                                                        fill="#ffffff"
                                                        d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                                                    />
                                                </svg>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[600px] border-gray-900">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl text-yellow-500 font-semibold">
                                                        Are you sure to leave - <span className="text-xl">{comm.Communityname}</span>
                                                    </DialogTitle>
                                                    <DialogDescription className="text-md">
                                                        You can always join later!
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <Button onClick={() => handleleave(comm._id)} className="border border-yellow-500" type="submit">
                                                        Leave
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                <Separator className="my-5" />
                                <div className="flex font-mono text-md h-5 items-center space-x-4">
                                    <div>Made by {comm.ownerUsername}</div>
                                    <Separator orientation="vertical" />
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="h-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 640 512"
                                        >
                                            <path
                                                fill="#ffffff"
                                                d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"
                                            />
                                        </svg>
                                        <p>
                                            {comm.members.length === 1
                                                ? `1 Member`
                                                : `${comm.members.length} Members`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Mycommunities
