import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { UserIcon, MailIcon, BuildingIcon, Loader2Icon } from "lucide-react";

export default function RecruiterProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch recruiter profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/users/me");
        setProfile({
          name: data.name,
          email: data.email,
          company: data.company || "",
          bio: data.bio || "",
        });
      } catch (err) {
        toast.error("Error fetching profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data } = await API.put("/users/me", profile);
      toast.success("Profile updated successfully!");
      setProfile({
        name: data.user.name,
        email: data.user.email,
        company: data.user.company,
        bio: data.user.bio,
      });
    } catch (err) {
      toast.error("Error updating profile");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <Loader2Icon className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">
        My Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <UserIcon className="inline w-4 h-4 mr-1" /> Name
          </label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <MailIcon className="inline w-4 h-4 mr-1" /> Email
          </label>
          <input
            type="email"
            name="email"
            value={profile.email}
            disabled
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <BuildingIcon className="inline w-4 h-4 mr-1" /> Company
          </label>
          <input
            type="text"
            name="company"
            value={profile.company}
            onChange={handleChange}
            placeholder="Your organization name"
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio / Description
          </label>
          <textarea
            name="bio"
            rows="3"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Briefly describe yourself or your company..."
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-all disabled:opacity-70"
          >
            {updating ? (
              <>
                <Loader2Icon className="w-5 h-5 animate-spin" /> Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
