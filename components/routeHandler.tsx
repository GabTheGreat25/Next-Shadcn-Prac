import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../state/authStore";

interface RouteProps {
  children: React.ReactNode;
  isProtected: boolean;
}

export default function RouteHandler({ children, isProtected }: RouteProps) {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    if (isProtected && !accessToken) {
      router.push("/login");
    }

    if (user) {
      const role = user.role.roleName;
      if (role === "Merchant") {
        router.push("/dashboard/merchant");
      } else if (role === "Customer") {
        router.push("/dashboard/customer");
      }
    }
  }, [accessToken, user, router, isProtected]);

  return isProtected && !accessToken ? null : <>{children}</>;
}
