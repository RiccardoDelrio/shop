import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/footer/footer'

function DefaultLayout() {
    return (
        <>
            <div className="main-container">
                <Navbar />
                <Outlet />
                < Footer />

            </div>


        </>
    )
}

export default DefaultLayout