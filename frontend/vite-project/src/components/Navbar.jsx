import  useAuth  from "../utils/useAuth";



export default function Navbar() {
  const { user, logout } = useAuth();

  return (
   <nav className="backdrop-blur-lg bg-white/10 border-b border-white/20 py-4 fixed w-full z-50">

      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        <a href="/" className="text-2xl font-bold text-indigo-600">
          LearnVault
        </a>

        <div className="flex gap-6 items-center">

          <a href="/courses" className="text-black-700 hover:text-indigo-600">
            Courses
          </a>

          {!user ? (
            <>
              <a href="/auth" className="text-black-700 hover:text-indigo-600">
                Login
              </a>
              <a
                href="/auth"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Register
              </a>
            </>
          ) : (
            <>
              <span className="text-black-700">{user.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
