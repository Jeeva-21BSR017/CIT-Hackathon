import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import Layout from "@/components/community/Layout";
import UserCard from "@/components/community/UserCard";
import PublicChat from "@/components/community/PublicChat";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, Check, UsersRound, MessageSquare, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
// import { getUsers, getPublicChatMessages, sendPublicChatMessage } from "@/services/api";

// Static test data
const staticUsers = [
  {
    _id: "1",
    name: "Jabastin",
    department: "MCA",
    aoi: ["React", "Node.js", "AI"],
    email: "jabastin@example.com",
  },
  {
    _id: "2",
    name: "Ajaykanna",
    department: "MCA",
    aoi: ["Python", "Machine Learning", "AI"],
    email: "Ajaykanna@example.com",
  },
  {
    _id: "3",
    name: "Karthikayan",
    department: "MCA",
    aoi: ["UI/UX", "Figma", "Design Systems"],
    email: "karthi@example.com",
  },
  {
    _id: "4",
    name: "Jeeva",
    department: "MCA",
    aoi: ["React", "TypeScript", "GraphQL"],
    email: "jeeva@example.com",
  },
  {
    _id: "5",
    name: "Rahul",
    department: "Engineering",
    aoi: ["React", "Node.js", "AI"],
    email: "jabastin@example.com",
  },
  {
    _id: "6",
    name: "Gowtham",
    department: "Engineering",
    aoi: ["Machine Learning"],
    email: "gowtham@example.com",
  },
  {
    _id: "7",
    name: "Jaya Suriya",
    department: "Engineering",
    aoi: ["UI/UX", "Figma", "Design Systems"],
    email: "karthi@example.com",
  },
  {
    _id: "8",
    name: "Jeeva",
    department: "Engineering",
    aoi: ["React", "TypeScript", "GraphQL"],
    email: "jeeva@example.com",
  },
];

const staticCurrentUser = {
  _id: "5",
  name: "Test User",
  department: "MCA",
  aoi: ["React", "JavaScript", "Web Development"],
  email: "test@example.com",
};

const staticChatMessages = [
  {
    _id: "1",
    user: { _id: "1", name: "Jabastin" },
    message: "The MCA Department is thrilled to announce the Orion Inter-Department Event, an exciting celebration designed to spark creativity, foster collaboration, and bring together the best minds across, Engaging Workshops & Interactive Sessions\nTeam-Building Challenges\nInnovative Showcases\nNetworking Opportunities\nFun & Refreshments",
    timestamp: new Date("2025-03-10T10:00:00"),
  },
  {
    _id: "2",
    user: { _id: "2", name: "Balaji" },
    message: "Anyone interested in ML meetup?",
    timestamp: new Date("2025-03-10T10:05:00"),
  },
];

const Community = () => {
  const { currentUser: contextUser, setUsers } = useUserContext();
  const currentUser = contextUser || staticCurrentUser; // Use static user if context is empty
  const [filteredUsers, setFilteredUsers] = useState(staticUsers);
  const [departmentFilter, setDepartmentFilter] = useState("intra");
  const [interestFilter, setInterestFilter] = useState(null);
  const [tab, setTab] = useState("people");
  const [isLoading, setIsLoading] = useState(false); // Changed to false since we're using static data
  const [publicChatMessages, setPublicChatMessages] = useState(staticChatMessages);

  // Simulate fetching data with static values
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay if desired
        // await new Promise(resolve => setTimeout(resolve, 1000));

        setUsers(staticUsers);
        setFilteredUsers(staticUsers);
        setPublicChatMessages(staticChatMessages);
      } catch (error) {
        console.error('Error with static data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setUsers]);

  // Get unique interests from all users including current user
  const allInterests = [...new Set([
    ...(currentUser?.aoi || []),
    ...staticUsers.flatMap(user => user.aoi || [])
  ])];

  // Filter users based on department and interest
  useEffect(() => {
    let filtered = [...staticUsers];

    // Filter by department
    if (departmentFilter === "intra") {
      filtered = filtered.filter(user => user.department === currentUser.department);
    }

    // Filter by interest if selected
    if (interestFilter) {
      filtered = filtered.filter(user => user.aoi.includes(interestFilter));
    }

    // Remove current user from the list
    filtered = filtered.filter(user => user._id !== currentUser._id);

    setFilteredUsers(filtered);
  }, [currentUser, departmentFilter, interestFilter]);

  const handleSendMessage = async (message) => {
    try {
      const newMessage = {
        _id: String(publicChatMessages.length + 1),
        user: { _id: currentUser._id, name: currentUser.name },
        message,
        timestamp: new Date(),
      };
      setPublicChatMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="people" className="flex items-center gap-2">
              <UsersRound className="h-4 w-4" />
              People
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Public Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="space-y-8">
            {/* Department Filter */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium mb-4">Department Filter</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className={cn(
                    "border h-14 text-base justify-start px-6",
                    departmentFilter === "intra" && "border-blue-500 bg-blue-50 text-blue-700"
                  )}
                  onClick={() => setDepartmentFilter("intra")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Intra Department</span>
                    <span className="text-xs text-gray-500">{`(${currentUser?.department || ''})`}</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "border h-14 text-base justify-start px-6",
                    departmentFilter === "inter" && "border-blue-500 bg-blue-50 text-blue-700"
                  )}
                  onClick={() => setDepartmentFilter("inter")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Inter Department</span>
                    <span className="text-xs text-gray-500">(All)</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Interest Filter */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Interest Filter</h2>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span className="max-w-[180px] truncate">{interestFilter || "All Interests"}</span>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2" align="end">
                    <div className="space-y-1">
                      <h3 className="font-medium px-2 py-1.5">Filter by Interest</h3>
                      <Separator />
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setInterestFilter(null)}
                      >
                        <span className={!interestFilter ? "font-medium" : ""}>All Interests</span>
                        {!interestFilter && <Check className="h-4 w-4 ml-2" />}
                      </Button>

                      {allInterests.map((interest) => (
                        <Button
                          key={interest}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setInterestFilter(interest)}
                        >
                          <span className={cn(
                            "truncate",
                            interestFilter === interest ? "font-medium" : ""
                          )}>
                            {interest}
                          </span>
                          {interestFilter === interest && <Check className="h-4 w-4 ml-2 flex-shrink-0" />}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {interestFilter && (
                <Badge
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                  onClick={() => setInterestFilter(null)}
                >
                  {interestFilter}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>

            {/* User Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <UserCard
                    key={user._id}
                    user={{ ...user, name: user.name || "Unknown" }}
                  />
                ))
              ) : (
                <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <UsersRound className="h-10 w-10 text-gray-300" />
                    <p className="text-gray-500 font-medium">
                      No users found matching your filters
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setInterestFilter(null);
                        setDepartmentFilter("inter");
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <PublicChat messages={publicChatMessages} onSendMessage={handleSendMessage} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Community;
