"use client";

import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { useEffect, useState } from "react";
import { getUserNotifications } from "@/actions/get-notifications";
import { Notification } from "@prisma/client";
import { ScrollArea } from "./ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications();
      setNotifications(data);
      setHasUnread(data.some((n) => !n.read));
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {hasUnread && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold">Notificações</h4>
        </div>
        <ScrollArea className="h-[300px]">
           {notifications.length === 0 ? (
               <div className="p-4 text-center text-sm text-muted-foreground">
                   Nenhuma notificação.
               </div>
           ) : (
               <div className="flex flex-col">
                   {notifications.map((notification) => (
                       <div key={notification.id} className={`flex flex-col gap-1 border-b p-4 ${!notification.read ? 'bg-muted/50' : ''}`}>
                           <p className="font-medium text-sm">{notification.title}</p>
                           <p className="text-xs text-muted-foreground">{notification.message}</p>
                           <p className="text-[10px] text-muted-foreground text-right mt-1">
                               {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: ptBR })}
                           </p>
                       </div>
                   ))}
               </div>
           )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationList;
