import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'; // Import Ant Design styles
import './index.css'
import App from './App'
import AntDesignTablePageWrapper from './AntDesignTablePageWrapper';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <AntDesignTablePageWrapper />
  </StrictMode>,
)
