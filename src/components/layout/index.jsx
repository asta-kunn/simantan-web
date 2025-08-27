import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Icons
import {
  LayoutDashboard,
  Lightbulb,
  ClipboardList,
  FileText,
  Ban,
  Database,
  Menu,
  Bell,
  LogOut,
  MessageSquare
} from 'lucide-react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import authStore from '@/stores/authStore';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const appName = import.meta.env.VITE_APP_NAME;
  const year = new Date();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Definisi path untuk setiap menu
  const menuPaths = {
    // dashboard: '/dashboard',
    newProductDevelopment: '/new-product-development',
    existingProductDevelopment: '/existing-product-development',
    productRegistration: '/product-registration',
    productTermination: '/product-termination',
    masterDataManagement: '/master-data-management'
  };

  const menuTitles = {
    // [menuPaths.dashboard]: 'Dashboard',
    [menuPaths.newProductDevelopment]: 'New Product Development',
    [menuPaths.existingProductDevelopment]: 'Existing Product Improvement',
    [menuPaths.productRegistration]: 'Product Registration',
    [menuPaths.productTermination]: 'Product Termination',
    [menuPaths.masterDataManagement]: 'Master Data Management'
  };

  const isMenuActive = (path) => {
    if (path === menuPaths.masterDataManagement) {
      return currentPath.startsWith('/master-data-management');
    }
    return currentPath.startsWith(path);
  };

  const getActivePageTitle = () => {
    if (currentPath === '/' || currentPath.startsWith('/master-data-management')) {
      return menuTitles[menuPaths.masterDataManagement];
    }
    for (const [key, path] of Object.entries(menuPaths)) {
      if (currentPath.startsWith(path)) {
        return menuTitles[path];
      }
    }
    return 'Existing Product Improvement';
  };
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const setLogout = authStore(state => state.setLogout);

  const initialValue = () => {
    if (localStorage.getItem(`userdetail${appName}`)) return JSON.parse(localStorage.getItem(`userdetail${appName}`))
    return {
      user_name: "",
      user_type: "",
      user_id: "",
      user_email: "",
      user_phone: "",
      user_address: "",
      user_photo: "",
    }
  }

  const [user, setUser] = useState(initialValue());


  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative`}
      >
        <div className="bg-gradient-to-b from-primary-normal-100 from-20% to-white to-80% py-2 text-primary-normal-600 w-full">
          {sidebarOpen ? (
            <div className='flex items-center justify-center flex-col w-full '>
              <h1 className="text-xl font-bold text-primary-normal-600">InnoLife</h1>
              <p className="text-xs text-gray-500 mt-1 text-center">Innovation Driven Product<br />Lifecycle Management</p>
            </div>
          ) : (
            <h1 className="text-sm font-bold text-primary-normal-600 mx-auto text-center py-4">InnoLife</h1>
          )}
        </div>

        <div className="py-4">
          {sidebarOpen && <h3 className="text-sm font-medium text-gray-500 mb-4 px-3">MENU</h3>}

          <nav className="space-y-2">
          
            <Link
              to={menuPaths.newProductDevelopment}
              className={`flex items-center text-sm px-3 py-2 ${isMenuActive(menuPaths.newProductDevelopment)
                ? 'border-l-2 bg-gradient-to-r from-primary-normal-100 to-white border-rose-600 text-primary-normal-600'
                : 'text-gray-700 hover:bg-gray-100 rounded-md'} ${!sidebarOpen && 'justify-center'}`}
            >
              <Lightbulb className={`${sidebarOpen ? 'mr-3' : ''} h-5 w-5 ${isMenuActive(menuPaths.newProductDevelopment) ? 'text-primary-normal-600' : 'text-gray-500'}`} />
              {sidebarOpen && "New Product Development"}
            </Link>

            <Link
              to={menuPaths.existingProductDevelopment}
              className={`flex items-center text-sm px-3 py-2 ${isMenuActive(menuPaths.existingProductDevelopment)
                ? 'border-l-2 bg-gradient-to-r from-primary-normal-100 to-white border-rose-600 text-primary-normal-600'
                : 'text-gray-700 hover:bg-gray-100 rounded-md'} ${!sidebarOpen && 'justify-center'}`}
            >
              <ClipboardList className={`${sidebarOpen ? 'mr-3' : ''} h-5 w-5 ${isMenuActive(menuPaths.existingProductDevelopment) ? 'text-primary-normal-600' : 'text-gray-500'}`} />
              {sidebarOpen && "Existing Product Development"}
            </Link>

            <Link
              to={menuPaths.productRegistration}
              className={`flex items-center text-sm px-3 py-2 ${isMenuActive(menuPaths.productRegistration)
                ? 'border-l-2 bg-gradient-to-r from-primary-normal-100 to-white border-rose-600 text-primary-normal-600'
                : 'text-gray-700 hover:bg-gray-100 rounded-md'} ${!sidebarOpen && 'justify-center'}`}
            >
              <FileText className={`${sidebarOpen ? 'mr-3' : ''} h-5 w-5 ${isMenuActive(menuPaths.productRegistration) ? 'text-primary-normal-600' : 'text-gray-500'}`} />
              {sidebarOpen && "Product Registration"}
            </Link>

            <Link
              to={menuPaths.productTermination}
              className={`flex items-center text-sm px-3 py-2 ${isMenuActive(menuPaths.productTermination)
                ? 'border-l-2 bg-gradient-to-r from-primary-normal-100 to-white border-rose-600 text-primary-normal-600'
                : 'text-gray-700 hover:bg-gray-100 rounded-md'} ${!sidebarOpen && 'justify-center'}`}
            >
              <Ban className={`${sidebarOpen ? 'mr-3' : ''} h-5 w-5 ${isMenuActive(menuPaths.productTermination) ? 'text-primary-normal-600' : 'text-gray-500'}`} />
              {sidebarOpen && "Product Termination"}
            </Link>

            <Link
              to={menuPaths.masterDataManagement}
              className={`flex pointer items-center text-sm px-3 py-2 ${isMenuActive(menuPaths.masterDataManagement)
                ? 'border-l-2 bg-gradient-to-r from-primary-normal-100 to-white border-rose-600 text-primary-normal-600'
                : 'text-gray-700 hover:bg-gray-100 rounded-md'} ${!sidebarOpen && 'justify-center'}`}
            >
              <Database className={`${sidebarOpen ? 'mr-3' : ''} h-5 w-5 ${isMenuActive(menuPaths.masterDataManagement) ? 'text-primary-normal-600' : 'text-gray-500'}`} />
              {sidebarOpen && "Master Data Management"}
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t">
          {sidebarOpen ? (
            <Button className="w-full flex items-center justify-center bg-white text-primary-normal-600 border border-primary-normal-600 hover:bg-primary-normal-50">
              <MessageSquare className="mr-2 h-5 w-5" />
              Vida AI
            </Button>
          ) : (
            <Button className="w-full flex items-center justify-center bg-white text-primary-normal-600 border border-primary-normal-600 hover:bg-primary-normal-50 p-2">
              <MessageSquare className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-medium">{getActivePageTitle()}</h2>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center border-primary-normal-600 text-primary-normal-600 hover:bg-primary-normal-50">
              <Bell className="mr-2 h-4 w-4" />
              Approval
            </Button>

            <div className="flex items-center ml-4">
              <div className="rounded-full bg-primary-normal-100 text-primary-normal-600 w-8 h-8 flex items-center justify-center font-medium">
                {user['user_name']?.charAt(0) ?? ""}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">{user['user_name'] ?? ""}</p>
                <p className="text-xs text-gray-500">{user['user_type'] ?? ""}</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-2" onClick={() => {
                Swal.fire({
                  title: 'Are you sure?',
                  text: 'You want to logout?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                }).then((result) => {
                  if (result.isConfirmed) {
                    setLogout();
                  }
                })
              }}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>

        <footer className="bg-white border-t border-gray-200 p-4 text-sm text-gray-500 flex justify-between items-center">
          <div>© {year.getFullYear()} InnoLife - Innovation Driven Product Lifecycle Management</div>
          <div className="text-primary-normal-600 font-medium">dexa group</div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;