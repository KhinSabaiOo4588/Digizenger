import React, { useRef , useState, useEffect } from 'react';
import john from '/images/john doe.jpg';
import active from '/images/active.jpg';
import mark from '/images/mark.jpg';
import publicIcon from '/images/public.png';
import { GoImage } from "react-icons/go";
import { PiGif } from "react-icons/pi";
import { useUploadPostMutation } from '../api/Post';
import { FaUsers, FaHome, FaUserFriends } from "react-icons/fa";


function Post({activeChat}) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [content, setContent] = useState('');
    const [showMedia , setShowMedia] = useState(false);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const uploadRef = useRef(null);
    const [uploadPost] = useUploadPostMutation();
    const [postStatus, setPostStatus] = useState(false);
    const [selectedAudience, setSelectedAudience] = useState('Everyone');

    const handleAudienceSelect = (audience) => {
        setSelectedAudience(audience); 
        setPostStatus(false); 
    };

    const getAudienceIcon = (audience) => {
        switch (audience) {
            case 'Everyone':
                return <FaUsers className='w-[16px] h-[16px] text-[#0097A7]' />;
            case 'Neighbor':
                return <FaHome className='w-[16px] h-[16px] text-[#0097A7]' />;
            case 'Follower':
                return <FaUserFriends className='w-[16px] h-[16px] text-[#0097A7]' />;
            default:
                return null;
        }
    };

    const handlePostStatus = () => {
        setPostStatus(!postStatus)
    }

    const uploadImage = () => {
        if (uploadRef.current){
            if (!isEditing) {
                uploadRef.current.value = "";  
            }
            uploadRef.current.click();  
        }else{
            console.log("ref is null")
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log(file);
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl); 
            
        }
    }

    useEffect(() => {
        console.log("uploadRef.current:", uploadRef.current);
    }, []);

    const handleInput = (e) => {
        const target = e.target;
        target.style.height = 'auto'; // Reset height
        if (target.value === '') {
            target.style.height = '20px'; // Set to initial height when empty
        } else {
            target.style.height = `${target.scrollHeight}px`; // Set to scroll height
        }
        
        setContent(target.value);
        setIsButtonDisabled(target.value.trim() === '');
        console.log(content);
    };

    const handlePostSubmit = async () => {
        const postData = {
            content: content,
            isPublic: "true",
            media: imageFile ? [{ mediaUrl: imageFile.name, mediaType: "IMAGE" }] : [],
            
        };
        console.log(postData);

        // if (video) { 
        //     postData.media.push({
        //         mediaUrl: video, 
        //         mediaType: "VIDEO"
        //     });
        // }

        try {
            const result = await uploadPost(postData).unwrap();
            console.log("Post uploaded successfully:", result);
            setContent('');
            setImage(null);
        } catch (error) {
            console.error("Failed to upload post:", error);
        }
    };

    return (
        <section>
            <main className={activeChat ? "flex flex-col items-center gap-[14px] p-[20px] rounded-[8px] self-stretch bg-white" : "flex flex-col  gap-[14px] p-[20px] rounded-[8px] self-stretch bg-white"}>
                <div className="flex flex-col items-center bg-white">

                    <div className={activeChat? "flex flex-col gap-[10px] items-start  self-stretch" : "flex flex-col gap-[20px] items-start  self-stretch"}>
                        
                        <div className="flex items-start justify-between">

                            <div className={activeChat ? "flex gap-[8px] w-[320px]" : "flex w-[550px] gap-[15px]"}>

                                <div className="w-[38px] h-[38px]">
                                    <img src={john} alt="John" />
                                    <img src={active} className='relative top-[-11px] left-6' alt="Active" />
                               </div>

                                <div className='flex flex-col gap-2 items-start w-[250px]'>

                                    <div className='flex items-center h-[20px] gap-[8px]'>
                                        <span className='text-[16px] font-bold leading-8'>John Doe</span>
                                        <img src={mark} alt="Mark" />
                                    </div>

                                    <div className='text-[14px] w-full font-normal text-[#7E7E8D]'>
                                        <textarea
                                            placeholder="Share Your Thought"
                                            className='outline-none w-full resize-none'
                                            onInput={handleInput}
                                            onClick={()=>setShowMedia(!showMedia)}
                                            style={{ overflow: 'hidden',  height: "20px" ,lineHeight : "1.2" }} // Set minimum height
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className={`flex justify-center p-[8px_20px] items-center rounded-[8px] h-[36px] bg-[#0097A7] ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : "opacity-1 cursor-pointer"}}`}>

                                <button onClick={handlePostSubmit} disabled={isButtonDisabled}>Post</button>

                            </div>
                        </div>

                        <div className='flex flex-col gap-1 items-start'>

                            <div className='flex gap-[12px]'>
                                <div className='w-[32px] h-[14px]'></div>

                                <div className='flex gap-[4px] items-center pointer' onClick={handlePostStatus}>
                                    {getAudienceIcon(selectedAudience)}
                                    <span className='text-[14px] text-[#0097A7] font-medium leading-5'>{selectedAudience}</span>
                                </div>

                                {postStatus &&(
                                    <div className='flex flex-col gap-[10px] absolute items-start bg-[#ECF1F4] left-20 top-200 z-20 p-[20px] w-[300px]'>
                                        <span>Who can see you post?</span>
                                        <span>Choose who can see your post.<br /></span>
                                        <span className='text-left'>Everyone you mentioned in the post can still see it.</span>
                                        <div className='flex flex-col gap-[5px]'>
                                            <div className='flex gap-[5px]' onClick={() => handleAudienceSelect('Everyone')}>
                                                <img src={publicIcon} className='w-[16px] h-[16px]' alt="Public Icon" />
                                                <span className='text-[14px] text-[#0097A7] font-medium leading-5'>Everyone</span>
                                            </div>
                                            <div className='flex gap-[5px]' onClick={() => handleAudienceSelect('Neighbor')}>
                                                <img src={publicIcon} className='w-[16px] h-[16px]' alt="Public Icon" />
                                                <span className='text-[14px] text-[#0097A7] font-medium leading-5'>Neighbor</span>
                                            </div>
                                            <div className='flex gap-[5px]'onClick={() => handleAudienceSelect('Follower')}>
                                                <img src={publicIcon} className='w-[16px] h-[16px]' alt="Public Icon" />
                                                <span className='text-[14px] text-[#0097A7] font-medium leading-5'>Follower</span>
                                            </div>
                                        
                                        </div>

                                    </div>
                            )}

                            </div>

                            <div className='flex gap-[12px] items-center'>

                                <div className='w-[32px] h-[14px]'></div>

                                <div className='flex gap-[10px]'>
                                    <span className='text-[13px] font-normal leading-5'>Trending Now</span>

                                    <div className='flex gap-[8px]'>
                                        <span className='text-[13px] text-[#0097A7]'>#appleevent</span>
                                        <span className='text-[13px] text-[#0097A7]'>#ipone16</span>
                                        <span className='text-[13px] text-[#0097A7]'>#myanmarwin</span>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {showMedia &&
                            <div className='flex items-start gap-[12px]'>

                                <div className='w-[32px] h-[14px]'></div>

                                <div className='flex flex-col gap-[5px]'>
                                    <div className='w-[330px] h-[1px] bg-[#ECF1F4]'></div>

                                    {image ?
                                    (<div>
                                        <img src={image} className='w-[500px] h-[300px]'/>
                                        {/* <button  className='ml-2 text-red-500'>Delete</button>
                                        <button onClick={ uploadImage} className='ml-2 text-blue-500'>Edit</button> */}
                                    </div>) : 
                                    (<div className='flex gap-[10px]'>
                                        <i onClick={uploadImage}><GoImage size={25} className='text-[#0097A7]'/></i>
                                        <input ref={uploadRef} type='file' className='hidden' onChange={handleImageUpload}/>
                                        <i><PiGif size={25} className='text-[#0097A7]'/></i>
                                    </div>)
                                    
                                    }
                                    
                                </div>
                            </div>
                        }
                        
                    </div>
                </div>
            </main>
        </section>
    );
}

export default Post;
