import { redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const requireAuth = (allowedRole: string) => {
  return () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return redirect("/login");
    }

    try {
      const decoded: any = jwtDecode(token);

      if (decoded.role !== allowedRole) {
        return redirect("/");
      }

      return null; // allow access
    } catch (err) {
      return redirect("/login");
    }
  };
};