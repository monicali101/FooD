/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateReceivedShareRecord = `mutation UpdateReceivedShareRecord($input: UpdateShareHistoryInput!) {
  updateReceivedShareRecord(input: $input) {
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
export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
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
    recommendDishesNew
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
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
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
    recommendDishesNew
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
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
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
    recommendDishesNew
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
export const createUserClick = `mutation CreateUserClick($input: CreateUserClickInput!) {
  createUserClick(input: $input) {
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
export const updateUserClick = `mutation UpdateUserClick($input: UpdateUserClickInput!) {
  updateUserClick(input: $input) {
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
export const deleteUserClick = `mutation DeleteUserClick($input: DeleteUserClickInput!) {
  deleteUserClick(input: $input) {
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
export const createUserClickCuisine = `mutation CreateUserClickCuisine($input: CreateUserClickCuisineInput!) {
  createUserClickCuisine(input: $input) {
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
export const updateUserClickCuisine = `mutation UpdateUserClickCuisine($input: UpdateUserClickCuisineInput!) {
  updateUserClickCuisine(input: $input) {
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
export const deleteUserClickCuisine = `mutation DeleteUserClickCuisine($input: DeleteUserClickCuisineInput!) {
  deleteUserClickCuisine(input: $input) {
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
export const createRankMap = `mutation CreateRankMap($input: CreateRankMapInput!) {
  createRankMap(input: $input) {
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
export const updateRankMap = `mutation UpdateRankMap($input: UpdateRankMapInput!) {
  updateRankMap(input: $input) {
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
export const deleteRankMap = `mutation DeleteRankMap($input: DeleteRankMapInput!) {
  deleteRankMap(input: $input) {
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
export const createSharing = `mutation CreateSharing($input: CreateSharingInput!) {
  createSharing(input: $input) {
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
export const updateSharing = `mutation UpdateSharing($input: UpdateSharingInput!) {
  updateSharing(input: $input) {
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
export const deleteSharing = `mutation DeleteSharing($input: DeleteSharingInput!) {
  deleteSharing(input: $input) {
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
export const createShareHistory = `mutation CreateShareHistory($input: CreateShareHistoryInput!) {
  createShareHistory(input: $input) {
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
export const updateShareHistory = `mutation UpdateShareHistory($input: UpdateShareHistoryInput!) {
  updateShareHistory(input: $input) {
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
export const deleteShareHistory = `mutation DeleteShareHistory($input: DeleteShareHistoryInput!) {
  deleteShareHistory(input: $input) {
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
