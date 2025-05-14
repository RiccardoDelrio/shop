import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/footer/footer'
import PagePopup from '../components/Popup/PagePopup'

function DefaultLayout() {
    return (
        <>
            <PagePopup />
            <Navbar />
            <div className="main-container">
                <Outlet />
                < Footer />

            </div>


        </>
    )
}

export default DefaultLayout