// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ChatApp {

    struct user {
        string name;
        friend[] friendList;
    }

    struct friend {
        address pubKey;
        string name;
    }

    struct message {
        address sender;
        string text;
        uint256 timestamp;
    }

    struct allUserStruct{
        string name;
        address accountAddress;
    }

    allUserStruct[] allUserList;

    mapping(address => user) userList;
    mapping(bytes32 => message[]) messageList;

    function checkUserExist(address _pubKey) public view returns (bool) {
        return bytes(userList[_pubKey].name).length > 0;
    }

    // create a new user
    function createNewUser(string calldata _name) external {
        require(checkUserExist(msg.sender) == false, "User already exist");
        require(bytes(_name).length > 0, "Name cannot be empty");

        userList[msg.sender].name = _name;

        allUserList.push(allUserStruct(_name, msg.sender));
    }

    // get user
    function getUser(address _pubKey) public view returns (string memory) {
        require(checkUserExist(_pubKey), "User does not exist");

        return userList[_pubKey].name;
    }

    // add friend
    function addFriend(address _frd_pubKey, string calldata name) external {
        require(checkUserExist(msg.sender), "Create an account first");
        require(checkUserExist(_frd_pubKey), "your friend has not created an account");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(msg.sender == _frd_pubKey, "You cannot add yourself as a friend");
        require(checkAlreadyFriend(msg.sender, _frd_pubKey) == false, "You are already friends with this person");

        _addFriend(msg.sender, _frd_pubKey, name);
        _addFriend(_frd_pubKey, msg.sender, userList[msg.sender].name);
    }

    // check already friend
    function checkAlreadyFriend(address _pubKey1, address _pubKey2) internal view returns (bool) {
        if (userList[_pubKey1].friendList.length > userList[_pubKey2].friendList.length) {
            address temp = _pubKey1;
            _pubKey1 = _pubKey2;
            _pubKey2 = temp;
        }

        for (uint256 i =0; i < userList[_pubKey1].friendList.length; i++) {
            if (userList[_pubKey1].friendList[i].pubKey == _pubKey2) {
                return true;
            }
        }
            return false;
    }

    // add friend
    function _addFriend(address _pubKey1, address _pubKey2, string memory _name) internal {
        friend memory newFriend = friend(_pubKey2, _name);
        userList[_pubKey1].friendList.push(newFriend);
    }

    // get my friends
    function getMyFriends() public view returns (friend[] memory) {
        return userList[msg.sender].friendList;
    }

    // get chat code
    function getChatCode(address _pubKey1, address _pubKey2) internal pure returns (bytes32) {
     if (_pubKey1 > _pubKey2) {
         return keccak256(abi.encodePacked(_pubKey2, _pubKey1));
     } else {
         return keccak256(abi.encodePacked(_pubKey1, _pubKey2));
     }   
    }

    // send message
    function sendMessage(address _frd_pubKey, string calldata _msg) external {
        require(checkUserExist(msg.sender), "Create an account first");
        require(checkUserExist(_frd_pubKey), "your friend has not created an account");
        require(checkAlreadyFriend(msg.sender, _frd_pubKey), "You are not friends with this person");

        bytes32 _chatCode = getChatCode(msg.sender, _frd_pubKey);
        message memory newMessage = message(msg.sender, _msg, block.timestamp);
        messageList[_chatCode].push(newMessage);
        
    }

    // read message
    function readMessage(address _frd_pubKey) external view returns (message[] memory) {
        require(checkUserExist(msg.sender), "Create an account first");
        require(checkUserExist(_frd_pubKey), "your friend has not created an account");
        require(checkAlreadyFriend(msg.sender, _frd_pubKey), "You are not friends with this person");

        bytes32 _chatCode = getChatCode(msg.sender, _frd_pubKey);    
        return messageList[_chatCode];
    }

    function getAllUsers() public view returns (allUserStruct[] memory) {
        return allUserList;
    }

}