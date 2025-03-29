import React from "react";
import { useUserContext } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const UserCard = ({ user }) => {
  const {
    currentUser,
    sendConnectionRequest,
    isConnected,
    hasPendingRequest,
    hasSentRequest,
    acceptConnectionRequest,
    declineConnectionRequest
  } = useUserContext();

  const { toast } = useToast();

  // Generate user initials for avatar
  const getInitials = (name = "Unknown") => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const handleSendRequest = () => {
    sendConnectionRequest(user._id);
    toast({
      title: "Request Sent",
      description: `Connection request sent to ${user.name}`,
    });
  };

  const handleAcceptRequest = () => {
    acceptConnectionRequest(`req_${user._id}_${currentUser?._id}`);
    toast({
      title: "Request Accepted",
      description: `You are now connected with ${user.name}`,
    });
  };

  const handleDeclineRequest = () => {
    declineConnectionRequest(`req_${user._id}_${currentUser?._id}`);
    toast({
      title: "Request Declined",
      description: `Connection request from ${user.name} was declined`,
    });
  };

  const getConnectionStatus = () => {
    if (isConnected(user._id)) {
      return (
        <div className="flex justify-center w-full">
          <Button
            variant="outline"
            className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all rounded-full"
            disabled
          >
            <Check className="w-4 h-4 mr-2" />
            Connected
          </Button>
        </div>
      );
    }

    if (hasPendingRequest(user._id)) {
      return (
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-blue-600 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 mr-1" />
            <span>Request Received</span>
          </p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              className="w-full bg-green-500 hover:bg-green-600 transition-colors rounded-full"
              onClick={handleAcceptRequest}
            >
              <Check className="w-4 h-4 mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 rounded-full"
              onClick={handleDeclineRequest}
            >
              <X className="w-4 h-4 mr-1" />
              Decline
            </Button>
          </div>
        </div>
      );
    }

    if (hasSentRequest(user._id)) {
      return (
        <Button
          variant="outline"
          className="w-full border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-full"
          disabled
        >
          <Clock className="w-4 h-4 mr-2" />
          Request Sent
        </Button>
      );
    }

    return (
      <Button
        className="w-full bg-blue-500 hover:bg-blue-600 transition-all rounded-full shadow-sm"
        onClick={handleSendRequest}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Connect
      </Button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg border border-gray-100">
      <div className="flex flex-col items-start">
        <div className="flex items-center w-full mb-4">
          <div className={cn(
            "rounded-full h-14 w-14 flex items-center justify-center text-white font-medium text-lg mr-4",
            "bg-gradient-to-br from-blue-500 to-violet-500"
          )}>
            {getInitials(user.name)}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-gray-600 text-sm">
              {user.department}{user.yearOfStudy ? ` · ${user.yearOfStudy}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {user.aoi.map((interest, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
            >
              {interest}
            </span>
          ))}
        </div>

        <p className="text-gray-700 mb-5 text-sm">{user.bio}</p>

        <div className="w-full border-t pt-4 mt-auto">
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center text-sm font-medium">
              <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                {user.creditPoints}
              </div>
              <span className="text-gray-600">credit points</span>
            </div>

            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-2 rounded-full">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>

          <div className="w-full">
            {getConnectionStatus()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
