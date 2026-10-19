import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { UserIcon, MailIcon, BuildingIcon, Loader2Icon, SparklesIcon } from "lucide-react";

export default function RecruiterProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

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

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-500 py-16 justify-center">
        <Loader2Icon className="w-4 h-4 animate-spin text-zinc-400" />
        <span>Loading company profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Company & Recruiter Profile
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your organizational details visible on job postings.
        </p>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8 rounded-xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              <UserIcon className="inline w-3.5 h-3.5 mr-1 text-zinc-400" /> Contact Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 text-xs focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              <MailIcon className="inline w-3.5 h-3.5 mr-1 text-zinc-400" /> Account Email (Read-only)
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              className="w-full p-2.5 rounded-lg border border-zinc-800/60 bg-zinc-950/50 text-zinc-500 text-xs cursor-not-allowed"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              <BuildingIcon className="inline w-3.5 h-3.5 mr-1 text-zinc-400" /> Company / Organization
            </label>
            <input
              type="text"
              name="company"
              value={profile.company}
              onChange={handleChange}
              placeholder="e.g. Acme Technologies"
              className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none transition"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              About the Company
            </label>
            <textarea
              name="bio"
              rows="4"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Describe your organization mission, engineering culture, or hiring focus..."
              className="w-full p-3 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none transition leading-relaxed"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-zinc-800/80 flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="inline-flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-5 py-2.5 rounded-lg text-xs font-semibold transition shadow-sm disabled:opacity-50"
            >
              {updating ? (
                <>
                  <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Profile Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
