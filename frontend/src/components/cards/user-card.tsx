import { User } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

interface UserCardProps {
  user: User;
  onToggleBlock: (userId: string, isBlocked: boolean) => void;
  isAdmin: boolean;
}

export function UserCard({ user, onToggleBlock, isAdmin }: UserCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{user.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Status:</strong> {user.isBlocked ? "Blocked" : "Active"}
        </p>
        <p>
          <strong>Created:</strong> {format(new Date(user.createdAt), "PP")}
        </p>
        <p>
          <strong>Updated:</strong> {format(new Date(user.updatedAt), "PP")}
        </p>
      </CardContent>
      {isAdmin && (
        <CardFooter>
          <Button
            variant={user.isBlocked ? "outline" : "destructive"}
            size="sm"
            onClick={() => onToggleBlock(user._id, user.isBlocked)}
          >
            {user.isBlocked ? "Unblock" : "Block"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
