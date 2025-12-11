import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  // Placeholder fallback until backend provides real data
  const profile = {
    name: user?.name || "Instructor Name",
    email: user?.email || "email@example.com",
    role: user?.role || "instructor",
    avatar: null, // you can later use cloud URL here
  };

  // Generate initials if no avatar
  const getInitials = (name) => {
    if (!name) return "I";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      {/* PROFILE CARD */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col md:flex-row md:items-center gap-8 shadow-xl">

        {/* AVATAR */}
        <div className="w-32 h-32 rounded-full bg-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(profile.name)
          )}
        </div>

        {/* PROFILE INFO */}
        <div className="flex-1 space-y-4">

          <div>
            <p className="text-gray-300 text-sm">Name</p>
            <p className="text-xl font-semibold">{profile.name}</p>
          </div>

          <div>
            <p className="text-gray-300 text-sm">Email</p>
            <p className="text-lg">{profile.email}</p>
          </div>

          <div>
            <p className="text-gray-300 text-sm">Role</p>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm">
              {profile.role}
            </span>
          </div>

        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-10 flex gap-4">
        <button className="btn-primary px-6 py-3">Edit Profile</button>
        <button className="btn-primary bg-gray-600 px-6 py-3">Change Password</button>
      </div>

    </div>
  );
}
