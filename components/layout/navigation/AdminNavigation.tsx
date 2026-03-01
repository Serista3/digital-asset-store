import AdminMenu from './AdminMenu';
import WebLogo from './WebLogo';

export default function AdminNavigation() {
  return (
    <nav className="w-full py-6 border-b border-gray-700">
      <div className="max-w-275 mx-auto px-4 flex items-center gap-3 justify-between">
        {/* Logo */}
        <WebLogo href='/admin' />

        {/* Admin Menu */}
        <AdminMenu />
      </div>
    </nav>
  );
}
