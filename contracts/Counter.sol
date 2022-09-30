// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.0;

contract Counter {
    string private name;
    uint private count;

    constructor(string memory _name, uint _initialCount) {
        name = _name;
        count = _initialCount;
    }

    function increment() public returns (uint newCount) {
        count++;
        return count;
    }

    function decrement() public returns (uint newCount) {
        count--;
        return count;
    }

    function getCount() public view returns (uint) {
        return count;
    }

    function getName() public view returns (string memory curretName) {
        return name;
    }

    function setName(string memory _newName)
        public
        returns (string memory newName)
    {
        name = _newName;
        return name;
    }
}
