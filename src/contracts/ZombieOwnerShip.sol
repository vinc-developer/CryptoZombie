pragma solidity ^0.8.0;

import "./ZombieAttack.sol";
import "./tokens/erc721.sol";
import "./maths/SafeMath.sol";

/// @title Un contrat qui permet de gère le transfère de propriété d'un zombie
/// @author vincent
/// @dev est pour donner plus de détails aux développeurs.
// @notice explique à un utilisateur ce que le contrat / fonction fait
contract ZombieOwnerShip is ZombieAttack, ERC721 {

    using SafeMath for uint256;

    mapping (uint => address) zombieApprovals;

    /**
    * @dev Renvoie le nombre de token de l'address
    * @param _balance
    * @return l'armé de zombie
    */
    function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ownerZombieCount[_owner];
    }

    /**
    *Renvoie l'address du proprietaire du token
    */
    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return zombieToOwner[_tokenId];
    }

    /**
    *Fonction qui permet le transfert d'un zombie d'une address vers l'autre
    */
    function _transfer(address _from, address _to, uint256 _tokenId) private onlyOwnerOf(_from){
        ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
        ownerZombieCount[_from] = ownerZombieCount[_from].sub(1);
        zombieToOwner[_tokenId] = _to;
        Transfer(_from, _to, _tokenId);
    }

    /**
    * fonction qui permet de verifier le proprietaire de token avant le transfert
    */
    function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId){
        _transfer(msg.sender, _to, _tokenId);
    }

    /**
    *Verifie que seul le propriétaire du token puisse donner à quelqu'un l'autorisation de le prendre
    */
    function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        zombieApprovals[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId);
    }

    /**
    * la fonction devra simplement vérifier que msg.sender a été approuvé à prendre ce token / zombie, et appeler _transfer si c'est le cas
    */
    function takeOwnership(uint256 _tokenId) public {
        require(zombieApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}
