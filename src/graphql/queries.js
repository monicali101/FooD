/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const checkFriendUsername = `query CheckFriendUsername($friendUsername: String!) {
  checkFriendUsername(friendUsername: $friendUsername) {
    items {
      id
      username
      email
      firstName
      lastName
      profilePic
    }
  }
}
`;
export const checkFriendEmail = `query CheckFriendEmail($friendEmail: String!) {
  checkFriendEmail(friendEmail: $friendEmail) {
    items {
      id
      username
      email
      firstName
      lastName
      profilePic
    }
  }
}
`;
export const listReceivedSharedRecords = `query ListReceivedSharedRecords(
  $filter: ModelshareHistoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listReceivedSharedRecords(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
`;
export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
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
export const listUsers = `query ListUsers(
  $filter: ModeluserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getUserClick = `query GetUserClick($id: ID!) {
  getUserClick(id: $id) {
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
export const listUserClicks = `query ListUserClicks(
  $filter: ModeluserClickFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserClicks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getUserClickCuisine = `query GetUserClickCuisine($id: ID!) {
  getUserClickCuisine(id: $id) {
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
export const listUserClickCuisines = `query ListUserClickCuisines(
  $filter: ModeluserClickCuisineFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserClickCuisines(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      cusineID
      cuisineName
      keywords
      createdAt
      updatedAt
      owner
    }
    nextToken
  }
}
`;
export const getRankMap = `query GetRankMap($id: ID!, $count: Int!) {
  getRankMap(id: $id, count: $count) {
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
export const listRankMaps = `query ListRankMaps(
  $id: ID
  $count: ModelIntKeyConditionInput
  $filter: ModelrankMapFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listRankMaps(
    id: $id
    count: $count
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      id
      keyword
      count
      userId
      createdAt
      updatedAt
      owner
    }
    nextToken
  }
}
`;
export const getSharing = `query GetSharing($myId: ID!, $friendEmail: ID!) {
  getSharing(myId: $myId, friendEmail: $friendEmail) {
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
export const listSharings = `query ListSharings(
  $myId: ID
  $friendEmail: ModelIDKeyConditionInput
  $filter: ModelsharingFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listSharings(
    myId: $myId
    friendEmail: $friendEmail
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
  }
}
`;
export const getShareHistory = `query GetShareHistory($id: ID!) {
  getShareHistory(id: $id) {
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
export const listShareHistorys = `query ListShareHistorys(
  $filter: ModelshareHistoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listShareHistorys(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
