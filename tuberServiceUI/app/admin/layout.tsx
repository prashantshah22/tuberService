import AdminLayout from "@/component/admin/AdminLayout";
import React, { FC, ReactNode } from "react";

const AdminLayoutRouter: FC<{ children: ReactNode }> = ({ children }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminLayoutRouter;
