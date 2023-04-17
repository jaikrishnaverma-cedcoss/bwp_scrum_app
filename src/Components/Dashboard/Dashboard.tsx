import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { DIProps, DI } from "../../Core";
import Main from './Main'

const Dashboard = (_props:DIProps) => {
  return (
    <Routes>
    <Route path="/:uId/dashboard" element={<Main />} />
    <Route path="*" element={<Navigate to={"/auth/login"} />} />
  </Routes>
  )
}

export default DI(Dashboard)