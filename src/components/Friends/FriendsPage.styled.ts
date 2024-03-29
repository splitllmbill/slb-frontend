import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

export const SearchIcon = styled.img`
  width: 30px;
  cursor: pointer;
`;

export const AddFriendIcon = styled.img`
  width: 30px;
  cursor: pointer;
`;

export const FriendList = styled.div`
  /* Add your styles for the friend list here */
`;

export const Friend = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

export const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ccc;
  margin-right: 10px;
`;

export const FriendDetails = styled.div`
  /* Add your styles for friend details here */
`;

export const FriendsContainer = styled.div`
  padding: 20px;
  margin: 10px;
`;

export const Flex = styled.div`
    display: flex;
    gap: 10px;
`;