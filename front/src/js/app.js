const cryptoZombiesABI = require("./js/cryptoZombies_abi");

var cryptoZombies;
var userAccount;

function startApp() {
    var cryptoZombiesAddress = "YOUR_CONTRACT_ADDRESS";
    cryptoZombies = new web3js.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress); // Instanciation de myContract

    var accountInterval = setInterval(function() {
        // Check if account has changed
        if (web3.eth.accounts[0] !== userAccount) {
            userAccount = web3.eth.accounts[0]; // permet de cconnaitre le compate actif de metamasqk
            // Call a function to update the UI with the new account
            getZombiesByOwner(userAccount)
                .then(displayZombies);
        }
    }, 100);

    cryptoZombies.events.Transfer({ filter: { _to: userAccount } })
        .on("data", function(event) {
            let data = event.returnValues;
            getZombiesByOwner(userAccount).then(displayZombies);
        }).on("error", console.error);
}

function displayZombies(ids) {
    $("#zombies").empty();
    for (id of ids) {
        // Look up zombie details from our contract. Returns a `zombie` object
        getZombieDetails(id)
            .then(function(zombie) {
                // Using ES6's "template literals" to inject variables into the HTML.
                // Append each one to our #zombies div
                $("#zombies").append(`<div class="zombie">
          <ul>
            <li>Name: ${zombie.name}</li>
            <li>DNA: ${zombie.dna}</li>
            <li>Level: ${zombie.level}</li>
            <li>Wins: ${zombie.winCount}</li>
            <li>Losses: ${zombie.lossCount}</li>
            <li>Ready Time: ${zombie.readyTime}</li>
          </ul>
        </div>`);
            });
    }
}

function createRandomZombie(name) {
    // This is going to take a while, so update the UI to let the user know
    // the transaction has been sent
    $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");
    // Send the tx to our contract:
    return cryptoZombies.methods.createRandomZombie(name)
        .send({ from: userAccount })
        .on("receipt", function(receipt) {
            $("#txStatus").text("Successfully created " + name + "!");
            // Transaction was accepted into the blockchain, let's redraw the UI
            getZombiesByOwner(userAccount).then(displayZombies);
        })
        .on("error", function(error) {
            // Do something to alert the user their transaction has failed
            $("#txStatus").text(error);
        });
}

function feedOnKitty(zombieId, kittyId) {
    $("#txStatus").text("Eating a kitty. This may take a while...");
    return cryptoZombies.methods.feedOnKitty(zombieId, kittyId)
        .send({ from: userAccount })
        .on("receipt", function(receipt) {
            $("#txStatus").text("Ate a kitty and spawned a new Zombie!");
            getZombiesByOwner(userAccount).then(displayZombies);
        })
        .on("error", function(error) {
            $("#txStatus").text(error);
        });
}

/**
permet d'augmenter le niveau en payant
*/
function levelUp(zombieId) {
    $("#txStatus").text("Leveling up your zombie...");
    return cryptoZombies.methods.levelUp(zombieId)
        .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
        .on("receipt", function(receipt) {
            $("#txStatus").text("Power overwhelming! Zombie successfully leveled up");
        })
        .on("error", function(error) {
            $("#txStatus").text(error);
        });
}

function attack(zombieId, targetId){
    $("#txStatus").text("Attack a zombie...");
    return cryptoZombies.methods.attack(zombieId, targetId)
    .send({from: userAccount, value: web3.utils.toWei("0.001", "ether")})
    .on("receipt", function(receipt) {
        $("#txStatus").text("Zombie successfully attack");
    })
    .on("error", function(error) {
        $("#txStatus").text(error);
    });
}

function changeName(zombieId, newName){
    $("#txStatus").text("change name a zombie...");
    return cryptoZombies.methods.changeName(zombieId, newName)
    .send({from: userAccount, value: web3.utils.toWei("0.001", "ether")})
    .on("receipt", function(receipt) {
        $("#txStatus").text("Zombie successfully change name");
    })
    .on("error", function(error) {
        $("#txStatus").text(error);
    });
}

function changeDna(zombieId, newDna){
 $("#txStatus").text("change dna a zombie...");
    return cryptoZombies.methods.changeDna(zombieId, newDna)
    .send({from: userAccount, value: web3.utils.toWei("0.001", "ether")})
    .on("receipt", function(receipt) {
        $("#txStatus").text("Zombie successfully change dna");
    })
    .on("error", function(error) {
        $("#txStatus").text(error);
    });
}

function transfer(to, tokenId){
     $("#txStatus").text("Transfer the token...");
        return cryptoZombies.methods.transfer(to, tokenId)
        .send({from: userAccount, value: web3.utils.toWei("0.001", "ether")})
        .on("receipt", function(receipt) {
            $("#txStatus").text("Zombie successfully transfer");
        })
        .on("error", function(error) {
            $("#txStatus").text(error);
        });
}

function ownerOf(){
 return cryptoZombies.methods.ownerOf(tokenId).call();
 }

function balanceOf(){
    return cryptoZombies.methods.balanceOf(owner).call();
}

/**
permet de récuperer le details d'un zombie
*/
function getZombieDetails(id) {
    return cryptoZombies.methods.zombies(id).call();
}

function zombieToOwner(id) {
    return cryptoZombies.methods.zombieToOwner(id).call();
}

function getZombiesByOwner(owner) {
    return cryptoZombies.methods.getZombiesByOwner(owner).call();
}

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
    } else {
        // Handle the case where the user doesn't have MetaMask installed
        // Probably show them a message prompting them to install MetaMask
    }
    // Now you can start your app & access web3 freely:
    startApp()
});

/* ADMIN */

function setKittyContractAddress(){}

function setLevelUpFee(){}

function withdraw(){}
