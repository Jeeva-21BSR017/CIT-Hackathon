
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext({
  currentUser: null,
  users: [],
  connectionRequests: [],
  sentRequests: [],
  connections: [],
  setCurrentUser: () => {},
  sendConnectionRequest: () => {},
  acceptConnectionRequest: () => {},
  declineConnectionRequest: () => {},
  isConnected: () => false,
  hasPendingRequest: () => false,
  hasSentRequest: () => false,
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  // Mock data loading - in a real app this would be API calls
  useEffect(() => {
    // Mock current user
    const mockCurrentUser = {
      _id: "67cbfd4d8c5234d5c16a563d",
      username: "Jeeva",
      email: "jeevaa.21bsr@kongu.edu",
      fullName: "Jeeva",
      department: "MCA",
      college: "Kongu Engineering College.",
      yearOfStudy: "1st Year",
      aoi: ["Full stack developer", "Java Developer"],
      bio: "Computer science student at kongu Engineering College",
      profileImage: null,
      role: "student",
      creditPoints: 85
    };

    // Mock other users
    const mockUsers = [
      {
        _id: "67cbfd4d8c5234d5c16a561a",
        username: "RaviK",
        email: "ravi@kongu.edu",
        fullName: "Ravi Kumar",
        department: "MCA",
        college: "Kongu Engineering College.",
        yearOfStudy: "1st Year",
        aoi: ["Full stack developer", "Mobile App Developer"],
        bio: "Passionate about web development and creating intuitive user experiences.",
        profileImage: null,
        role: "student",
        creditPoints: 120
      },
      {
        _id: "67cbfd4d8c5234d5c16a562b",
        username: "PriyaS",
        email: "priya@kongu.edu",
        fullName: "Priya S",
        department: "MCA",
        college: "Kongu Engineering College.",
        yearOfStudy: "2nd Year",
        aoi: ["Full stack developer", "UI/UX Designer"],
        bio: "Creative developer with a strong focus on design systems and component libraries.",
        profileImage: null,
        role: "student",
        creditPoints: 95
      },
      {
        _id: "67cbfd4d8c5234d5c16a563c",
        username: "RajS",
        email: "raj@kongu.edu",
        fullName: "Raj Sharma",
        department: "MCA",
        college: "Kongu Engineering College.",
        yearOfStudy: "3rd Year",
        aoi: ["Java Developer", "Backend Developer"],
        bio: "Focused on building scalable backend systems and microservices.",
        profileImage: null,
        role: "student",
        creditPoints: 110
      },
      {
        _id: "67cbfd4d8c5234d5c16a564d",
        username: "Anita",
        email: "anita@kongu.edu",
        fullName: "Anita Gupta",
        department: "CSE",
        college: "Kongu Engineering College.",
        yearOfStudy: "2nd Year",
        aoi: ["AI/ML Engineer", "Data Scientist"],
        bio: "Exploring machine learning applications in real-world scenarios.",
        profileImage: null,
        role: "student",
        creditPoints: 105
      },
      {
        _id: "67cbfd4d8c5234d5c16a565e",
        username: "Karthik",
        email: "karthik@kongu.edu",
        fullName: "Karthik R",
        department: "ECE",
        college: "Kongu Engineering College.",
        yearOfStudy: "3rd Year",
        aoi: ["IoT Developer", "Mobile App Developer"],
        bio: "Working on IoT projects and smart systems integration.",
        profileImage: null,
        role: "student",
        creditPoints: 88
      }
    ];

    setCurrentUser(mockCurrentUser);
    setUsers(mockUsers);
  }, []);

  const sendConnectionRequest = (toUserId) => {
    if (!currentUser) return;
    
    const newRequest = {
      id: `req_${Date.now()}`,
      from: currentUser,
      to: toUserId,
      status: "pending",
      timestamp: new Date()
    };
    
    setConnectionRequests(prev => [...prev, newRequest]);
    setSentRequests(prev => [...prev, toUserId]);
  };

  const acceptConnectionRequest = (requestId) => {
    const request = connectionRequests.find(req => req.id === requestId);
    if (!request) return;

    // Update request status
    setConnectionRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "accepted" } : req
      )
    );

    // Add to connections
    const connectedUser = users.find(user => user._id === request.from._id);
    if (connectedUser) {
      setConnections(prev => [...prev, connectedUser]);
    }
  };

  const declineConnectionRequest = (requestId) => {
    setConnectionRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "declined" } : req
      )
    );
  };

  const isConnected = (userId) => {
    return connections.some(conn => conn._id === userId);
  };

  const hasPendingRequest = (userId) => {
    return connectionRequests.some(
      req => req.from._id === userId && req.to === currentUser?._id && req.status === "pending"
    );
  };

  const hasSentRequest = (userId) => {
    return sentRequests.includes(userId);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        connectionRequests,
        sentRequests,
        connections,
        sendConnectionRequest,
        acceptConnectionRequest,
        declineConnectionRequest,
        isConnected,
        hasPendingRequest,
        hasSentRequest
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
