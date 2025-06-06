import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { signOutFailure, signOutStart, signOutSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';
import { getDownloadURL, uploadBytesResumable, ref, getStorage } from "firebase/storage";
import { app } from '../firebase';

export default function Profile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [formData, setForemData] = useState({});
  console.log("formData: ", formData);
  const [updateUser, setUpdateUser] = useState(false);
  const [file, setFile] = useState(null);
  const [imageProgress, setImageProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (data.success === false) {
        console.log("logout error: ", data.message);
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (error) {
      console.log("logout error: ", error.message);
      dispatch(signOutFailure(error.message));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateUser(true);
      await updateUserTime();
      console.log("updated successfully ", data);
    } catch (error) {
      console.log(error.message);
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleChange = (e) => {
    setForemData({ ...formData, [e.target.id]: e.target.value })
  }

  const updateUserTime = () => {
    setTimeout(() => {
      setUpdateUser(false);
    }, [3000]);
  }

  useEffect(() => {
    if(file){
      handleImageUpload(file);
    }
  }, [file]);

  const handleImageUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("progress: ", Math.round(progress));
      setImageProgress(Math.round(progress));
    },
      (error) => {
        console.log("imageUplaod error: ", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setForemData({...formData, avatar: downloadUrl});
          setImageUrl(downloadUrl);
          setFile(null);
        });
      },
    );
  }

  return (
    <>
      <div className="w-full py-4 bg-[#9EFFE2] flex items-center justify-between px-4 border-b-2 border-[#4AD0DB] shadow-md sm:px-8">
        <Link to='/dashboard'>
          <FaArrowLeftLong className='text-2xl' />
        </Link>
      </div>

      <div className="flex flex-col items-center gap-4 py-8 px-4">
        <div onClick={() => fileRef.current.click()} className="w-28 h-28 overflow-hidden rounded-full border-2 border-black cursor-pointer sm:w-32 sm:h-32">
          <img src={imageUrl || currentUser.avatar} alt="" className="w-full h-full object-contain" />
        </div>

        {updateUser && (
          <p className="text-green-500 font-semibold">User Updated Successfully</p>
        )}
        {error && (
          <p className="text-red-600 font-semibold">{error}</p>
        )}
        {(!updateUser && !error && imageProgress > 0 && imageProgress < 100) && (
          <p className="text-green-600 font-semibold">Uploaded {imageProgress}%</p>
        )}
        {(!updateUser && !error && imageUrl !== '') && (
          <p className="text-green-600 font-semibold">Image Uploaded Successfully</p>
        )}

        <div className="w-full flex gap-4 flex-col items-center py-4 px-2 my-4 sm:w-[30rem]">
          <form onSubmit={handleSubmit} className="w-full flex gap-4 flex-col items-center">
            <input ref={fileRef} onChange={(e) => setFile(e.target.files[0])} type="file" hidden />
            <input type="text" id='username' className="w-full px-4 py-3 rounded-md border border-black outline-none" placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} autoComplete='off' />
            <input type="email" id='email' className="w-full px-4 py-3 rounded-md border border-black outline-none" placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} autoComplete='off' />
            <input type="password" id='password' className="w-full px-4 py-3 rounded-md border border-black outline-none" placeholder='Password' onChange={handleChange} autoComplete='off' />
            <button disabled={loading} className="w-full px-4 py-3 bg-[#3F72AF] text-white rounded-md sm:text-lg font-semibold transition-all duration-300 hover:bg-[#2D527E] uppercase">Submit</button>
          </form>

          <button onClick={handleLogout} className="w-full px-4 py-3 bg-red-500 text-white rounded-md sm:text-lg font-semibold transition-all duration-300 hover:bg-red-600 uppercase mt-4">Logout</button>
        </div>
      </div>
    </>
  )
}
