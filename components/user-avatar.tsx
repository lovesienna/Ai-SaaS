import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = () => {
  const { user } = useUser();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user?.profileImageUrl} />
      <AvatarFallback>
        {user?.firstName?.charAt(0)}
        {/* charAt() 메서드를 사용하여 문자열에서 특정 위치의 문자를 추출할 수 있습니다. */}
        {user?.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
