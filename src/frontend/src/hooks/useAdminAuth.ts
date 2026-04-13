export function useAdminAuth() {
  const isLocalAdmin = localStorage.getItem("psychediet_admin_auth") === "true";
  const clearLocalAdmin = () => {
    localStorage.removeItem("psychediet_admin_auth");
  };
  return { isLocalAdmin, clearLocalAdmin };
}
