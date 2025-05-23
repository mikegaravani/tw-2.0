import { useEffect } from "react";
import { useTimeMachineStore } from "@/store/useTimeMachineStore";

import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBanner } from "./TopBanner";

function Layout() {
  const syncTimeFromBackend = useTimeMachineStore(
    (state) => state.syncTimeFromBackend
  );
  const updateNow = useTimeMachineStore((state) => state.updateNow);

  useEffect(() => {
    syncTimeFromBackend();

    const interval = setInterval(updateNow, 1000);
    return () => clearInterval(interval);
  }, [syncTimeFromBackend, updateNow]);
  return (
    <>
      <SidebarProvider>
        <div className="w-screen h-screen flex flex-row">
          <TopBanner />
          <AppSidebar />
          <div className="relative flex-1">
            <SidebarInset className="flex-1 overflow-auto">
              <div className="absolute top-14 left-0 right-0 bottom-0 overflow-auto">
                <main className="w-full h-full">
                  <Outlet />
                </main>
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}

export default Layout;
