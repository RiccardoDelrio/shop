import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import SizeTable from './pages/Size-table';

import DefaultLayout from "./layout/defaultLayout";


function App() {

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/size-table" element={<SizeTable />} />

          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
