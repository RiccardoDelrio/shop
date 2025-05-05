import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'


function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route>

            <Route path='/' element={<Home />} />


          </Route>
        </Routes>
      </BrowserRouter>
      <Navbar />
    </>
  )
}

export default App
