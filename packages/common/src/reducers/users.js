import { createSelector } from "reselect";
import { mapValues, omitKey } from "../utils/object";
import { indexBy } from "../utils/array";
import combineReducers from "../utils/combine-reducers";
import { arrayShallowEquals } from "../utils/reselect";
import { truncateAddress } from "../utils/ethereum";
import { build as buildProfilePicture } from "../utils/profile-pictures";

const entriesById = (state = {}, action) => {
  switch (action.type) {
    case "fetch-channel-members-request-successful":
    case "fetch-users-request-successful": {
      const users = action.members ?? action.users;
      const mergedUsers = users.map((u) => {
        const existingUser = state[u.id];
        return { ...existingUser, ...u };
      });
      const usersById = indexBy((m) => m.id, mergedUsers);
      return { ...state, ...usersById };
    }

    case "fetch-me-request-successful":
    case "fetch-client-boot-data-request-successful": {
      const exisingUser = state[action.user.id];
      return { ...state, [action.user.id]: { ...exisingUser, ...action.user } };
    }

    case "server-event:user-profile-updated":
      return mapValues((user) => {
        if (user.id !== action.data.user) return user;
        return {
          ...user,
          ...omitKey("user", action.data),
        };
      }, state);

    case "server-event:channel-user-joined":
    case "server-event:channel-user-invited":
      return {
        ...state,
        [action.data.user.id]: action.data.user,
      };

    case "server-event:user-presence-updated":
      return mapValues((user) => {
        if (user.id !== action.data.user.id) return user;
        return {
          ...user,
          status: action.data.user.status,
        };
      }, state);

    case "logout":
      return {};

    default:
      return state;
  }
};

const starsByUserId = (state = [], action) => {
  switch (action.type) {
    case "fetch-starred-items:request-successful": {
      const userStars = action.stars.filter((s) => s.type === "user");
      return indexBy((s) => s.reference, userStars);
    }

    case "star-user:request-successful":
      return { ...state, [action.userId]: action.star };

    case "unstar-user:request-successful":
      return omitKey(action.userId, state);

    case "logout":
      return [];

    default:
      return state;
  }
};

const selectAllUsers = (state) =>
  Object.keys(state.users.entriesById).map((userId) =>
    selectUser(state, userId)
  );

export const selectUser = createSelector(
  (state, userId) => state.users.entriesById[userId],
  (state, userId) => {
    const user = state.users.entriesById[userId];
    if (user == null) return null;
    return state.ens.namesByAddress[user.walletAddress.toLowerCase()];
  },
  (state) => state.me.user,
  (user, ensName, loggedInUser) => {
    if (user == null) return null;
    const isLoggedInUser = user.id === loggedInUser?.id;

    const displayName =
      user.display_name.trim() === "" ? null : user.display_name;
    const walletAddress = user.wallet_address;
    const hasCustomDisplayName = truncateAddress(walletAddress) !== displayName;

    return {
      ...user,
      ensName,
      displayName: displayName ?? truncateAddress(walletAddress),
      customDisplayName: hasCustomDisplayName ? displayName : null,
      hasCustomDisplayName,
      walletAddress,
      onlineStatus: isLoggedInUser ? "online" : user.status,
      profilePicture: buildProfilePicture(user.pfp),
    };
  },
  { memoizeOptions: { maxSize: 1000 } }
);

export const selectUsers = createSelector(
  (state, userIds) =>
    userIds.map((userId) => selectUser(state, userId)).filter(Boolean),
  (users) => users,
  { memoizeOptions: { equalityCheck: arrayShallowEquals } }
);

export const selectUserFromWalletAddress = (state, address) =>
  selectAllUsers(state).find(
    (u) => u.walletAddress.toLowerCase() === address.toLowerCase()
  );

export const selectStarredUserIds = createSelector(
  (state) => Object.keys(state.users.starsByUserId),
  (userIds) => userIds,
  { memoizeOptions: { equalityCheck: arrayShallowEquals } }
);

export const selectStarredUsers = createSelector(
  (state) =>
    selectStarredUserIds(state)
      .map((id) => selectUser(state, id))
      .filter(Boolean),
  (users) => users,
  { memoizeOptions: { equalityCheck: arrayShallowEquals } }
);

export const selectIsUserStarred = (state, id) =>
  selectUserStarId(state, id) != null;

export const selectUserStarId = (state, userId) =>
  state.users.starsByUserId[userId]?.id;

export default combineReducers({ entriesById, starsByUserId });
