import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
    const [data,setData]= useState([])
    useEffect(()=>{
        const fetchData = async ()=>{
            const res = await axios.get("http://localhost:3000/my-images",{withCredentials:true})
            if (!res){
                console.log("not res")
            }
            setData(res.data)
        }
        fetchData()
    },[])
  return (
    <>
    <div>Dashboard</div>
     {
        data ? (
            data.map((item,index)=>{
                return <img style={{height:"100px",width:"100px"}} src={item.url} key = {index}></img>
            })
        ):(
            <p> not present </p>
        )
     }
     </>

  )
}

export default Dashboard