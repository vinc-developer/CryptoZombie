pragma solidity ^0.8.0;

import "./utils/Ownable.sol";
import "./maths/SafeMath.sol";

contract ZombieFactory is Ownable {

    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    event NewZombie(uint zombieId, string name, uint dna); // evenement ennvoyé au front pour informé de la création d'un nouveau zombie
    uint dnaDigits = 16; // entier non signé uint256
    uint dnaModulus = 10 ** dnaDigits; // 10 à la puissance de 16
    uint coolDownTime = 1 days;

    // Objet
    struct Zombie {
        string name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        uint16 winCount;
        uint16 lossCount;
    }

    Zombie[] public zombies; // tableau dynamique pouvant etre uniquement lu par les autres contract

    mapping (uint => address) public zombieToOwner; //Un mappage est fondamentalement un stockage de valeur-clé pour stocker et rechercher des données.
    mapping (address => uint) ownerZombieCount;

    function _createZombie(string _name, uint _dna) internal { // internal signifie fonction privé pouvant etre utilisé par un contract heritant de la classe ou il ce trouve
        uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + coolDownTime), 0, 0)) - 1;
        zombieToOwner[id] = msg.sender; // stock l'id sur l'addresse de la personne ou du smart contract
        ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].add(1); // incrémente la variable
        NewZombie(id, _name, _dna); // déclenchement de l'évenement
    }

    function _generateRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str)); // genere un chiffre aleatoire grace au system de hash
        return rand % dnaModulus;
    }

    function createRandomZombie(string _name) public {
        require(ownerZombieCount[msg.sender] == 0); // verifie que l'address appel la fonction qu'une seul fois
        uint randDna = _generateRandomDna(_name);
        _createZombie(_name, randDna);
    }
}
