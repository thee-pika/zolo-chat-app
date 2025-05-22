import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NotificationDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Example notification data
  const notifications = [
    { id: 1, username: "John Doe", avatar: "https://via.placeholder.com/150" },
    { id: 2, username: "Jane Smith", avatar: "" },
    {
      id: 3,
      username: "Alice Johnson",
      avatar: "https://via.placeholder.com/150",
    },
  ];

  const handleAccept = (id: number) => {
    console.log(`Accepted notification with ID: ${id}`);
  };

  const handleReject = (id: number) => {
    console.log(`Rejected notification with ID: ${id}`);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    {notification.avatar ? (
                      <AvatarImage
                        src={notification.avatar}
                        alt={notification.username}
                      />
                    ) : (
                      <AvatarFallback>
                        {notification.username.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>{notification.username}</span>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleAccept(notification.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(notification.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationDialog;
