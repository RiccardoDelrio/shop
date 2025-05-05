import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'

function DefaultLayout() {
    return (
        <>
            <div className="main-container">
                <Navbar />
                <Outlet />

            </div>


        </>
    )
}

export default DefaultLayout