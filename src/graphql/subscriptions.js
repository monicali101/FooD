/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = `subscription OnCreateUser($owner: String!) {
  onCreateUser(owner: $owner) {
    id
    username
    favourites
    favouriteSearch
    favouriteShared
    preferences
    email
    firstName
    lastName
    recommendDishes {
      id
      dishName
    }
    profilePic
    myFriendEmails
    myFriendUsernames
    myFriendId
    createdAt
    updatedAt
    owner
  }
}
`;
export const onUpdateUser = `subscription OnUpdateUser($owner: String!) {
  onUpdateUser(owner: $owner) {
    id
    username
    favourites
    favouriteSearch
    favouriteShared
    preferences
    email
    firstName
    lastName
    recommendDishes {
      id
      dishName
    }
    profilePic
    myFriendEmails
    myFriendUsernames
    myFriendId
    createdAt
    updatedAt
    owner
  }
}
`;
export const onDeleteUser = `subscription OnDeleteUser($owner: String!) {
  onDeleteUser(owner: $owner) {
    id
    username
    favourites
    favouriteSearch
    favouriteShared
    preferences
    email
    firstName
    lastName
    recommendDishes {
      id
      dishName
    }
    profilePic
    myFriendEmails
    myFriendUsernames
    myFriendId
    createdAt
    updatedAt
    owner
  }
}
`;
export const onCreateUserClick = `subscription OnCreateUserClick($owner: String!) {
  onCreateUserClick(owner: $owner) {
    id
    dishId
    dishName
    cusineID
    cuisineName
    keywords
    createdAt
    updatedAt
    owner
  }
}
`;
export const onUpdateUserClick = `subscription OnUpdateUserClick($owner: String!) {
  onUpdateUserClick(owner: $owner) {
    id
    dishId
    dishName
    cusineID
    cuisineName
    keywords
    createdAt
    updatedAt
    owner
  }
}
`;
export const onDeleteUserClick = `subscription OnDeleteUserClick($owner: String!) {
  onDeleteUserClick(owner: $owner) {
    id
    dishId
    dishName
    cusineID
    cuisineName
    keywords
    createdAt
    updatedAt
    owner
  }
}
`;
export const onCreateUserClickCuisine = `subscription OnCreateUserClickCuisine($owner: String!) {
  onCreateUserClickCuisine(owner: $owner) {
    id
    cusineID
    cuisineName
    keywords
    createdAt
    updatedAt
    owner
  }
}
`;
export const onUpdateUserClickCuisine = `subscription OnUpdateUserClickCuisine($owner: String!) {
  onUpdateUserClickCuisine(owner: $owner) {
    id
    cusineID
    cuisineName
    keywords
    createdAt
    updatedAt
    owner
  }
}
`;
export const onDeleteUserClickCuisine = `subscription OnDeleteUserClickCuisine($owner: String!) {
  onDeleteUserClickCuisine(owner: $owner) {
    id
    cusineID
    cuisineName
    keywords
    createdAt
    updatedAt
    owner
  }
}
`;
export const onCreateRankMap = `subscription OnCreateRankMap($owner: String!) {
  onCreateRankMap(owner: $owner) {
    id
    keyword
    count
    userId
    createdAt
    updatedAt
    owner
  }
}
`;
export const onUpdateRankMap = `subscription OnUpdateRankMap($owner: String!) {
  onUpdateRankMap(owner: $owner) {
    id
    keyword
    count
    userId
    createdAt
    updatedAt
    owner
  }
}
`;
export const onDeleteRankMap = `subscription OnDeleteRankMap($owner: String!) {
  onDeleteRankMap(owner: $owner) {
    id
    keyword
    count
    userId
    createdAt
    updatedAt
    owner
  }
}
`;
export const onCreateSharing = `subscription OnCreateSharing($owner: String!) {
  onCreateSharing(owner: $owner) {
    myId
    myEmail
    myUserName
    friendEmail
    friendUsername
    favourites
    message {
      title
      body
    }
    unread
    createdAt
    updatedAt
    owner
  }
}
`;
export const onUpdateSharing = `subscription OnUpdateSharing($owner: String!) {
  onUpdateSharing(owner: $owner) {
    myId
    myEmail
    myUserName
    friendEmail
    friendUsername
    favourites
    message {
      title
      body
    }
    unread
    createdAt
    updatedAt
    owner
  }
}
`;
export const onDeleteSharing = `subscription OnDeleteSharing($owner: String!) {
  onDeleteSharing(owner: $owner) {
    myId
    myEmail
    myUserName
    friendEmail
    friendUsername
    favourites
    message {
      title
      body
    }
    unread
    createdAt
    updatedAt
    owner
  }
}
`;
export const onCreateShareHistory = `subscription OnCreateShareHistory($owner: String!) {
  onCreateShareHistory(owner: $owner) {
    id
    senderId
    senderEmail
    senderUsername
    receiverEmail
    receiverUsername
    favourites
    message {
      title
      body
    }
    unread
    createdAt
    updatedAt
    owner
  }
}
`;
export const onUpdateShareHistory = `subscription OnUpdateShareHistory($owner: String!) {
  onUpdateShareHistory(owner: $owner) {
    id
    senderId
    senderEmail
    senderUsername
    receiverEmail
    receiverUsername
    favourites
    message {
      title
      body
    }
    unread
    createdAt
    updatedAt
    owner
  }
}
`;
export const onDeleteShareHistory = `subscription OnDeleteShareHistory($owner: String!) {
  onDeleteShareHistory(owner: $owner) {
    id
    senderId
    senderEmail
    senderUsername
    receiverEmail
    receiverUsername
    favourites
    message {
      title
      body
    }
    unread
    createdAt
    updatedAt
    owner
  }
}
`;
