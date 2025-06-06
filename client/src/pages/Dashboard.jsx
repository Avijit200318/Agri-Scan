import React, { useEffect, useState } from 'react'
import Logo from "/images/logo.jpg";
import { BsFillBellFill } from "react-icons/bs";
import { CiCamera, CiTempHigh } from "react-icons/ci";
import { IoWater } from "react-icons/io5";
import { PiPottedPlantFill } from "react-icons/pi";
import { BsCloudRainHeavyFill } from "react-icons/bs";
import { IoIosSunny } from "react-icons/io";
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaCamera } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";
import graph from "/images/graph.png";

import { app } from '../firebase';
import { getDatabase, onValue, ref } from "firebase/database";
import { useSelector } from 'react-redux';


export default function Dashboard() {
    const [sensorData, setSensorData] = useState(null);
    console.log("sensor data: ", sensorData);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('OFF');
    const {currentUser} = useSelector((state) => state.user);

    const database = getDatabase(app);

    useEffect(() => {
        fetchRealTimeDatabaseData();
    }, []);

    const fetchRealTimeDatabaseData = () => {
        try {
            setLoading(true);
            const sensorRef = ref(database, "Sensor");

            onValue(sensorRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setSensorData(data);
                }
                setLoading(false);
            },
                (error) => {
                    console.error("realtime db error: ", error);
                    setLoading(false); // Set loading to false in case of an error
                });
        } catch (error) {
            console.log("realtime db error: ", error);
            setLoading(false);
        }
    }

    return (
        <>
            {(!sensorData && loading) && (
                <div className="w-full h-screen absolute left-0 top-0 flex justify-center items-center bg-[#01D2A8] z-50">
                    <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full w-16 h-16 animate-spin"></div>
                </div>
            )}
            {(sensorData) && (
                <div>
                    <div id='header' className="header w-full h-16 bg-[#D9D9D9] flex justify-between items-center px-2 sm:px-4">
                        <Link to='/dashboard'>
                            <div className="flex gap-2 items-center pl-1">
                            <GiHamburgerMenu className='text-3xl'/>
                            </div>
                        </Link>
                        <div className="flex gap-4 items-center sm:px-4">
                            <button className="p-2 rounded-full"><BsFillBellFill className='text-xl hidden sm:text-2xl sm:block text-[#00623D]' /></button>
                            <Link to='/profile' className="">
                                <div className="rounded-full overflow-hidden border-2 border-[#00623D] mx-2 w-10 sm:h-10">
                                    <img src={currentUser.avatar} alt="" className="w-full h-full object-contain" />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="box1 h-44 mx-4 my-4 relative md:mx-8 sm:h-60 md:h-[40dvh] flex gap-6 justify-center items-center">
                        <Link to='/diagonasis' className="">
                            <div className="w-36 h-36 bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center gap-2">
                            <FaCamera className='text-[3.5rem] text-gray-700'/>
                            <h3 className='font-semibold text-gray-700'>AI Analysis</h3>
                            </div>
                        </Link>
                        <Link to='/chat ' className="">
                            <div className="w-36 h-36 bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center gap-2">
                            <FaRobot className='text-[3.5rem] text-gray-700'/>
                            <h3 className='font-semibold text-gray-700'>Chat with AI</h3>
                            </div>
                        </Link>
                    </div>
                    <div className="box2 py-6 px-8 sm:px-6 md:px-8">
                        <h1 className="text-3xl py-2 font-semibold text-[#00623D] border-b-4 border-[#00623D]">Plant Monitoring</h1>
                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex flex-col justify-center gap-6 sm:flex-row">
                                <div className="w-full bg-[#9EF4E6] rounded-md flex gap-2 items-center justify-around py-2 sm:w-[33%] lg:w-[25%] sm:flex-col sm:justify-normal">
                                    <div className="">
                                        <h2 className="text-lg text-center font-semibold md:text-2xl py-2">Temperature</h2>
                                        <div className="flex gap-2 items-center justify-center">
                                            <CiTempHigh className='h-8 w-8 sm:h-12 sm:w-12 text-[#00623D]' />
                                            <p className="p-1 bg-white rounded-sm font-semibold sm:p-2">{sensorData.temp_val}&deg; C</p>
                                        </div>
                                    </div>
                                    <div className="bg-white w-[50%] h-16 sm:h-28 sm:w-[60%]">
                                        <img src={graph} alt="" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="w-full bg-[#9EF4E6] rounded-md flex gap-2 items-center justify-around py-2 sm:w-[33%] lg:w-[25%] sm:flex-col sm:justify-normal">
                                    <div className="">
                                        <h2 className="text-lg text-center font-semibold md:text-2xl py-2">Humidity</h2>
                                        <div className="flex gap-2 items-center justify-center">
                                            <IoWater className='h-8 w-8 sm:h-12 sm:w-12 text-blue-400' />
                                            <p className="p-1 bg-white rounded-sm font-semibold sm:p-2">{sensorData.humidity_val}%</p>
                                        </div>
                                    </div>
                                    <div className="bg-white w-[50%] h-16 sm:h-28 sm:w-[60%]">
                                        <img src={graph} alt="" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                
                            </div>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="flex flex-col justify-center gap-6 sm:flex-row">
                                    <div className="w-full bg-[#9EF4E6] rounded-md flex flex-col gap-2 px-2 py-2 sm:w-[33%] lg:w-[25%] sm:items-center sm:px-0">
                                        <h2 className="text-lg font-semibold md:text-2xl sm:text-center py-2">Soil Nutrients</h2>
                                        <ul className="flex gap-1 w-full sm:flex-col sm:gap-4 sm:w-[90%]">
                                            <li className="text-xs sm:text-base w-[33.3%] sm:w-full rounded-md bg-white py-2 px-2 sm:px-4"><span className='font-bold text-red-500'>N:</span> 150 mg/kg</li>
                                            <li className="text-xs sm:text-base w-[33.3%] sm:w-full rounded-md bg-white py-2 px-2 sm:px-4"><span className='font-bold text-red-500'>P:</span> 60 mg/kg</li>
                                            <li className="text-xs sm:text-base w-[33.3%] sm:w-full rounded-md bg-white py-2 px-2 sm:px-4"><span className='font-bold text-red-500'>K:</span> 90 mg/kg</li>
                                        </ul>
                                    </div>
                                    <div className="flex gap-2 w-full sm:gap-6 sm:w-[60%] lg:w-[52%]">
                                        <div className="w-[48%] bg-[#9EF4E6] rounded-md flex flex-col gap-2 items-center py-2">
                                            <h2 className="text-lg font-semibold md:text-2xl sm:text-center py-2">UV</h2>
                                            <div className="w-[80%] bg-white h-12 rounded-md flex justify-center sm:h-32">
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <IoIosSunny className='text-2xl sm:text-3xl' />
                                                    <h2 className="text-sm sm:text-base">Very Weak</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-[48%] bg-[#9EF4E6] rounded-md flex flex-col gap-2 items-center py-2">
                                            <h2 className="text-lg font-semibold md:text-2xl sm:text-center py-2">Raining Status</h2>
                                            <div className="w-[80%] bg-white h-12 rounded-md flex justify-center sm:h-32">
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <BsCloudRainHeavyFill className='text-xl sm:text-2xl' />
                                                    <h2 className="text-sm sm:text-base">Not Raining</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
